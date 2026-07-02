import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../auth/clerk.js';
import { asyncHandler, currentAuth } from './helpers.js';
import { queueGoogleSheetExport } from '../services/googleSheetsService.js';
import { listDocs } from '../services/firestore.js';

export const reportsRouter = Router();

reportsRouter.use(requireAuth);

const exportSchema = z.object({
  exportType: z.enum(['campaign_summary', 'ai_strategy', 'ad_copy', 'call_logs', 'weekly_metrics']),
});

reportsRouter.post(
  '/exports/google-sheets',
  asyncHandler(async (req, res) => {
    const auth = currentAuth(req);
    const input = exportSchema.parse(req.body);
    const job = await queueGoogleSheetExport({
      organizationId: auth.organizationId,
      requestedByUserId: auth.id,
      exportType: input.exportType,
    });
    res.status(202).json({ job });
  }),
);

reportsRouter.get(
  '/reports/weekly',
  asyncHandler(async (_req, res) => {
    const calls = await listDocs<Record<string, unknown>>('callLogs', 1000);
    const answered = calls.filter((call) => call.answered === true).length;
    res.json({
      totalCalls: calls.length,
      answered,
      missed: calls.length - answered,
      avgDuration:
        calls.length === 0
          ? 0
          : calls.reduce((sum, call) => sum + (Number(call.duration) || 0), 0) / calls.length,
      metadataOnly: true,
    });
  }),
);
