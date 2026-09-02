import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter — 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
});

/**
 * Auth endpoints rate limiter — 10 requests per 15 minutes
 * Protects against brute-force login attempts
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

/**
 * API data endpoints rate limiter — 60 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: 'API rate limit exceeded. Please try again later.',
  },
});
