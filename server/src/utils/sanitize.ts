import type { CallLog } from '@leadpulse/shared';
import { callLogSchema } from '@leadpulse/shared';
import { makeId, nowIso } from './id.js';

const forbiddenRecordingKeys = new Set([
  'recording',
  'recording_url',
  'recordingUrl',
  'recording_player',
  'audio',
  'audio_url',
  'audioUrl',
]);

export function stripRecordingReferences(payload: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !forbiddenRecordingKeys.has(key)),
  );
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function optionalUrl(value: unknown): string | undefined {
  const stringValue = optionalString(value);
  if (!stringValue) return undefined;
  try {
    return new URL(stringValue).toString();
  } catch {
    return undefined;
  }
}

export function callrailPayloadToCallLog(
  payload: Record<string, unknown>,
  context: { organizationId: string; clientId?: string },
): CallLog {
  const clean = stripRecordingReferences(payload);
  const rawAnswered = clean.answered ?? clean.answered_call ?? clean.customer_answered;
  const rawDuration = clean.duration ?? clean.duration_ms ?? 0;
  const durationNumber = typeof rawDuration === 'number' ? rawDuration : Number(rawDuration) || 0;

  return callLogSchema.parse({
    id: makeId('call'),
    organizationId: context.organizationId,
    clientId: context.clientId,
    callrailCallId: optionalString(clean.id) ?? optionalString(clean.call_id) ?? makeId('callrail'),
    accountId: optionalString(clean.account_id),
    companyId: optionalString(clean.company_id),
    campaignId: optionalString(clean.campaign_id) ?? optionalString(clean.campaign),
    source: optionalString(clean.source),
    sourceName: optionalString(clean.source_name),
    customerPhone: optionalString(clean.customer_phone_number) ?? optionalString(clean.customer_number),
    customerCity: optionalString(clean.customer_city),
    customerState: optionalString(clean.customer_state),
    startTime: optionalString(clean.start_time) ?? optionalString(clean.startTime) ?? nowIso(),
    duration: Math.max(0, durationNumber),
    answered: rawAnswered === true || rawAnswered === 'true' || rawAnswered === 'answered',
    firstTimeCaller: clean.first_time_caller === true || clean.first_time_caller === 'true',
    landingPageUrl: optionalUrl(clean.landing_page_url),
    referringUrl: optionalUrl(clean.referring_url),
    utmCampaign: optionalString(clean.utm_campaign),
    utmSource: optionalString(clean.utm_source),
    utmMedium: optionalString(clean.utm_medium),
    utmContent: optionalString(clean.utm_content),
    leadStatus: optionalString(clean.lead_status) ?? 'unknown',
    tags: Array.isArray(clean.tags) ? clean.tags.filter((tag): tag is string => typeof tag === 'string') : [],
    createdAt: nowIso(),
  });
}
