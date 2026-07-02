import { Router } from 'express';
import { env } from '../config/env.js';
import { isUsingFirestore } from '../services/firestore.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'leadpulse-ai-server',
    environment: env.NODE_ENV,
    metaMockMode: env.META_MOCK_MODE,
    storage: isUsingFirestore() ? 'firestore' : 'memory-dev-fallback',
    timestamp: new Date().toISOString(),
  });
});
