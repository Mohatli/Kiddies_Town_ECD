import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const isDev = (process.env.NODE_ENV || 'development') !== 'production';
const DEV_SECRET = 'dev-only-secret-do-not-use-in-production-min32chars';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: isDev
    ? z.string().min(32).default(DEV_SECRET)
    : z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: isDev
    ? z.string().min(32).default(DEV_SECRET + '-refresh')
    : z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  GEMINI_API_KEY: z.string().optional(),
  APP_URL: z.string().optional(),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const missing = parsed.error.issues.map(
      (issue) => `  ${issue.path.join('.')}: ${issue.message}`
    );
    console.error('❌ Invalid environment variables:\n' + missing.join('\n'));
    console.error('\nCopy .env.example to .env and fill in the required values.');
    process.exit(1);
  }

  return parsed.data;
}

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;
