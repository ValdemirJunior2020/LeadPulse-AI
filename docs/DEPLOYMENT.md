# Deployment Guide

## 1. Netlify frontend

1. Create a Netlify site from the repo.
2. Use `client` as the base directory.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Add environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_SERVER_URL`

`netlify.toml` is included.

## 2. Render backend

1. Create a Render Web Service.
2. Use `server` as the root directory.
3. Build command: `npm install && npm run build`.
4. Start command: `npm run start`.
5. Add environment variables from `.env.example`.

`render.yaml` is included.

## 3. Firebase Spark

1. Create a Firebase project.
2. Enable Firestore.
3. Create a service account key.
4. Add these Render variables:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

## 4. Clerk

1. Create a Clerk application.
2. Configure allowed origins for Netlify and localhost.
3. Add frontend publishable key to Netlify.
4. Add server secret and JWT issuer to Render.

## 5. Meta

Keep `META_MOCK_MODE=true` until App Review is complete. Production requires an approved Meta app and permissions documented in `ARCHITECTURE.md`.

## 6. CallRail

Each client supplies their own CallRail API key. The app encrypts it before storage. Configure `CALLRAIL_WEBHOOK_SECRET` for webhook verification.

## 7. Google Sheets

Create OAuth credentials or a service account in Google Cloud Console. Add the Google credential variables from `.env.example`.

## 8. OpenAI

Add `OPENAI_API_KEY` to Render. The requested defaults are:

- `OPENAI_MODEL_DEFAULT=gpt-4o-mini`
- `OPENAI_MODEL_UPGRADE=gpt-4o`

You can update these later if you choose a newer model family.
