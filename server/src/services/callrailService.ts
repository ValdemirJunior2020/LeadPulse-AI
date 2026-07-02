import { callrailConnectionSchema, type CallLog } from '@leadpulse/shared';
import { env } from '../config/env.js';
import { encryptSecret } from './crypto.js';
import { assertNoRecordingReferencesInStoredCalls, setDoc } from './firestore.js';
import { makeId, nowIso } from '../utils/id.js';
import { audit } from './audit.js';
import { callrailPayloadToCallLog } from '../utils/sanitize.js';

type ConnectInput = {
  organizationId: string;
  clientId: string;
  apiKey: string;
  actorUserId: string;
};

export async function connectCallrail(input: ConnectInput): Promise<{
  connectionId: string;
  accounts: Array<{ id: string; name: string }>;
}> {
  const encrypted = encryptSecret(input.apiKey);
  const now = nowIso();
  const connection = callrailConnectionSchema.parse({
    id: makeId('callrail'),
    organizationId: input.organizationId,
    clientId: input.clientId,
    apiKeyEncrypted: encrypted,
    accountId: env.NODE_ENV === 'development' ? 'mock_account_001' : undefined,
    companyId: env.NODE_ENV === 'development' ? 'mock_company_001' : undefined,
    createdAt: now,
    updatedAt: now,
  });
  await setDoc('callrailConnections', connection.id, connection);
  await audit({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: 'api_connection',
    targetType: 'callrailConnection',
    targetId: connection.id,
    metadata: { encrypted: true, storedAudio: false },
  });
  return {
    connectionId: connection.id,
    accounts: [{ id: 'mock_account_001', name: 'Mock CallRail Account' }],
  };
}

export async function storeCallrailWebhook(
  payload: Record<string, unknown>,
  context: { organizationId: string; clientId?: string },
): Promise<CallLog> {
  const log = callrailPayloadToCallLog(payload, context);
  await setDoc('callLogs', log.id, log);
  const safe = await assertNoRecordingReferencesInStoredCalls();
  if (!safe) throw new Error('Recording reference detected after sanitization.');
  return log;
}

export async function mockSyncCalls(context: { organizationId: string; clientId?: string }): Promise<CallLog[]> {
  const samples = [
    {
      id: 'mock_call_1',
      source: 'facebook',
      source_name: 'Meta Ads',
      customer_phone_number: '+15555550101',
      customer_city: 'Lake Worth',
      customer_state: 'FL',
      duration: 142,
      answered: true,
      first_time_caller: true,
      landing_page_url: 'https://example.com/offer',
      referring_url: 'https://facebook.com/',
      utm_campaign: 'summer-local-leads',
      utm_source: 'facebook',
      utm_medium: 'paid_social',
      lead_status: 'new',
      tags: ['demo'],
      recording_url: 'https://callrail.example/recording/never-store-this',
    },
    {
      id: 'mock_call_2',
      source: 'google',
      source_name: 'Organic Search',
      customer_phone_number: '+15555550102',
      customer_city: 'Boynton Beach',
      customer_state: 'FL',
      duration: 0,
      answered: false,
      first_time_caller: false,
      lead_status: 'unknown',
      audio_url: 'https://callrail.example/audio/never-store-this',
    },
  ];
  const logs = [] as CallLog[];
  for (const sample of samples) logs.push(await storeCallrailWebhook(sample, context));
  return logs;
}
