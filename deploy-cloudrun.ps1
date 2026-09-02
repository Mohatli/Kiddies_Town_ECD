# ========================================================
# Kiddies Town Portal - Google Cloud Run Deployment Script
# ========================================================
param (
    [string]$ProjectId = "",
    [string]$Region = "us-central1",
    [string]$ServiceName = "kiddies-town-portal"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Deploying Kiddies Town Portal to Google Cloud Run" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verify gcloud CLI
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    $gcloudDefault = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin"
    if (Test-Path "$gcloudDefault\gcloud.cmd") {
        $env:PATH = "$gcloudDefault;$env:PATH"
    }
}

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 'gcloud' CLI was not found in PATH." -ForegroundColor Red
    Write-Host "Please install Google Cloud SDK or run: winget install Google.CloudSDK" -ForegroundColor Yellow
    exit 1
}

# 2. Check / Select GCP Project
if ([string]::IsNullOrWhiteSpace($ProjectId)) {
    $currentProject = (gcloud config get-value project 2>$null).Trim()
    if (-not [string]::IsNullOrWhiteSpace($currentProject) -and $currentProject -ne "(unset)") {
        $ProjectId = $currentProject
        Write-Host "ℹ️ Using active GCP project: $ProjectId" -ForegroundColor Green
    } else {
        Write-Host "❌ No GCP project specified or set in gcloud." -ForegroundColor Red
        Write-Host "Run: gcloud config set project YOUR_PROJECT_ID" -ForegroundColor Yellow
        Write-Host "Or pass: .\deploy-cloudrun.ps1 -ProjectId YOUR_PROJECT_ID" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "ℹ️ Setting active GCP project to: $ProjectId" -ForegroundColor Green
    gcloud config set project $ProjectId
}

# 3. Enable Required Google Cloud APIs
Write-Host "`n🔧 Enabling necessary Google Cloud APIs (run, cloudbuild, artifactregistry)..." -ForegroundColor Cyan
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project $ProjectId

# 4. Load Secrets from .env if present
$dbUrl = "postgresql://neondb_owner:npg_BIUP10FnJEVd@ep-shy-bar-att8deen-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
$jwtSecret = "ce2a33978f208200cc51338471047fe3527b8dff08afe301e8fe8b94014ae8419fb57ac4abba4ee3eef353237896d1fbae13fa7e0616ce889a39af50bfea71c1"
$jwtRefresh = "f7ed3db2c0a99dcfc639e44e29b0b58ee15cffb741b961664c991fdf2879c8ec1eaa5265dccdea471d20b1d3ccbe6d90f2de3c2ee49af9b733f6d06fad3be9f6"

if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $key = $parts[0].Trim()
            $val = $parts[1].Trim()
            if ($key -eq "DATABASE_URL" -and $val) { $dbUrl = $val }
            if ($key -eq "JWT_SECRET" -and $val) { $jwtSecret = $val }
            if ($key -eq "JWT_REFRESH_SECRET" -and $val) { $jwtRefresh = $val }
        }
    }
}

# 5. Build and Deploy to Cloud Run
Write-Host "`n🚀 Building and deploying service '$ServiceName' in region '$Region'..." -ForegroundColor Cyan

$envVars = "NODE_ENV=production,DATABASE_URL=$dbUrl,JWT_SECRET=$jwtSecret,JWT_REFRESH_SECRET=$jwtRefresh,CORS_ORIGIN=*"

gcloud run deploy $ServiceName `
    --source . `
    --project $ProjectId `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --set-env-vars $envVars `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================================" -ForegroundColor Green
    Write-Host "✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    $serviceUrl = (gcloud run services describe $ServiceName --project $ProjectId --region $Region --format "value(status.url)").Trim()
    Write-Host "🌐 Public Live URL: $serviceUrl" -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Green
} else {
    Write-Host "`n❌ Deployment encountered an error." -ForegroundColor Red
}
