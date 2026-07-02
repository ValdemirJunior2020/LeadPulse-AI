import { Router } from 'express';
import { complianceOutputSchema } from '@leadpulse/shared';
import { requireAuth } from '../auth/clerk.js';
import { requireClientAccess } from '../middleware/roles.js';
import { asyncHandler, currentAuth } from './helpers.js';
import {
  activateCampaign,
  getOAuthStartUrl,
  listAdAccounts,
  listFacebookPages,
  publishPausedCampaign,
} from '../services/metaService.js';
import { getDoc, listDocs } from '../services/firestore.js';

export const metaRouter = Router();

metaRouter.use(requireAuth, requireClientAccess);

metaRouter.get(
  '/meta/oauth/start',
  asyncHandler(async (req, res) => {
    const auth = currentAuth(req);
    const result = await getOAuthStartUrl(`${auth.organizationId}:${auth.id}`);
    res.json(result);
  }),
);

metaRouter.get('/meta/oauth/callback', (_req, res) => {
  res.json({ connected: true, mock: true, message: 'Meta mock OAuth callback completed.' });
});

metaRouter.get(
  '/meta/ad-accounts',
  asyncHandler(async (_req, res) => {
    res.json({ adAccounts: await listAdAccounts() });
  }),
);

metaRouter.get(
  '/meta/pages',
  asyncHandler(async (_req, res) => {
    res.json({ pages: await listFacebookPages() });
  }),
);

metaRouter.get(
  '/meta/campaigns',
  asyncHandler(async (_req, res) => {
    res.json({ campaigns: await listDocs('campaigns', 100) });
  }),
);

metaRouter.post(
  '/meta/campaigns/create-draft',
  asyncHandler(async (_req, res) => {
    res.status(202).json({
      message: 'Use /api/ai/campaign-drafts for draft creation. Meta publishing is intentionally separated.',
    });
  }),
);

metaRouter.post(
  '/meta/campaigns/publish-paused',
  asyncHandler(async (req, res) => {
    const auth = currentAuth(req);
    const draft = await getDoc<Record<string, unknown>>('campaignDrafts', req.body.campaignDraftId);
    if (!draft) {
      res.status(404).json({ error: 'Campaign draft not found.' });
      return;
    }
    const compliance = complianceOutputSchema.safeParse(draft.compliance ?? req.body.compliance);
    if (!compliance.success || !compliance.data.approvedForDrafting) {
      res.status(409).json({
        error: 'Compliance review is mandatory and must be approved before paused publishing.',
        details: compliance.success ? compliance.data : compliance.error.flatten(),
      });
      return;
    }
    const result = await publishPausedCampaign({
      organizationId: auth.organizationId,
      actorUserId: auth.id,
      clientId: String(req.body.clientId ?? draft.clientId ?? 'client_demo'),
      campaignDraftId: String(req.body.campaignDraftId),
    });
    res.status(201).json({ result, safety: 'All Meta entities were created as PAUSED.' });
  }),
);

metaRouter.post(
  '/meta/campaigns/:campaignId/activate',
  asyncHandler(async (req, res) => {
    const auth = currentAuth(req);
    const result = await activateCampaign({
      organizationId: auth.organizationId,
      actorUserId: auth.id,
      campaignId: String(req.params.campaignId ?? ''),
      confirmationPhrase: String(req.body.confirmationPhrase ?? ''),
    });
    res.json(result);
  }),
);

metaRouter.get('/meta/campaigns/:campaignId/insights', (req, res) => {
  res.json({
    campaignId: String(req.params.campaignId ?? ''),
    spend: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cpc: 0,
    leads: 0,
    status: 'PAUSED',
    mock: true,
  });
});
