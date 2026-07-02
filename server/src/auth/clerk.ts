import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { NextFunction, Request, Response } from 'express';
import { env, isProduction } from '../config/env.js';

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function bearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length);
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = bearerToken(req);
    if (!token) {
      if (!isProduction) {
        req.authUser = {
          id: 'usr_demo_owner',
          clerkUserId: 'clerk_demo_owner',
          email: 'demo@leadpulse.ai',
          name: 'Demo Owner',
          organizationId: 'org_demo',
          role: 'owner_admin',
          assignedClientIds: ['client_demo'],
        };
        next();
        return;
      }
      res.status(401).json({ error: 'Missing bearer token.' });
      return;
    }

    if (!env.CLERK_JWT_ISSUER) {
      throw new Error('CLERK_JWT_ISSUER is required for JWT verification.');
    }

    jwks ??= createRemoteJWKSet(new URL(`${env.CLERK_JWT_ISSUER}/.well-known/jwks.json`));
    const { payload } = await jwtVerify(token, jwks, { issuer: env.CLERK_JWT_ISSUER });
    const role = payload.public_metadata && typeof payload.public_metadata === 'object'
      ? ((payload.public_metadata as Record<string, unknown>).role as string | undefined)
      : undefined;
    const subject = payload.sub;
    if (!subject) throw new Error('Clerk JWT is missing a subject.');
    const organizationId = payload.org_id?.toString() ?? 'org_default';
    const email = typeof payload.email === 'string' ? payload.email : undefined;

    req.authUser = {
      id: subject,
      clerkUserId: subject,
      ...(email ? { email } : {}),
      organizationId,
      role: role === 'client_user' || role === 'team_member' ? role : 'owner_admin',
      assignedClientIds: [],
    };
    next();
  } catch (error) {
    next(error);
  }
}
