import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';
import type { AuthenticatedRequest } from '../types/index';

/**
 * Role-based access control middleware.
 * Must be used AFTER requireAuth() middleware.
 * 
 * @param allowedRoles - Roles that are permitted to access the route
 * @returns Express middleware
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new ForbiddenError('Authentication required before authorization');
    }

    if (!allowedRoles.includes(authReq.user.role)) {
      // Generic message — don't leak the user's actual role
      throw new ForbiddenError('You do not have permission to access this resource');
    }

    next();
  };
}
