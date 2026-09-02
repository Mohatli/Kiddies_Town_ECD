# Kiddies Town ECD & Academy — Vercel + Neon Deployment Guide

**Version:** 1.0
**Date:** 26 August 2026
**Platform:** Vercel (Frontend + API) + NeonDB (PostgreSQL)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Environment Variables](#3-environment-variables)
4. [Repository Setup](#4-repository-setup)
5. [Vercel Deployment](#5-vercel-deployment)
6. [Neon Database Setup](#6-neon-database-setup)
7. [Post-Deployment Verification](#7-post-deployment-verification)
8. [Troubleshooting](#8-troubleshooting)
9. [Files Modified for Deployment](#9-files-modified-for-deployment)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER                            │
│                                                         │
│  React SPA (Vite)          Express API Server           │
│  ─────────────────         ─────────────────            │
│  Static files served       Serverless Function          │
│  from Vercel CDN           (api/index.ts)               │
│  via /assets/*             handles /api/*               │
│                                                         │
└────────────┬────────────────────────┬───────────────────┘
             │                        │
             ▼                        ▼
┌────────────────────┐    ┌────────────────────────┐
│   Vercel CDN       │    │  Vercel Serverless     │
│   (Static Assets)  │    │  Function              │
│                    │    │                        │
│  - index.html      │    │  - Express App         │
│  - JS chunks       │    │  - JWT Auth            │
│  - CSS             │    │  - Rate Limiting       │
│  - Images          │    │  - RBAC                │
└────────────────────┘    └───────────┬────────────┘
                                      │
                                      ▼
                           ┌────────────────────────┐
                           │   NeonDB (PostgreSQL)   │
                           │                        │
                           │  - Serverless driver   │
                           │  - HTTP-based queries  │
                           │  - No persistent conn  │
                           └────────────────────────┘
```

### Request Flow

1. Browser requests `https://your-app.vercel.app/` → Vercel serves `dist/index.html`
2. Browser requests `https://your-app.vercel.app/api/data/learners` → Vercel rewrites to serverless function
3. Serverless function runs Express app → queries NeonDB via HTTP → returns JSON
4. React Query caches the response client-side

---

## 2. Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 18+ | Recommended: 20 LTS |
| npm | 9+ | |
| Git | 2.30+ | |
| GitHub account | — | For repository hosting |
| Vercel account | — | Free tier sufficient for start |
| Neon account | — | Free tier: 0.5 GB storage |

---

## 3. Environment Variables

### Required (set in Vercel Dashboard)

| Variable | Value | How to Generate |
|----------|-------|-----------------|
| `DATABASE_URL` | `postgresql://...` | Neon dashboard → Connection Details |
| `JWT_SECRET` | 64+ char random string | `openssl rand -hex 64` |
| `JWT_REFRESH_SECRET` | 64+ char random string | `openssl rand -hex 64` |
| `NODE_ENV` | `production` | Static value |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | Your Vercel domain |

### Optional

| Variable | Default | Notes |
|----------|---------|-------|
| `GEMINI_API_KEY` | — | Google AI PDF generation |
| `APP_URL` | — | Used for email links |
| `PORT` | `3000` | Ignored on Vercel |

### Setting Environment Variables on Vercel

```bash
# Via Vercel CLI
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add JWT_REFRESH_SECRET production
vercel env add NODE_ENV production
vercel env add CORS_ORIGIN production

# Or via Vercel Dashboard:
# Project Settings → Environment Variables → Add
```

---

## 4. Repository Setup

### 4.1 Initialize Git (if not already done)

```bash
cd "path/to/kiddies-town-portal"
git init
git add -A
git commit -m "feat: initial deployment configuration"
```

### 4.2 Create .gitignore Entries

Ensure these are in `.gitignore`:

```
# Environment
.env
.env.local
.env.*.local

# Build
dist/
.tmp/

# Data
data_store.json

# Dependencies
node_modules/

# IDE
.vscode/
.idea/
```

### 4.3 Push to GitHub

```bash
git remote add origin https://github.com/your-username/kiddies-town-portal.git
git branch -M main
git push -u origin main
```

---

## 5. Vercel Deployment

### 5.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Configure:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**

### 5.2 Configure Environment Variables

After deployment, go to **Project Settings → Environment Variables** and add:

```
DATABASE_URL = postgresql://neondb_owner:xxxx@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET = <your-generated-secret>
JWT_REFRESH_SECRET = <your-generated-secret>
NODE_ENV = production
CORS_ORIGIN = https://your-project.vercel.app
```

### 5.3 Redeploy

After setting environment variables, trigger a redeployment:

```bash
vercel --prod
```

Or click **"Redeploy"** in the Vercel dashboard.

### 5.4 Custom Domain (Optional)

1. Go to **Project Settings → Domains**
2. Add your custom domain (e.g., `kiddiestown.co.za`)
3. Update `CORS_ORIGIN` to include your custom domain
4. Redeploy

---

## 6. Neon Database Setup

### 6.1 Create Neon Project

1. Go to [neon.tech](https://neon.tech)
2. Sign up / log in
3. Create a new project
4. Note the connection string (you'll need it for `DATABASE_URL`)

### 6.2 Connection String Format

```
postgresql://neondb_owner:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Important:** Use the **Pooled** connection string for serverless (Vercel). The pooler handles connection multiplexing for concurrent serverless functions.

### 6.3 Schema Bootstrap

On first deployment, the app automatically:
1. Creates all database tables (12 tables)
2. Creates PostgreSQL enum types
3. Seeds initial data (learners, themes, events, etc.)

**This only happens once** — subsequent deployments skip seeding if data exists.

### 6.4 Production Safety

The `bootstrapSchema()` function is gated for production:
- **Development:** Drops and recreates tables (for schema iteration)
- **Production:** Only creates missing tables/indexes (preserves existing data)

---

## 7. Post-Deployment Verification

### 7.1 Health Check

```bash
curl https://your-app.vercel.app/api/health
# Expected: {"status":"healthy","timestamp":"...","version":"2.0.0"}
```

### 7.2 Login Test

```bash
curl -X POST https://your-app.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kiddiestown.co.za","password":"admin"}'
# Expected: {"success":true,"token":"...","refreshToken":"...","user":{...}}
```

### 7.3 Data Fetch Test

```bash
# First login to get token, then:
curl https://your-app.vercel.app/api/v1/data \
  -H "Authorization: Bearer <token>"
# Expected: JSON with learners, themes, events, etc.
```

### 7.4 Frontend Test

1. Open `https://your-app.vercel.app` in browser
2. Verify landing page loads
3. Click **Login** → enter credentials
4. Verify dashboard loads with data
5. Test CRUD operations (add/edit/delete)

---

## 8. Troubleshooting

### Issue: "Invalid environment variables" on deploy

**Cause:** Missing or invalid `JWT_SECRET` / `JWT_REFRESH_SECRET`

**Fix:** Ensure both secrets are at least 32 characters. Generate with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Issue: "Neon query failed, falling back to local store"

**Cause:** `DATABASE_URL` not set or invalid

**Fix:**
1. Verify `DATABASE_URL` is set in Vercel dashboard
2. Check the Neon connection string format
3. Ensure Neon project is active (not paused)

### Issue: CORS errors in browser console

**Cause:** `CORS_ORIGIN` doesn't match your Vercel domain

**Fix:** Update `CORS_ORIGIN` to `https://your-exact-domain.vercel.app`

### Issue: "DROP TABLE" errors in production logs

**Cause:** Bootstrap dropping tables on cold start

**Fix:** Already fixed in `server/db/bootstrap.ts` — production mode only creates missing tables. Ensure `NODE_ENV=production` is set.

### Issue: 502 Bad Gateway on API routes

**Cause:** Serverless function timeout or cold start

**Fix:**
1. Check function logs in Vercel dashboard
2. Increase `maxDuration` in `vercel.json` (current: 30s)
3. Check Neon connection health

### Issue: Static assets 404

**Cause:** `outputDirectory` misconfigured

**Fix:** Ensure `vercel.json` has `"outputDirectory": "dist"` and `npm run build` outputs to `dist/`

---

## 9. Files Modified for Deployment

| File | Changes |
|------|---------|
| `vercel.json` | **New** — Vercel configuration (rewrites, headers, functions) |
| `api/index.ts` | **New** — Serverless function entry point |
| `server/db/bootstrap.ts` | Gated table drops for production |
| `server/config/database.ts` | Disabled file I/O in serverless mode |
| `server/app.ts` | CORS auto-allows Vercel preview deployments |
| `.env.example` | Updated with security guidance |

---

## Appendix A: Vercel CLI Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy (production)
vercel --prod

# Pull environment variables
vercel env pull .env.local

# View function logs
vercel logs

# Remove project
vercel rm kiddies-town-portal
```

## Appendix B: Neon CLI Commands

```bash
# Install Neon CLI
npm i -g neonctl

# List projects
neon projects list

# Create connection string
neon connection-string <project-id>
```

## Appendix C: Cost Estimate

| Service | Free Tier | Paid (Starting) |
|---------|-----------|-----------------|
| Vercel | 100 GB bandwidth, 1000 build min | $20/mo (Pro) |
| Neon | 0.5 GB storage, 24/7 compute | $19/mo (Launch) |
| **Total** | **$0/mo** | **$39/mo** |

---

*Document generated for Kiddies Town ECD & Academy Portal v2.0*
