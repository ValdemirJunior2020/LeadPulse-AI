import { z } from 'zod';

export const roleSchema = z.enum(['owner_admin', 'client_user', 'team_member']);
export type Role = z.infer<typeof roleSchema>;

export const leadStatusSchema = z.enum(['new', 'qualified', 'booked', 'lost', 'spam', 'unknown']);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const timestampStringSchema = z.string().min(1);

export const userSchema = z.object({
  id: z.string().min(1),
  clerkUserId: z.string().min(1),
  email: z.string().email().optional(),
  name: z.string().optional(),
  defaultOrganizationId: z.string().optional(),
  createdAt: timestampStringSchema,
  updatedAt: timestampStringSchema,
});
export type User = z.infer<typeof userSchema>;

export const organizationMemberSchema = z.object({
  userId: z.string().min(1),
  role: roleSchema,
  assignedClientIds: z.array(z.string()).default([]),
});

export const organizationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  ownerUserId: z.string().min(1),
  members: z.array(organizationMemberSchema).default([]),
  createdAt: timestampStringSchema,
  updatedAt: timestampStringSchema,
});
export type Organization = z.infer<typeof organizationSchema>;

export const clientSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  name: z.string().min(1),
  businessType: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  phone: z.string().optional(),
  serviceArea: z.string().optional(),
  createdAt: timestampStringSchema,
  updatedAt: timestampStringSchema,
});
export type Client = z.infer<typeof clientSchema>;

export const metaConnectionSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  clientId: z.string().min(1),
  metaUserId: z.string().optional(),
  adAccountId: z.string().optional(),
  pageId: z.string().optional(),
  tokenEncrypted: z.string().optional(),
  expiresAt: timestampStringSchema.optional(),
  createdAt: timestampStringSchema,
  updatedAt: timestampStringSchema,
});
export type MetaConnection = z.infer<typeof metaConnectionSchema>;

export const callrailConnectionSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  clientId: z.string().min(1),
  accountId: z.string().optional(),
  companyId: z.string().optional(),
  apiKeyEncrypted: z.string().min(1),
  createdAt: timestampStringSchema,
  updatedAt: timestampStringSchema,
});
export type CallrailConnection = z.infer<typeof callrailConnectionSchema>;

export const campaignTypeSchema = z.enum([
  'local_lead_generation',
  'missed_call_recovery',
  'seasonal_offer',
  'retargeting',
  'brand_awareness',
  'appointment_booking',
]);
export type CampaignType = z.infer<typeof campaignTypeSchema>;

export const metaPublisherPlatformSchema = z.enum(['facebook', 'instagram']);
export type MetaPublisherPlatform = z.infer<typeof metaPublisherPlatformSchema>;

export const campaignWizardInputSchema = z.object({
  campaignType: campaignTypeSchema,
  businessName: z.string().min(1),
  industry: z.string().min(1),
  offer: z.string().min(1),
  location: z.string().min(1),
  audience: z.string().min(1),
  budget: z.string().min(1),
  serviceArea: z.string().min(1),
  landingPage: z.string().url(),
  phoneOrTrackingNumber: z.string().min(3),
  goal: z.string().min(1),
  metaPublisherPlatforms: z.array(metaPublisherPlatformSchema).min(1).default(['facebook', 'instagram']),
  tone: z.string().min(1),
});
export type CampaignWizardInput = z.infer<typeof campaignWizardInputSchema>;

export const campaignStrategyOutputSchema = z.object({
  objective: z.string(),
  positioning: z.string(),
  funnel: z.array(z.string()),
  kpis: z.array(z.string()),
  risks: z.array(z.string()),
  nextSteps: z.array(z.string()),
});
export type CampaignStrategyOutput = z.infer<typeof campaignStrategyOutputSchema>;

export const audienceOutputSchema = z.object({
  coreAudience: z.string(),
  locations: z.array(z.string()),
  exclusions: z.array(z.string()),
  interests: z.array(z.string()),
  notes: z.array(z.string()),
});
export type AudienceOutput = z.infer<typeof audienceOutputSchema>;

export const adCopyOutputSchema = z.object({
  primaryText: z.array(z.string()).length(10),
  headlines: z.array(z.string()).length(10),
  descriptions: z.array(z.string()).length(5),
  ctas: z.array(z.string()).length(5),
  hooks: z.array(z.string()).length(3),
  emotionalAngles: z.array(z.string()).length(3),
  logicalAngles: z.array(z.string()).length(3),
});
export type AdCopyOutput = z.infer<typeof adCopyOutputSchema>;

export const offerOutputSchema = z.object({
  offerName: z.string(),
  valueProposition: z.string(),
  incentiveIdeas: z.array(z.string()),
  terms: z.array(z.string()),
  urgencyWithoutFakeScarcity: z.array(z.string()),
});
export type OfferOutput = z.infer<typeof offerOutputSchema>;

export const complianceOutputSchema = z.object({
  approvedForDrafting: z.boolean(),
  riskyClaims: z.array(z.string()),
  prohibitedCategoryConcerns: z.array(z.string()),
  specialAdCategoryConcerns: z.array(z.string()),
  requiredEdits: z.array(z.string()),
  summary: z.string(),
});
export type ComplianceOutput = z.infer<typeof complianceOutputSchema>;

export const landingPageOutputSchema = z.object({
  heroHeadline: z.string(),
  heroSubheadline: z.string(),
  sections: z.array(z.object({ title: z.string(), body: z.string() })),
  trustSignals: z.array(z.string()),
  callToAction: z.string(),
});
export type LandingPageOutput = z.infer<typeof landingPageOutputSchema>;

