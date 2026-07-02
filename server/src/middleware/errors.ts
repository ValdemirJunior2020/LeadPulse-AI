import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const notFoundHandler: ErrorRequestHandler = (_error, _req, res, _next) => {
  res.status(404).json({ error: 'Not found' });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: error.flatten() });
    return;
  }
  const status = typeof error.status === 'number' ? error.status : 500;
  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : error.message,
  });
};
