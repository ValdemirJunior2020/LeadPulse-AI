import { createHmac, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../auth/clerk.js';
import { requireClientAccess } from '../middleware/roles.js';
import { webhookLimiter } from '../middleware/rateLimit.js';
import { asyncHandler, currentAuth } from './helpers.js';
import { connectCallrail, mockSyncCalls, storeCallrailWebhook } from '../services/callrailService.js';
import { env } from '../config/env.js';
import { listDocs } from '../services/firestore.js';

export const callrailRouter = Router();

const connectSchema = z.object({ clientId: z.string().min(1), apiKey: z.string().min(8) });

function verifyWebhookSignature(rawBody: string, signature: string | undefined): boolean {
  if (!env.CALLRAIL_WEBHOOK_SECRET) return env.NODE_ENV !== 'production';
  if (!signature) return false;
  const expected = createHmac('sha256', env.CALLRAIL_WEBHOOK_SECRET).update(rawBody).digest('hex');
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

callrailRouter.post(
  '/callrail/connect',
  requireAuth,
  requireClientAccess,
  asyncHandler(async (req, res) => {
    const auth = currentAuth(req);
    const input = connectSchema.parse(req.body);
    const result = await connectCallrail({
      organizationId: auth.organizationId,
      clientId: input.clientId,
      apiKey: input.apiKey,
      actorUserId: auth.id,
    });
    res.status(201).json(result);
  }),
);

callrailRouter.get('/callrail/accounts', requireAuth, (_req, res) => {
  res.json({ accounts: [{ id: 'mock_account_001', name: 'Mock CallRail Account' }] });
});

callrailRouter.get('/callrail/companies', requireAuth, (_req, res) => {
  res.json({ companies: [{ id: 'mock_company_001', name: 'Mock Local Business' }] });
});

callrailRouter.post(
  '/callrail/sync',
  requireAuth,
  requireClientAccess,
  asyncHandler(async (req, res) => {
    const auth = currentAuth(req);
    const logs = await mockSyncCalls({ organizationId: auth.organizationId, clientId: req.body.clientId });
    res.json({ imported: logs.length, logs });
  }),
);

callrailRouter.get(
  '/callrail/calls',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json({ calls: await listDocs('callLogs', 250) });
  }),
);

callrailRouter.post(
  '/webhooks/callrail',
  webhookLimiter,
  asyncHandler(async (req, res) => {
    const rawBody = JSON.stringify(req.body ?? {});
    const signature = req.header('x-callrail-signature') ?? req.header('x-leadpulse-signature') ?? undefined;
    if (!verifyWebhookSignature(rawBody, signature)) {
      res.status(401).json({ error: 'Invalid webhook signature.' });
      return;
    }
    const organizationId = String(req.query.organizationId ?? req.body.organizationId ?? 'org_demo');
    const clientId = req.query.clientId ? String(req.query.clientId) : undefined;
    const context = clientId ? { organizationId, clientId } : { organizationId };
    const log = await storeCallrailWebhook(req.body as Record<string, unknown>, context);
    res.status(201).json({ stored: true, log, discardedAudio: true });
  }),
);
