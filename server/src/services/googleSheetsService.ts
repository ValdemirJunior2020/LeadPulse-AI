import { googleSheetExportSchema } from '@leadpulse/shared';
import { makeId, nowIso } from '../utils/id.js';
import { setDoc } from './firestore.js';
import { audit } from './audit.js';

export async function queueGoogleSheetExport(args: {
  organizationId: string;
  requestedByUserId: string;
  exportType: 'campaign_summary' | 'ai_strategy' | 'ad_copy' | 'call_logs' | 'weekly_metrics';
}) {
  const now = nowIso();
  const exportJob = googleSheetExportSchema.parse({
    id: makeId('sheet'),
    organizationId: args.organizationId,
    requestedByUserId: args.requestedByUserId,
    exportType: args.exportType,
    status: 'queued',
    createdAt: now,
    updatedAt: now,
  });
  await setDoc('googleSheetExports', exportJob.id, exportJob);
  await audit({
    organizationId: args.organizationId,
    actorUserId: args.requestedByUserId,
    action: 'export',
    targetType: 'googleSheetExport',
    targetId: exportJob.id,
    metadata: { retryBackoff: 'configured_in_worker_placeholder' },
  });
  return exportJob;
}
