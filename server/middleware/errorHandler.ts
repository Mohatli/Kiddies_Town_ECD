import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Centralized error handling middleware.
 * Must be registered LAST in the Express middleware chain.
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  // Log the error
  if (err instanceof AppError && err.isOperational) {
    logger.warn({
      err: { message: err.message, code: err.code, statusCode: err.statusCode },
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    }, 'Operational error');
  } else {
    logger.error({
      err: { message: err.message, stack: err.stack, name: err.name },
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    }, 'Unexpected error');
  }

  // Handle AppError instances
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Handle JWT errors (from jsonwebtoken)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Authentication failed. Please log in again.',
    });
    return;
  }

  // Handle syntax errors (malformed JSON)
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body.',
    });
    return;
  }

  // Unknown errors — don't leak internals in production
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({
    success: false,
    error: isProduction
      ? 'An internal server error occurred. Please try again later.'
      : err.message,
  });
}
