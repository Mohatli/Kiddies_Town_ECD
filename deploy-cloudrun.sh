#!/usr/bin/env bash
set -e

# ========================================================
# Kiddies Town Portal - Google Cloud Run Deployment Script
# ========================================================

PROJECT_ID=${1:-$(gcloud config get-value project 2>/dev/null)}
REGION=${2:-"us-central1"}
SERVICE_NAME=${3:-"kiddies-town-portal"}

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
  echo "❌ Error: No GCP Project ID specified or configured in gcloud."
  echo "Usage: ./deploy-cloudrun.sh <PROJECT_ID> [REGION] [SERVICE_NAME]"
  exit 1
fi

echo "=========================================================="
echo "🚀 Deploying Kiddies Town Portal to Google Cloud Run"
echo "Project: $PROJECT_ID | Region: $REGION | Service: $SERVICE_NAME"
echo "=========================================================="

echo "🔧 Enabling Google Cloud APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project "$PROJECT_ID"

# Default credentials from environment or fallback
DB_URL="postgresql://neondb_owner:npg_BIUP10FnJEVd@ep-shy-bar-att8deen-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="ce2a33978f208200cc51338471047fe3527b8dff08afe301e8fe8b94014ae8419fb57ac4abba4ee3eef353237896d1fbae13fa7e0616ce889a39af50bfea71c1"
JWT_REFRESH="f7ed3db2c0a99dcfc639e44e29b0b58ee15cffb741b961664c991fdf2879c8ec1eaa5265dccdea471d20b1d3ccbe6d90f2de3c2ee49af9b733f6d06fad3be9f6"

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
  [ -n "$DATABASE_URL" ] && DB_URL="$DATABASE_URL"
  [ -n "$JWT_SECRET" ] && JWT_SECRET="$JWT_SECRET"
  [ -n "$JWT_REFRESH_SECRET" ] && JWT_REFRESH="$JWT_REFRESH_SECRET"
fi

echo "🚀 Building and deploying service '$SERVICE_NAME'..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,DATABASE_URL=$DB_URL,JWT_SECRET=$JWT_SECRET,JWT_REFRESH_SECRET=$JWT_REFRESH,CORS_ORIGIN=*" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format "value(status.url)")

echo "=========================================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "🌐 Public Live URL: $SERVICE_URL"
echo "=========================================================="
