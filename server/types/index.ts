import type { Request, Response, NextFunction } from 'express';

export interface UserPayload {
  email: string;
  role: 'parent' | 'teacher' | 'admin' | 'guest';
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuditLogEntry {
  id: string;
  operatorId: string;
  timestamp: string;
  actionType: string;
  resource?: string;
  resourceId?: string;
  payload: Record<string, unknown>;
  ipAddress?: string;
}

export type AsyncHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;
