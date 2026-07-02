import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@leadpulse/shared';

export function requireRole(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.authUser;
    if (!user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    if (!roles.includes(user.role)) {
      res.status(403).json({ error: 'This role cannot access this resource.' });
      return;
    }
    next();
  };
}

export function requireClientAccess(req: Request, res: Response, next: NextFunction): void {
  const user = req.authUser;
  const requestedClientId = String(req.params.clientId ?? req.body.clientId ?? req.query.clientId ?? '');
  if (!user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  if (user.role === 'team_member' && requestedClientId && !user.assignedClientIds.includes(requestedClientId)) {
    res.status(403).json({ error: 'Team member is not assigned to this client.' });
    return;
  }
  next();
}
