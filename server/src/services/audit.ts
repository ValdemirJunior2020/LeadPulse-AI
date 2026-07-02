import type { AuditLog } from '@leadpulse/shared';
import { auditLogSchema } from '@leadpulse/shared';
import { makeId, nowIso } from '../utils/id.js';
import { setDoc } from './firestore.js';

export async function audit(input: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
  const log = auditLogSchema.parse({ ...input, id: makeId('audit'), createdAt: nowIso() });
  await setDoc('auditLogs', log.id, log);
  return log;
}