export const campaignDraftSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  clientId: z.string().min(1).optional(),
  createdByUserId: z.string().min(1),
  input: campaignWizardInputSchema,
  strategy: campaignStrategyOutputSchema.optional(),
  audience: audienceOutputSchema.optional(),
  adCopy: adCopyOutputSchema.optional(),
  offer: offerOutputSchema.optional(),
  compliance: complianceOutputSchema.optional(),
  landingPage: landingPageOutputSchema.optional(),
  status: z.enum(['draft', 'ready_for_compliance', 'ready_to_publish', 'published_paused']).default('draft'),
  createdAt: timestampStringSchema,
  updatedAt: timestampStringSchema,
});
export type CampaignDraft = z.infer<typeof campaignDraftSchema>;

export const aiGenerationSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  userId: z.string().min(1),
  promptType: z.string().min(1),
  inputHash: z.string().min(1),
  model: z.string().min(1),
  output: z.unknown(),
  cached: z.boolean().default(false),
  createdAt: timestampStringSchema,
});
export type AiGeneration = z.infer<typeof aiGenerationSchema>;

export const campaignSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  clientId: z.string().min(1),
  campaignDraftId: z.string().min(1),
  metaCampaignId: z.string().min(1),
  status: z.literal('PAUSED'),
  activationConfirmedAt: timestampStringSchema.optional(),
  activatedByUserId: z.string().optional(),
  createdAt: timestampStringSchema,
  updatedAt: timestampStringSchema,
});
export type Campaign = z.infer<typeof campaignSchema>;

export const adSetSchema = z.object({
  id: z.string().min(1),
  campaignId: z.string().min(1),
  metaAdSetId: z.string().min(1),
  status: z.literal('PAUSED'),
  createdAt: timestampStringSchema,
  updatedAt: timestampStringSchema,
});
export type AdSet = z.infer<typeof adSetSchema>;

export const adSchema = z.object({
  id: z.string().min(1),
  campaignId: z.string().min(1),
  adSetId: z.string().min(1),
  metaAdId: z.string().min(1),
  status: z.literal('PAUSED'),
  createdAt: timestampStringSchema,
  updatedAt: timestampStringSchema,
});
export type Ad = z.infer<typeof adSchema>;

export const callLogSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  clientId: z.string().min(1).optional(),
  callrailCallId: z.string().min(1),
  accountId: z.string().optional(),
  companyId: z.string().optional(),
  campaignId: z.string().optional(),
  source: z.string().optional(),
  sourceName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerCity: z.string().optional(),
  customerState: z.string().optional(),
  startTime: timestampStringSchema,
  duration: z.number().nonnegative().default(0),
  answered: z.boolean().default(false),
  firstTimeCaller: z.boolean().default(false),
  landingPageUrl: z.string().url().optional(),
  referringUrl: z.string().url().optional(),
  utmCampaign: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmContent: z.string().optional(),
  leadStatus: leadStatusSchema.default('unknown'),
  tags: z.array(z.string()).default([]),
  createdAt: timestampStringSchema,
});
export type CallLog = z.infer<typeof callLogSchema>;

export const googleSheetExportSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  requestedByUserId: z.string().min(1),
  exportType: z.enum(['campaign_summary', 'ai_strategy', 'ad_copy', 'call_logs', 'weekly_metrics']),
  sheetUrl: z.string().url().optional(),
  status: z.enum(['queued', 'running', 'complete', 'failed']).default('queued'),
  createdAt: timestampStringSchema,
  updatedAt: timestampStringSchema,
});
export type GoogleSheetExport = z.infer<typeof googleSheetExportSchema>;

export const auditLogSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  actorUserId: z.string().min(1),
  action: z.enum(['publish', 'activate', 'delete', 'api_connection', 'export', 'ai_generation', 'sync']),
  targetType: z.string().min(1),
  targetId: z.string().min(1),
  metadata: z.record(z.unknown()).default({}),
  createdAt: timestampStringSchema,
});
export type AuditLog = z.infer<typeof auditLogSchema>;

export const usageLimitSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  userId: z.string().min(1),
  period: z.string().regex(/^\d{4}-\d{2}$/),
  aiGenerationsUsed: z.number().int().nonnegative().default(0),
  aiGenerationsLimit: z.number().int().positive(),
  updatedAt: timestampStringSchema,
});
export type UsageLimit = z.infer<typeof usageLimitSchema>;

export const collectionSchemas = {
  users: userSchema,
  organizations: organizationSchema,
  clients: clientSchema,
  metaConnections: metaConnectionSchema,
  callrailConnections: callrailConnectionSchema,
  campaignDrafts: campaignDraftSchema,
  campaigns: campaignSchema,
  adSets: adSetSchema,
  ads: adSchema,
  aiGenerations: aiGenerationSchema,
  callLogs: callLogSchema,
  googleSheetExports: googleSheetExportSchema,
  auditLogs: auditLogSchema,
  usageLimits: usageLimitSchema,
} as const;

export type CollectionName = keyof typeof collectionSchemas;

export const metaPublishResponseSchema = z.object({
  campaignId: z.string(),
  metaCampaignId: z.string(),
  adSetIds: z.array(z.string()),
  adIds: z.array(z.string()),
  status: z.literal('PAUSED'),
});
export type MetaPublishResponse = z.infer<typeof metaPublishResponseSchema>;
