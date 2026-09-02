import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/environment';
import { UnauthorizedError } from '../utils/errors';
import type { AuthenticatedRequest, UserPayload } from '../types/index';

export { hashPassword, comparePassword } from '../config/passwordHasher';

const ACCESS_TOKEN_EXPIRY = '2h';
const REFRESH_TOKEN_EXPIRY = '30d';

/**
 * Generate a JWT access token (short-lived: 2 hours)
 */
export function generateAccessToken(payload: UserPayload): string {
  return jwt.sign(
    { email: payload.email, role: payload.role, name: payload.name, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY, issuer: 'kiddies-town', algorithm: 'HS256' }
  );
}

/**
 * Generate a JWT refresh token (long-lived: 30 days)
 */
export function generateRefreshToken(payload: UserPayload): string {
  return jwt.sign(
    { email: payload.email, role: payload.role, name: payload.name, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY, issuer: 'kiddies-town', algorithm: 'HS256' }
  );
}

/**
 * Verify and decode a JWT token
 */
export function verifyAccessToken(token: string): UserPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    issuer: 'kiddies-town',
    algorithms: ['HS256'],
  }) as jwt.JwtPayload & UserPayload & { type: string };

  if (decoded.type !== 'access') {
    throw new UnauthorizedError('Invalid token type');
  }

  return { email: decoded.email, role: decoded.role, name: decoded.name };
}

/**
 * Verify and decode a refresh token
 */
export function verifyRefreshToken(token: string): UserPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, {
    issuer: 'kiddies-town',
    algorithms: ['HS256'],
  }) as jwt.JwtPayload & UserPayload & { type: string };

  if (decoded.type !== 'refresh') {
    throw new UnauthorizedError('Invalid token type');
  }

  return { email: decoded.email, role: decoded.role, name: decoded.name };
}

/**
 * Authentication middleware — extracts and verifies Bearer token from Authorization header.
 * Populates req.user with the decoded payload.
 */
export function requireAuth(allowGuest = false) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : undefined;

    if (!token) {
      if (allowGuest) {
        (req as AuthenticatedRequest).user = {
          email: 'guest@kiddiestown.co.za',
          role: 'guest',
          name: 'Guest User',
        };
        return next();
      }
      throw new UnauthorizedError('Access denied: authentication token is required');
    }

    try {
      const decoded = verifyAccessToken(token);
      (req as AuthenticatedRequest).user = decoded;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Session expired. Please log in again.');
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid authentication token.');
      }
      throw err;
    }
  };
}
