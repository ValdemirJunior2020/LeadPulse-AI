import type { NextFunction, Request, RequestHandler, Response } from 'express';

export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}

export function currentAuth(req: Request) {
  if (!req.authUser) {
    const error = new Error('Authentication required.');
    (error as Error & { status?: number }).status = 401;
    throw error;
  }
  return req.authUser;
}
