# LeadPulse AI Architecture

## Phase 1 — Foundation

The monorepo contains `client`, `server`, `shared`, and `docs` workspaces. Shared Zod schemas define every collection required by the product: `users`, `organizations`, `clients`, `metaConnections`, `callrailConnections`, `campaignDrafts`, `campaigns`, `adSets`, `ads`, `aiGenerations`, `callLogs`, `googleSheetExports`, `auditLogs`, and `usageLimits`.

Clerk authentication is wired on the frontend and JWT verification middleware is implemented on the server. In production, the server requires `CLERK_JWT_ISSUER` and bearer tokens. In local development only, the server uses a demo Owner/Admin user to keep the scaffold runnable before credentials are added.

Firestore is initialized through Firebase Admin when credentials exist. Local development falls back to in-memory storage so the API can be exercised without Firebase Spark setup.

## Phase 2 — AI Campaign Generation

AI prompt modules live in `server/src/ai/prompts.ts`:

- Campaign Strategist
- Audience Builder
- Facebook Ad Copy Generator
- Offer Builder
- Compliance Reviewer
- Landing Page Copy Generator

All output is strict JSON and validated with Zod schemas from `@leadpulse/shared`. Identical prompt/input combinations are cached by SHA-256 hash. Monthly generation limits are tracked in `usageLimits`.

When `OPENAI_API_KEY` is available, the server calls the configured OpenAI model. Without a key, the server returns deterministic validated mock output for local testing.

## Phase 3 — Meta Integration

Meta integration is intentionally mock-first using `META_MOCK_MODE=true`. Mock mode simulates:

- OAuth start/callback
- Ad account listing
- Facebook Page listing
- Campaign publishing with fake Meta IDs
- Insights response

Production Meta Marketing API use is blocked until App Review approval. The expected minimum permissions are:

- `ads_management`
- `ads_read`
- `pages_show_list`
- `business_management` only when required for the connected ad account workflow

Every live or mock publish operation creates the Campaign → Ad Set → Ad hierarchy as `PAUSED`. The activation gate is server-side, not just hidden in the UI.

## Phase 4 — CallRail Integration

CallRail API keys are encrypted using AES-256-GCM with `ENCRYPTION_KEY`. Webhook ingestion verifies a shared secret in production and applies rate limiting.

Stored call metadata includes only:

- call ID
- account/company/campaign ID
- source/source name
- customer phone/city/state
- start time
- duration
- answered boolean
- first-time-caller boolean
- landing page URL
- referring URL
- UTM campaign/source/medium/content
- lead status
- tags

Recording and audio fields are explicitly discarded before validation and persistence.

## Phase 5 — Reporting and Polish

The app includes placeholder structures for:

- Call Tracking Setup Assistant
- Weekly Report Writer
- Missed Call Recovery Script Generator
- Lead Quality Analyzer using metadata only
- Google Sheets export jobs
- Owner/Admin prompt-template manager
- Usage/billing limits page foundation
- Audit logs for publish, activate, API connection, export, AI generation, and sync

## Deployment shape

- Netlify hosts `client/dist`.
- Render hosts the Express server.
- Firebase Spark stores Firestore documents.
- Clerk manages authentication.
- OpenAI powers live generation.
- Meta and CallRail require client-owned credentials/connections.
