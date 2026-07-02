$ErrorActionPreference = "Stop"

$root = "C:\Users\User\Downloads\final\leadpulse-ai"
$clientDir = Join-Path $root "client"
$serverDir = Join-Path $root "server"

New-Item -ItemType Directory -Force -Path $clientDir | Out-Null
New-Item -ItemType Directory -Force -Path $serverDir | Out-Null

@'
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZWFzeS1tYWxhbXV0ZS00NS5jbGVyay5hY2NvdW50cy5kZXYk
VITE_SERVER_URL=http://localhost:8080

# Optional PayPal links - replace after you create your PayPal buttons/links
VITE_PAYPAL_STARTER_URL=https://www.paypal.com/buttons/
VITE_PAYPAL_PRO_URL=https://www.paypal.com/buttons/
VITE_PAYPAL_AGENCY_URL=https://www.paypal.com/buttons/
'@ | Set-Content -Path (Join-Path $clientDir ".env.local") -Encoding UTF8

@'
# Core runtime
NODE_ENV=development
PORT=8080
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:8080

# Clerk Auth
CLERK_PUBLISHABLE_KEY=pk_test_ZWFzeS1tYWxhbXV0ZS00NS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_gIoLhzmblC3uT0ka37VzxiQPfGsPNO5KGluKWsRKr0
CLERK_JWT_ISSUER=https://easy-malamute-45.clerk.accounts.dev

# Firebase Admin
FIREBASE_PROJECT_ID=medium-3ae06
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# OpenAI
OPENAI_API_KEY=
OPENAI_MODEL_DEFAULT=gpt-4o-mini
OPENAI_MODEL_UPGRADE=gpt-4o
AI_MONTHLY_LIMIT_PER_USER=100

# Meta
META_APP_ID=
META_APP_SECRET=
META_REDIRECT_URI=http://localhost:8080/api/meta/oauth/callback
META_GRAPH_VERSION=v23.0
META_MOCK_MODE=true

# CallRail
CALLRAIL_WEBHOOK_SECRET=
ENCRYPTION_KEY=

# Google Sheets
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8080/api/google/oauth/callback
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=1rK7lNpcKdHWd4rNSouLxvvOh0cVpA8i8VgkfcbwIN7I
'@ | Set-Content -Path (Join-Path $serverDir ".env") -Encoding UTF8

Write-Host "Clerk env files created:"
Write-Host " - $clientDir\.env.local"
Write-Host " - $serverDir\.env"
Write-Host ""
Write-Host "Now restart Vite:"
Write-Host "cd $root"
Write-Host "npm run dev"
