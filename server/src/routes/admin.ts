import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../auth/clerk.js';
import { requireRole } from '../middleware/roles.js';
import { asyncHandler, currentAuth } from './helpers.js';
import { makeId, nowIso } from '../utils/id.js';
import { setDoc } from '../services/firestore.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(['owner_admin']));

const promptTemplateSchema = z.object({
  name: z.string().min(1),
  prompt: z.string().min(10),
  enabled: z.boolean().default(true),
});

adminRouter.post(
  '/admin/prompt-templates',
  asyncHandler(async (req, res) => {
    const auth = currentAuth(req);
    const input = promptTemplateSchema.parse(req.body);
    const template = {
      id: makeId('prompt'),
      organizationId: auth.organizationId,
      ...input,
      createdByUserId: auth.id,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await setDoc('auditLogs', makeId('audit'), {
      id: makeId('audit'),
      organizationId: auth.organizationId,
      actorUserId: auth.id,
      action: 'sync',
      targetType: 'promptTemplate',
      targetId: template.id,
      metadata: template,
      createdAt: nowIso(),
    });
    res.status(201).json({ template });
  }),
);
