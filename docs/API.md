# LeadPulse AI API

Base path: `/api`

## Health and User

### `GET /health`
Returns server health, environment, Meta mock mode, and storage mode.

### `GET /me`
Requires auth. Returns the authenticated user context and stored profile.

### `POST /users/sync`
Requires auth. Creates/updates the user and first organization membership.

## AI

All `/ai/*` routes are rate limited, require auth, validate input with `campaignWizardInputSchema`, validate output with Zod, cache identical prompt/input combinations, and enforce monthly usage caps.

### `POST /ai/campaign-strategy`
### `POST /ai/ad-copy`
### `POST /ai/audience`
### `POST /ai/offer`
### `POST /ai/compliance-review`
### `POST /ai/landing-page`

Body:

```json
{
  "input": {
    "campaignType": "local_lead_generation",
    "businessName": "Demo Local Services",
    "industry": "Home services",
    "offer": "Free estimate",
    "location": "Lake Worth, FL",
    "audience": "Homeowners",
    "budget": "$50/day",
    "serviceArea": "Palm Beach County",
    "landingPage": "https://example.com",
    "phoneOrTrackingNumber": "+15555550101",
    "goal": "Generate booked calls",
    "tone": "Friendly"
  }
}
```

## Campaign Drafts

### `POST /campaign-drafts`
Creates a draft container.

### `GET /campaign-drafts`
Lists drafts.

### `GET /campaign-drafts/:draftId`
Reads a draft.

### `PATCH /campaign-drafts/:draftId`
Updates draft content before Meta publishing.

## Meta

### `GET /meta/oauth/start`
Returns a live OAuth URL or a mock callback URL.

### `GET /meta/oauth/callback`
Completes mock OAuth callback.

### `GET /meta/ad-accounts`
Lists connected/mock ad accounts.

### `GET /meta/pages`
Lists connected/mock pages.

### `POST /meta/campaigns/publish-paused`
Requires compliance review approval. Creates Campaign → Ad Set → Ad as `PAUSED`.

### `POST /meta/campaigns/:campaignId/activate`
Requires body:

```json
{
  "confirmationPhrase": "ACTIVATE_campaign_id_here"
}
```

The server checks this exact phrase and refuses activation without it.

### `GET /meta/campaigns/:campaignId/insights`
Returns spend, impressions, clicks, CTR, CPC, leads, and status.

## CallRail

### `POST /callrail/connect`
Encrypts and stores a CallRail API key.

### `POST /callrail/sync`
Imports mock or live metadata-only calls.

### `GET /callrail/accounts`
Lists accounts.

### `GET /callrail/companies`
Lists companies.

### `GET /callrail/calls`
Lists stored call logs.

### `POST /webhooks/callrail`
Verifies webhook secret in production, rate limits requests, sanitizes payloads, and stores metadata only.

## Reporting

### `POST /exports/google-sheets`
Queues a Google Sheets export job.

### `GET /reports/weekly`
Returns weekly call metrics from metadata.

## Admin

### `POST /admin/prompt-templates`
Owner/Admin only. Saves prompt-template data through the admin surface.
