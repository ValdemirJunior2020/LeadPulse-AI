import { Router } from 'express';
import { organizationSchema, userSchema } from '@leadpulse/shared';
import { requireAuth } from '../auth/clerk.js';
import { asyncHandler, currentAuth } from './helpers.js';
import { getDoc, setDoc } from '../services/firestore.js';
import { nowIso } from '../utils/id.js';
import { audit } from '../services/audit.js';

export const usersRouter = Router();

usersRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const auth = currentAuth(req);
    const stored = await getDoc('users', auth.id);
    res.json({ auth, stored });
  }),
);

usersRouter.post(
  '/users/sync',
  requireAuth,
  asyncHandler(async (req, res) => {
    const auth = currentAuth(req);
    const now = nowIso();
    const user = userSchema.parse({
      id: auth.id,
      clerkUserId: auth.clerkUserId,
      email: auth.email,
      name: auth.name,
      defaultOrganizationId: auth.organizationId,
      createdAt: now,
      updatedAt: now,
    });
    await setDoc('users', user.id, user);
    const existingOrg = await getDoc('organizations', auth.organizationId);
    if (!existingOrg) {
      const organization = organizationSchema.parse({
        id: auth.organizationId,
        name: req.body?.organizationName ?? 'LeadPulse Workspace',
        ownerUserId: auth.id,
        members: [{ userId: auth.id, role: auth.role, assignedClientIds: auth.assignedClientIds }],
        createdAt: now,
        updatedAt: now,
      });
      await setDoc('organizations', organization.id, organization);
    }
    await audit({
      organizationId: auth.organizationId,
      actorUserId: auth.id,
      action: 'sync',
      targetType: 'user',
      targetId: auth.id,
      metadata: { firstLoginSync: !existingOrg },
    });
    res.status(201).json({ user, organizationId: auth.organizationId });
  }),
);
