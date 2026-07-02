import type { Role } from '@leadpulse/shared';

export type AuthUser = {
  id: string;
  clerkUserId: string;
  email?: string;
  name?: string;
  organizationId: string;
  role: Role;
  assignedClientIds: string[];
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}
