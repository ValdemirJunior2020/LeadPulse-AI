# Phase Checklist

## Phase 1 — Foundation

- Monorepo scaffold present: `client`, `server`, `shared`, `docs`.
- TypeScript strict mode enabled.
- ESLint and Prettier configured.
- Clerk frontend components and backend JWT middleware implemented.
- First-login sync route creates `users` and `organizations` documents.
- Role middleware supports Owner/Admin, Client/User, Team Member.
- Shared Zod schemas define all required Firestore collections.
- Dashboard shell includes dark sidebar, light cards, empty/loading/error/toast states.
- Shell pages exist: landing, dashboard home, client selector, settings.
- SVG brand assets generated locally.
- Health/user sync routes implemented.
- Helmet, CORS, and rate limiting configured.

## Phase 2 — AI Campaign Generation

- Campaign wizard includes six campaign types and required business fields.
- Prompt modules live in `server/src/ai/prompts.ts`.
- All AI responses are JSON and Zod validated.
- Monthly usage limits are enforced.
- Identical prompt/input combos are cached.
- AI routes are rate limited.
- Draft list/detail/update routes exist.

## Phase 3 — Meta Integration

- `META_MOCK_MODE=true` simulates OAuth, account listing, pages, paused publishing, and insights.
- Meta permissions and App Review risk documented.
- Publish route creates Campaign → Ad Set → Ad hierarchy as `PAUSED`.
- Compliance review is mandatory before publishing.
- Activation requires a separate server-side confirmation phrase.

## Phase 4 — CallRail Integration

- API key encryption uses AES-256-GCM.
- CallRail account/company/call routes exist.
- Webhook route verifies secret in production and is rate limited.
- Sanitization discards recording/audio references before storage.
- Dashboard shows totals, answered/missed, and recent calls.

## Phase 5 — Reporting, Remaining AI Tools, Polish

- Google Sheets export jobs implemented.
- Admin prompt-template manager exists.
- Usage/billing limit structure exists through `usageLimits`.
- Audit logs cover publish, activate, API connection, export, AI generation, and sync.
- Unit tests exist for sanitization and encryption.
- API, architecture, deployment, and README docs are included.
- Netlify and Render config files are included.
