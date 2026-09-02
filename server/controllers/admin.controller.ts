import type { Request, Response } from 'express';
import crypto from 'crypto';
import { dbQuery, parseJsonbData, getFallbackStore, saveFallbackStore, isNeonActive, getSqlConnection, normalizeUserPasswords, rowToEntity, MAPPINGS } from '../config/database';
import { createAuditLog } from '../middleware/auditLog';
import { hashPassword } from '../middleware/auth';
import { TABLES } from '../db/tables';
import { bootstrapSchema, initialUsers } from '../db/bootstrap';
import logger from '../utils/logger';
import type { AuthenticatedRequest } from '../types/index';
import {
  initialLearners, initialParentProfile, initialProgressReports,
  initialPaymentHistory, initialChatHistory, initialWeeklyThemes,
  initialSchoolEvents, initialJournalPosts, initialEnrolments,
  initialParentProfiles,
} from '../../src/data/mockData';

/**
 * POST /admin/create-parent
 * Re-implements server.ts lines 1038-1123.
 */
export async function createParent(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const { name, email } = req.body;
  const targetEmail = email.toLowerCase().trim();
  let issuedTempPassword: string | null = null;

  const { result: userExists } = await dbQuery(
    async (sql) => {
      const resU = await sql.query(`SELECT id FROM ${TABLES.users} WHERE id = $1`, [targetEmail]);
      return resU && resU.length > 0;
    },
    (store) => store.users.some((u: any) => u.id === targetEmail)
  );

  if (!userExists) {
    const tempPassword = crypto.randomBytes(9).toString('base64url');
    issuedTempPassword = tempPassword;
    const hashedPw = await hashPassword(tempPassword);
    const newUser = { id: targetEmail, email: targetEmail, password: hashedPw, role: 'parent', name };

    await dbQuery(
      async (sql) => {
        await sql.query(`INSERT INTO ${TABLES.users} (id, email, password_hash, role, name) VALUES ($1, $2, $3, $4, $5)`, [targetEmail, newUser.email, newUser.password, newUser.role, newUser.name]);
      },
      (store) => {
        store.users.push(newUser as any);
      }
    );
  }

  const parentProfile = {
    name, email: targetEmail,
    phone: '+27 82 111 2233', address: 'Kiddies Town Area, Polokwane',
    maritalStatus: 'Single', childLivesWith: 'Mother',
    mother: {
      title: 'Ms.', surname: name.split(' ').slice(-1)[0] || name,
      firstNames: name.split(' ')[0] || name, idNumber: '9001010012089',
      occupation: 'Professional', employer: 'Kiddies Corp',
      telWork: '015 291 0000', telHome: '015 291 1122', cellNo: '082 111 2233',
      email: targetEmail, homeAddress: 'Kiddies Town Area, Polokwane',
      postalAddress: 'P.O. Box 123', workAddress: 'Polokwane Central',
    },
    father: {
      title: 'Mr.', surname: 'Mbeki', firstNames: 'Unknown', idNumber: 'Unknown',
      occupation: 'Unknown', employer: 'Unknown',
      telWork: '', telHome: '', cellNo: '', email: '',
      homeAddress: '', postalAddress: '', workAddress: '',
    },
  };

  await dbQuery(
    async (sql) => {
      const mother = parentProfile.mother || {};
      const father = parentProfile.father || {};
      await sql.query(
        `INSERT INTO ${TABLES.parentProfile} (id, email, name, phone, address, marital_status, child_lives_with, mother, father)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, phone = EXCLUDED.phone,
           address = EXCLUDED.address, marital_status = EXCLUDED.marital_status, child_lives_with = EXCLUDED.child_lives_with,
           mother = EXCLUDED.mother, father = EXCLUDED.father`,
        [targetEmail, targetEmail, name, parentProfile.phone, parentProfile.address,
         parentProfile.maritalStatus, parentProfile.childLivesWith,
         JSON.stringify(mother), JSON.stringify(father)]
      );
    },
    (store) => {
      if (!store.parentProfiles) store.parentProfiles = {} as any;
      (store.parentProfiles as any)[targetEmail] = parentProfile;
    }
  );

  saveFallbackStore();
  await createAuditLog(authReq.user.email, 'CREATE_PARENT_PROFILE_QUICK', { name, email: targetEmail });
  res.json({
    success: true,
    email: targetEmail,
    ...(issuedTempPassword ? { tempPassword: issuedTempPassword } : {}),
  });
}

/**
 * POST /admin/send-bulk-emails
 * Re-implements server.ts lines 1127-1195.
 */
