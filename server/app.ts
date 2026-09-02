import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import v1Routes from './routes/v1/index';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { requireAuth } from './middleware/auth';
import { getAllData } from './controllers/data.controller';
import logger from './utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

export async function createApp() {
  const app = express();

  app.use(compression());

  // === Security Middleware ===
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }));

  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // Allow Vercel preview deployments
    ...(process.env.VERCEL ? { origin: true } : {}),
  }));

  // === Body Parsing ===
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // === Rate Limiting ===
  app.use('/api', generalLimiter);

  // === Health Check ===
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), version: '2.0.0' });
  });

  // === API v1 Routes ===
  app.use('/api/v1', v1Routes);

  // === Backward-Compatible Routes (mount same controllers at /api/) ===
  app.use('/api', v1Routes);

  // Legacy /api/all-data endpoint (maps to /api/data/)
  app.get('/api/all-data', requireAuth(true), getAllData);

  // === Vite Dev Server / Static Serving ===
  if (process.env.NODE_ENV !== 'production') {
    // Import Vite and its plugins directly — bypasses tsx's broken path resolver
    // that fails on directory names with spaces (e.g. "New folder").
    // Using configFile: false avoids loading vite.config.ts through tsx's hooks.
    const { createServer: createViteServer } = await import('vite');
    const react = (await import('@vitejs/plugin-react')).default;
    const tailwindcss = (await import('@tailwindcss/vite')).default;

    const vite = await createViteServer({
      configFile: false,
      root: PROJECT_ROOT,
      plugins: [react(), tailwindcss()],
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(PROJECT_ROOT, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // === Error Handler (must be LAST middleware) ===
  app.use(errorHandler);

  return app;
}
