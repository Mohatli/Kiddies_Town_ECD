import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Zod validation middleware factory.
 * Validates the specified request property against the provided schema.
 * 
 * @param schema - Zod schema to validate against
 * @param source - Which part of the request to validate
 */
export function validate(schema: ZodSchema, source: 'body' | 'params' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      // Replace the original with parsed (Zod transforms & defaults applied)
      (req as unknown as Record<string, unknown>)[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        }));

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
        return;
      }
      next(err);
    }
  };
}
