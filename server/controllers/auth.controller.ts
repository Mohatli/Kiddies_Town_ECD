import type { Request, Response } from 'express';
import { dbQuery, parseJsonbData, getFallbackStore, saveFallbackStore, rowToEntity, MAPPINGS } from '../config/database';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth';
import { createAuditLog } from '../middleware/auditLog';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { TABLES } from '../db/tables';
import logger from '../utils/logger';
import type { AuthenticatedRequest } from '../types/index';

/**
 * POST /auth/signup
 * Register a new user account. Hashes password with bcrypt before storing.
 * Auto-creates parent profile for parent registrations (preserves lines 1258-1313 behavior).
 */
export async function signup(req: Request, res: Response): Promise<void> {
  const { email, password, role, name } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const { result: userExists } = await dbQuery(
    async (sql) => {
      const results = await sql.query(`SELECT * FROM ${TABLES.users} WHERE id = $1`, [normalizedEmail]);
      return results && results.length > 0;
    },
    (store) => store.users.some((u: any) => u.id === normalizedEmail)
  );

  if (userExists) {
    res.status(400).json({ success: false, error: 'An account with this email/Academic ID already exists.' });
    return;
  }

  // Hash password with bcrypt before storing
  const hashedPassword = await hashPassword(password);
  const newUser = { id: normalizedEmail, email: normalizedEmail, password: hashedPassword, role, name };

  // Insert user
  const { source } = await dbQuery(
    async (sql) => {
      await sql.query(`INSERT INTO ${TABLES.users} (id, email, password_hash, role, name) VALUES ($1, $2, $3, $4, $5)`, 
        [normalizedEmail, newUser.email, newUser.password, newUser.role, newUser.name]);
      return true;
    },
    (store) => {
      store.users.push(newUser as any);
      saveFallbackStore();
      return true;
    }
  );

  // Auto-generate parent profile details for new parents (preserves demo functionality)
  if (role === 'parent') {
    const parentLastName = name.includes(' ') ? name.split(' ').slice(-1)[0] : 'Mbeki';
    const parentFirstName = name.includes(' ') ? name.split(' ')[0] : name;

    const sampleParentProfile = {
      name: name,
      email: normalizedEmail,
      phone: '+27 82 ' + Math.floor(1000000 + Math.random() * 9000000),
      address: '12 Pioneer Street, Ster Park, Polokwane',
      maritalStatus: 'Married',
      childLivesWith: 'Both Parents',
      mother: {
        title: 'Mrs.',
        surname: parentLastName,
        firstNames: parentFirstName,
        idNumber: '8804100012081',
        occupation: 'Manager',
        employer: 'Local Corporate',
        telWork: '015 291 0000',
        telHome: '015 291 4455',
        cellNo: '082 123 4567',
        email: normalizedEmail,
        homeAddress: '12 Pioneer Street, Ster Park, Polokwane',
        postalAddress: 'P.O. Box 1024, Polokwane',
        workAddress: 'Polokwane Central',
      },
      father: {
        title: 'Mr.',
        surname: parentLastName,
        firstNames: 'Thabo',
        idNumber: '8602120012085',
        occupation: 'Consultant',
        employer: 'FTech',
        telWork: '015 291 1122',
        telHome: '015 291 4455',
        cellNo: '081 223 3445',
        email: 'father@mail.com',
        homeAddress: '12 Pioneer Street, Ster Park, Polokwane',
        postalAddress: 'P.O. Box 1024, Polokwane',
        workAddress: 'Polokwane Business District',
      },
    };

    await dbQuery(
      async (sql) => {
        await sql.query(
          `INSERT INTO ${TABLES.parentProfile} (id, email, name, phone, address, marital_status, child_lives_with, mother, father) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, 
          [
            normalizedEmail, 
            sampleParentProfile.email, 
            sampleParentProfile.name, 
            sampleParentProfile.phone, 
            sampleParentProfile.address, 
            sampleParentProfile.maritalStatus, 
            sampleParentProfile.childLivesWith, 
            JSON.stringify(sampleParentProfile.mother), 
            JSON.stringify(sampleParentProfile.father)
          ]
        );
      },
      (store) => {
        if (!store.parentProfiles) store.parentProfiles = {} as any;
        (store.parentProfiles as any)[normalizedEmail] = sampleParentProfile;
        saveFallbackStore();
      }
    );
  }

  const userPayload = { email: normalizedEmail, role, name };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  res.json({
    success: true,
    user: { role, name, email: normalizedEmail },
    token: accessToken,
    accessToken,
    refreshToken,
  });
}

/**
 * POST /auth/login
 * Authenticate user with bcrypt password comparison. Returns both tokens.
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password, role } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const { result: foundUser } = await dbQuery(
    async (sql) => {
      const results = await sql.query(`SELECT * FROM ${TABLES.users} WHERE id = $1`, [normalizedEmail]);
      if (results && results.length > 0) {
        const u = rowToEntity<any>(results[0], MAPPINGS.users);
        if (u.role === role) {
          return u;
        }
      }
      return null;
    },
    (store) => {
      const u = store.users.find((usr: any) => usr.id === normalizedEmail) as any;
      if (u && u.role === role) {
        return u; // Return the user, we'll check password outside dbQuery
      }
      return null;
    }
  );

  const isValidPassword = foundUser ? await comparePassword(password, foundUser.password ?? '') : false;

  if (foundUser && isValidPassword) {
    const userPayload = { email: foundUser.email, role: foundUser.role, name: foundUser.name };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    res.json({
      success: true,
      user: {
        role: foundUser.role,
        name: foundUser.name,
        email: foundUser.email,
      },
      token: accessToken,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Access Denied: The credentials do not match the selected school profile.',
    });
  }
}

/**
 * POST /auth/refresh-token
 * Verify refresh token and issue new access token.
 */
export async function refreshToken(req: Request, res: Response): Promise<void> {
  const { refreshToken: token } = req.body;

  try {
    const decoded = verifyRefreshToken(token);
    const accessToken = generateAccessToken(decoded);

    res.json({
      success: true,
      accessToken,
    });
  } catch {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token. Please log in again.',
    });
  }
}

/**
 * POST /auth/change-password
 * Self-service password change for any authenticated user.
 * Verifies the current password, then stores a fresh bcrypt hash
 * in whichever store (Postgres or local fallback) is active.
 */
export async function changePassword(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const email = authReq.user.email.toLowerCase().trim();
  const { currentPassword, newPassword } = req.body;

  // Fetch stored hash from the active store
  const { result: storedHash } = await dbQuery(
    async (sql) => {
      const results = await sql.query(`SELECT password_hash FROM ${TABLES.users} WHERE id = $1`, [email]);
      return results && results.length > 0 ? (results[0].password_hash as string) : null;
    },
    (store) => {
      const u = store.users.find((usr: any) => usr.id === email) as any;
      return u ? (u.password as string) : null;
    }
  );

  if (!storedHash || !(await comparePassword(currentPassword, storedHash))) {
    res.status(401).json({ success: false, error: 'The current password you entered is incorrect.' });
    return;
  }

  if (await comparePassword(newPassword, storedHash)) {
    res.status(409).json({ success: false, error: 'The new password must be different from the current password.' });
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  await dbQuery(
    async (sql) => {
      await sql.query(`UPDATE ${TABLES.users} SET password_hash = $1 WHERE id = $2`, [hashedPassword, email]);
      return true;
    },
    (store) => {
      const u = store.users.find((usr: any) => usr.id === email) as any;
      if (u) u.password = hashedPassword;
      saveFallbackStore();
      return true;
    }
  );

  await createAuditLog(email, 'PASSWORD_CHANGE', { email }, req.ip);

  logger.info({ email }, 'User changed their own password');

  res.json({ success: true, message: 'Your password has been updated successfully.' });
}
