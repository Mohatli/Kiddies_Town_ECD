# ==========================================
# Multi-stage Dockerfile for Kiddies Town Portal
# Optimized for Google Cloud Run Deployment
# ==========================================

# Stage 1: Build Frontend and Backend Bundle
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy project source files
COPY . .

# Build Vite client and esbuild server bundle to dist/
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled frontend and backend assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data_store.json ./data_store.json

# Expose standard Cloud Run container port
EXPOSE 8080

# Start production server
CMD ["node", "dist/server.mjs"]
