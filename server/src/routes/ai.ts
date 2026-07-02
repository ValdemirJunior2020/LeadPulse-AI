import { Router } from 'express';
import { campaignDraftSchema, campaignWizardInputSchema } from '@leadpulse/shared';
import { requireAuth } from '../auth/clerk.js';
import { requireClientAccess } from '../middleware/roles.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { asyncHandler, currentAuth } from './helpers.js';
import { runAiGeneration } from '../services/aiService.js';
import { makeId, nowIso } from '../utils/id.js';
import { getDoc, listDocs, setDoc, updateDoc } from '../services/firestore.js';

export const aiRouter = Router();

aiRouter.use(requireAuth, aiLimiter, requireClientAccess);

const routeMap = {
  'campaign-strategy': '/ai/campaign-strategy',
  'ad-copy': '/ai/ad-copy',
  audience: '/ai/audience',
  offer: '/ai/offer',
  'compliance-review': '/ai/compliance-review',
  'landing-page': '/ai/landing-page',
} as const;

for (const [promptType, route] of Object.entries(routeMap) as Array<[keyof typeof routeMap, string]>) {
  aiRouter.post(
    route,
    asyncHandler(async (req, res) => {
      const auth = currentAuth(req);
      const input = campaignWizardInputSchema.parse(req.body.input ?? req.body);
      const result = await runAiGeneration({
        promptType,
        input,
        organizationId: auth.organizationId,
        userId: auth.id,
      });
      res.json(result);
    }),
  );
}

aiRouter.post(
  '/campaign-drafts',
  asyncHandler(async (req, res) => {
    const auth = currentAuth(req);
    const input = campaignWizardInputSchema.parse(req.body.input);
    const now = nowIso();
    const draft = campaignDraftSchema.parse({
      id: makeId('draft'),
      organizationId: auth.organizationId,
      clientId: req.body.clientId,
      createdByUserId: auth.id,
      input,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    });
    await setDoc('campaignDrafts', draft.id, draft);
    res.status(201).json({ draft });
  }),
);

aiRouter.get(
  '/campaign-drafts',
  asyncHandler(async (_req, res) => {
    const drafts = await listDocs('campaignDrafts', 100);
    res.json({ drafts });
  }),
);

aiRouter.get(
  '/campaign-drafts/:draftId',
  asyncHandler(async (req, res) => {
    const draftId = String(req.params.draftId ?? '');
    const draft = await getDoc('campaignDrafts', draftId);
    if (!draft) {
      res.status(404).json({ error: 'Draft not found.' });
      return;
    }
    res.json({ draft });
  }),
);

aiRouter.patch(
  '/campaign-drafts/:draftId',
  asyncHandler(async (req, res) => {
    const draftId = String(req.params.draftId ?? '');
    const updated = await updateDoc('campaignDrafts', draftId, {
      ...req.body,
      updatedAt: nowIso(),
    });
    if (!updated) {
      res.status(404).json({ error: 'Draft not found.' });
      return;
    }
    res.json({ draft: updated });
  }),
);