export async function sendBulkEmails(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const { studentIds, subject, body, template } = req.body;

  const { result: learnersList } = await dbQuery(
    async (sql) => {
      const dbLearners = await sql.query(`SELECT * FROM ${TABLES.learners}`);
      return dbLearners.map((r: any) => rowToEntity<any>(r, MAPPINGS.learners));
    },
    (store) => [...store.learners]
  );

  const selectedStudents = (learnersList as any[]).filter((l: any) => studentIds.includes(l.id));
  if (selectedStudents.length === 0) {
    res.status(404).json({ success: false, error: 'None of the selected students were found in the database.' });
    return;
  }

  const notifications: Array<{ studentName: string; parentEmail: string }> = [];
  selectedStudents.forEach((student: any) => {
    if (student.parentEmail) {
      notifications.push({
        studentName: `${student.firstNames} ${student.surname}`,
        parentEmail: student.parentEmail.toLowerCase().trim(),
      });
    }
  });

  if (notifications.length === 0) {
    res.status(400).json({ success: false, error: 'None of the selected students are linked to a parent email address.' });
    return;
  }

  const parentEmails = Array.from(new Set(notifications.map((n) => n.parentEmail)));
  const studentNames = notifications.map((n) => n.studentName);

  await createAuditLog(authReq.user.email, 'BULK_EMAIL_DISPATCH', {
    template, subject,
    studentCount: selectedStudents.length, parentCount: parentEmails.length,
    studentNames, parentEmails,
    bodyPreview: body.substring(0, 150) + (body.length > 150 ? '...' : ''),
  });

  res.json({
    success: true,
    message: `Successfully dispatched template-based notification to ${parentEmails.length} parent contact${parentEmails.length !== 1 ? 's' : ''}.`,
    notifiedCount: parentEmails.length,
    recipients: parentEmails,
    students: studentNames,
  });
}

/**
 * POST /admin/send-arrears-notice
 * Re-implements server.ts lines 1198-1215.
 */
export async function sendArrearsNotice(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const { parentName, amount } = req.body;

  await createAuditLog(authReq.user.email, 'FEE_ADJUSTMENT', {
    description: `Dispatched financial arrears warning notification to ${parentName}`,
    amount: amount || 0,
    status: 'Notice Sent',
  });

  res.json({ success: true, message: 'Arrears notification successfully dispatched and audited' });
}

/**
 * GET /admin/audit-logs
 * Re-implements server.ts lines 1008-1036.
 */
export async function getAuditLogs(req: Request, res: Response): Promise<void> {
  const { result: logs } = await dbQuery(
    async (sql) => {
      const dbLogs = await sql.query(`SELECT id, user_email, action, payload, timestamp FROM ${TABLES.auditLogs} ORDER BY timestamp DESC LIMIT 500`);
      return dbLogs.map((r: any) => {
        let payload = r.payload;
        if (typeof payload === 'string') {
          try { payload = JSON.parse(payload); } catch { payload = { raw: payload }; }
        }
        return { id: r.id, operatorId: r.user_email, actionType: r.action, payload, timestamp: r.timestamp };
      });
    },
    (store) => store.auditLogs || []
  );

  let processedLogs = (logs as any[]).map((item: any) => {
    if (item && item.payload_diff && !item.payload) {
      try {
        item.payload = typeof item.payload_diff === 'string' ? JSON.parse(item.payload_diff) : item.payload_diff;
      } catch {
        item.payload = { raw: item.payload_diff };
      }
    }
    return item;
  });

  processedLogs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(processedLogs);
}

/**
 * POST /admin/reset-db
 * Re-implements server.ts lines 1364-1412.
 */
export async function resetDatabase(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;

  try {
    if (isNeonActive() && getSqlConnection()) {
      const sql = getSqlConnection()!;
      logger.info('🧹 Dropping tables for reset-db trigger...');
      const tableNames = Object.values(TABLES);
      for (const name of tableNames) {
        await sql.query(`DROP TABLE IF EXISTS ${name} CASCADE`);
      }

      logger.info('🌱 Re-bootstrapping and seeding tables with latest mockData contents...');
      await bootstrapSchema();
      await createAuditLog(authReq.user.email, 'RESET_DB', { store: 'Neon Cloud DB' });

      res.json({
        success: true,
        message: 'Neon Cloud DB dropped and successfully synchronized with the updated mockData structures!',
      });
    } else {
      const store = getFallbackStore();
      store.learners = [...initialLearners] as any[];
      store.parentProfile = { ...initialParentProfile, email: 'parent@kiddiestown.co.za' } as any;
      store.parentProfiles = { ...initialParentProfiles } as any;
      store.progressReports = [...initialProgressReports] as any[];
      store.paymentHistory = (initialPaymentHistory as any[]).map((p: any) => {
        const matchingLearner = initialLearners.find((l) => l.id === p.learnerId);
        return { ...p, parentEmail: matchingLearner?.parentEmail || 'parent@kiddiestown.co.za' };
      });
      store.chatHistory = (initialChatHistory as any[]).map((c: any) => ({
        ...c,
        parentEmail: 'parent@kiddiestown.co.za',
      }));
      store.themes = [...initialWeeklyThemes] as any[];
      store.events = [...initialSchoolEvents] as any[];
      store.journalPosts = [...initialJournalPosts] as any[];
      store.enrolments = [...initialEnrolments] as any[];
      store.users = [...initialUsers] as any[];
      store.auditLogs = [];
      normalizeUserPasswords(store);
      saveFallbackStore();

      await createAuditLog(authReq.user.email, 'RESET_DB', { store: 'Durable JSON Local File' });

      res.json({
        success: true,
        message: 'Demo memory cache successfully reset to latest mockData definitions.',
      });
    }
  } catch (err: any) {
    logger.error({ error: err }, 'Failed to reset application database');
    res.status(500).json({ success: false, error: err.message || 'Failed to reset application database tables.' });
  }
}
