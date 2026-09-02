/**
 * Vercel Serverless Function entry point.
 *
 * This file is the bridge between Vercel's serverless runtime and the
 * existing Express application. Vercel compiles this file and bundles
 * all imported server code into a single serverless function.
 *
 * Route mapping (vercel.json):
 *   /api/*          → this function (Express handles all /api routes)
 *   Everything else → static SPA from dist/
 */
import type { Request, Response } from 'express';
import { createApp } from '../server/app';
import { initializeDatabase } from '../server/config/database';
import { bootstrapSchema } from '../server/db/bootstrap';

// Initialize database once (shared across warm invocations)
initializeDatabase(process.env.DATABASE_URL);

let app: any = null;

async function getApp() {
  if (!app) {
    app = await createApp();
  }
  return app;
}

export default async function handler(req: Request, res: Response) {
  // Bootstrap schema on first request (safe — gated for production)
  if (!app) {
    await bootstrapSchema();
  }

  const expressApp = await getApp();
  return expressApp(req, res);
}
