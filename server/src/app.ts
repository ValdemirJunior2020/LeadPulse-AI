import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { standardLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errors.js';
import { healthRouter } from './routes/health.js';
import { usersRouter } from './routes/users.js';
import { aiRouter } from './routes/ai.js';
import { metaRouter } from './routes/meta.js';
import { callrailRouter } from './routes/callrail.js';
import { reportsRouter } from './routes/reports.js';
import { adminRouter } from './routes/admin.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('tiny'));
  app.use('/api', standardLimiter);
  app.use('/api', healthRouter);
  app.use('/api', usersRouter);
  app.use('/api', aiRouter);
  app.use('/api', metaRouter);
  app.use('/api', callrailRouter);
  app.use('/api', reportsRouter);
  app.use('/api', adminRouter);
  app.use(errorHandler);
  return app;
}
