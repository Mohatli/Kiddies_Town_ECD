import { Request, Response, NextFunction } from 'express';
import { dbQuery } from '../config/database';
import logger from '../utils/logger';
import type { AuthenticatedRequest, AuditLogEntry } from '../types/index';

const AUDIT_TABLE = 'kt_audit_logs';

/**
 * Create an audit log entry for POPIA compliance.
 * Records who did what, when, and from where.
 */
export async function createAuditLog(
  operatorId: string,
  actionType: string,
  payload: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  const logEntry: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    operatorId,
    timestamp: new Date().toISOString(),
    actionType,
    payload,
    ipAddress,
  };

  try {
    await dbQuery(
      async (sql) => {
        await sql`INSERT INTO ${sql(AUDIT_TABLE)} (id, user_email, action, payload, timestamp) VALUES (${logEntry.id}, ${logEntry.operatorId}, ${logEntry.actionType}, ${JSON.stringify(logEntry.payload)}, ${logEntry.timestamp})`;
      },
      (store) => {
        store.auditLogs.unshift(logEntry as unknown as Record<string, unknown>);
      }
    );
  } catch (err) {
    // Audit logging should never crash the request
    logger.error({ error: err, logEntry }, 'Failed to write audit log');
  }
}

/**
 * Audit logging middleware — automatically logs requests to protected endpoints.
 * Use for sensitive operations that need POPIA-compliant tracking.
 */
export function auditMiddleware(actionType: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const operatorId = authReq.user?.email || 'anonymous';

    await createAuditLog(operatorId, actionType, {
      method: req.method,
      path: req.originalUrl,
      body: req.method !== 'GET' ? req.body : undefined,
    }, req.ip);

    next();
  };
}
