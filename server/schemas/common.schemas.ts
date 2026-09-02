import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID parameter is required'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const emailQuerySchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['parent', 'teacher', 'admin', 'guest']).optional(),
});

export type IdParam = z.infer<typeof idParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
