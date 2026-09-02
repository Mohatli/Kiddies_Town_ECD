import dotenv from 'dotenv';
dotenv.config();

import { initializeDatabase } from './config/database';
import { bootstrapSchema } from './db/bootstrap';
import { createApp } from './app';
import logger from './utils/logger';

const PORT = parseInt(process.env.PORT || '3000', 10);

async function main() {
  // 1. Initialize database connection
  initializeDatabase(process.env.DATABASE_URL);

  // 2. Bootstrap schema and seed data
  await bootstrapSchema();

  // 3. Create and start Express app
  const app = await createApp();

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Kiddies Town Academy server running on http://localhost:${PORT}`);
    logger.info(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

main().catch((err) => {
  logger.error({ error: err, message: err.message, stack: err.stack, code: err.code }, '💥 Failed to start server');
  process.exit(1);
});
