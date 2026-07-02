import { metaPublishResponseSchema, type MetaPublishResponse } from '@leadpulse/shared';
import { env } from '../config/env.js';
import { makeId, nowIso } from '../utils/id.js';
import { getDoc, setDoc, updateDoc } from './firestore.js';
import { audit } from './audit.js';

type PublishInput = {
  organizationId: string;
  clientId: string;
  campaignDraftId: string;
  actorUserId: string;
};

function fakeMetaId(prefix: string): string {
  return `${prefix}_${Math.floor(Math.random() * 10_000_000_000)}`;
}

export async function getOAuthStartUrl(state: string): Promise<{ url: string; mock: boolean }> {
  if (env.META_MOCK_MODE) {
    return { url: `/api/meta/oauth/callback?state=${encodeURIComponent(state)}&mock=true`, mock: true };
  }
  if (!env.META_APP_ID || !env.META_REDIRECT_URI) {
    throw new Error('META_APP_ID and META_REDIRECT_URI are required for live Meta OAuth.');
  }
  const params = new URLSearchParams({
    client_id: env.META_APP_ID,
    redirect_uri: env.META_REDIRECT_URI,
    state,
    scope: ['ads_management', 'ads_read', 'pages_show_list', 'business_management'].join(','),
  });
  return { url: `https://www.facebook.com/${env.META_GRAPH_VERSION}/dialog/oauth?${params}`, mock: false };
}

export async function listAdAccounts(): Promise<Array<{ id: string; name: string; currency: string }>> {
  if (env.META_MOCK_MODE) {
    return [
      { id: 'act_mock_1001', name: 'LeadPulse Demo Ad Account', currency: 'USD' },
      { id: 'act_mock_1002', name: 'Local Services Sandbox', currency: 'USD' },
    ];
  }
  throw new Error('Live Meta ad account listing requires OAuth token storage and approved Meta permissions.');
}

export async function listFacebookPages(): Promise<Array<{ id: string; name: string }>> {
  if (env.META_MOCK_MODE) {
    return [
      { id: 'page_mock_1001', name: 'LeadPulse Demo Page' },
      { id: 'page_mock_1002', name: 'Local Services Page' },
    ];
  }
  throw new Error('Live Meta page listing requires OAuth token storage and approved Meta permissions.');
}

export async function publishPausedCampaign(input: PublishInput): Promise<MetaPublishResponse> {
  const campaignId = makeId('campaign');
  const adSetId = makeId('adset');
  const adId = makeId('ad');
  const response = metaPublishResponseSchema.parse({
    campaignId,
    metaCampaignId: env.META_MOCK_MODE ? fakeMetaId('mock_campaign') : fakeMetaId('meta_campaign'),
    adSetIds: [adSetId],
    adIds: [adId],
    status: 'PAUSED',
  });
  const createdAt = nowIso();
  await setDoc('campaigns', campaignId, {
    id: campaignId,
    organizationId: input.organizationId,
    clientId: input.clientId,
    campaignDraftId: input.campaignDraftId,
    metaCampaignId: response.metaCampaignId,
    status: 'PAUSED',
    createdAt,
    updatedAt: createdAt,
  });
  await setDoc('adSets', adSetId, {
    id: adSetId,
    campaignId,
    metaAdSetId: env.META_MOCK_MODE ? fakeMetaId('mock_adset') : fakeMetaId('meta_adset'),
    status: 'PAUSED',
    createdAt,
    updatedAt: createdAt,
  });
  await setDoc('ads', adId, {
    id: adId,
    campaignId,
    adSetId,
    metaAdId: env.META_MOCK_MODE ? fakeMetaId('mock_ad') : fakeMetaId('meta_ad'),
    status: 'PAUSED',
    createdAt,
    updatedAt: createdAt,
  });
  await audit({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: 'publish',
    targetType: 'campaign',
    targetId: campaignId,
    metadata: { metaMockMode: env.META_MOCK_MODE, enforcedStatus: 'PAUSED' },
  });
  return response;
}

export async function activateCampaign(args: {
  organizationId: string;
  actorUserId: string;
  campaignId: string;
  confirmationPhrase: string;
}): Promise<{ campaignId: string; activated: true; statusBeforeActivation: 'PAUSED' }> {
  const expected = `ACTIVATE_${args.campaignId}`;
  if (args.confirmationPhrase !== expected) {
    const error = new Error(`Activation requires exact confirmation phrase: ${expected}`);
    (error as Error & { status?: number }).status = 409;
    throw error;
  }
  const campaign = await getDoc<{ status: string }>('campaigns', args.campaignId);
  if (!campaign) {
    const error = new Error('Campaign not found.');
    (error as Error & { status?: number }).status = 404;
    throw error;
  }
  if (campaign.status !== 'PAUSED') {
    const error = new Error('Only PAUSED campaigns can be activated.');
    (error as Error & { status?: number }).status = 409;
    throw error;
  }
  await updateDoc('campaigns', args.campaignId, {
    activationConfirmedAt: nowIso(),
    activatedByUserId: args.actorUserId,
    updatedAt: nowIso(),
  });
  await audit({
    organizationId: args.organizationId,
    actorUserId: args.actorUserId,
    action: 'activate',
    targetType: 'campaign',
    targetId: args.campaignId,
    metadata: { serverSideGate: true, requiredConfirmationPhrase: expected },
  });
  return { campaignId: args.campaignId, activated: true, statusBeforeActivation: 'PAUSED' };
}
