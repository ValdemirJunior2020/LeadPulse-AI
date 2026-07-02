import OpenAI from 'openai';
import type { z } from 'zod';
import {
  adCopyOutputSchema,
  aiGenerationSchema,
  audienceOutputSchema,
  campaignStrategyOutputSchema,
  campaignWizardInputSchema,
  complianceOutputSchema,
  landingPageOutputSchema,
  offerOutputSchema,
  type CampaignWizardInput,
} from '@leadpulse/shared';
import { env } from '../config/env.js';
import { masterSystemPrompt, promptModules } from '../ai/prompts.js';
import {
  mockAdCopy,
  mockAudience,
  mockCompliance,
  mockLandingPage,
  mockOffer,
  mockStrategy,
} from '../ai/mockOutputs.js';
import { findDocs, getDoc, setDoc } from './firestore.js';
import { makeId, nowIso } from '../utils/id.js';
import { stableHash } from '../utils/hash.js';
import { audit } from './audit.js';

type PromptType = 'campaign-strategy' | 'ad-copy' | 'audience' | 'offer' | 'compliance-review' | 'landing-page';

type PromptConfig<T> = {
  prompt: (input: CampaignWizardInput) => string;
  schema: z.ZodType<T>;
  mock: (input: CampaignWizardInput) => T;
};

const configs: Record<PromptType, PromptConfig<unknown>> = {
  'campaign-strategy': {
    prompt: promptModules.campaignStrategy,
    schema: campaignStrategyOutputSchema,
    mock: mockStrategy,
  },
  'ad-copy': { prompt: promptModules.adCopy, schema: adCopyOutputSchema, mock: mockAdCopy },
  audience: { prompt: promptModules.audience, schema: audienceOutputSchema, mock: mockAudience },
  offer: { prompt: promptModules.offer, schema: offerOutputSchema, mock: mockOffer },
  'compliance-review': {
    prompt: promptModules.complianceReview,
    schema: complianceOutputSchema,
    mock: mockCompliance,
  },
  'landing-page': { prompt: promptModules.landingPage, schema: landingPageOutputSchema, mock: mockLandingPage },
};

function currentPeriod(): string {
  return new Date().toISOString().slice(0, 7);
}

async function enforceUsageLimit(organizationId: string, userId: string): Promise<void> {
  const period = currentPeriod();
  const id = `${organizationId}_${userId}_${period}`;
  const current = await getDoc<{ aiGenerationsUsed: number; aiGenerationsLimit: number }>('usageLimits', id);
  const used = current?.aiGenerationsUsed ?? 0;
  const limit = current?.aiGenerationsLimit ?? env.AI_MONTHLY_LIMIT_PER_USER;
  if (used >= limit) {
    const error = new Error('Monthly AI generation limit reached.');
    (error as Error & { status?: number }).status = 429;
    throw error;
  }
  await setDoc('usageLimits', id, {
    id,
    organizationId,
    userId,
    period,
    aiGenerationsUsed: used + 1,
    aiGenerationsLimit: limit,
    updatedAt: nowIso(),
  });
}

async function generateWithOpenAI<T>(promptType: PromptType, input: CampaignWizardInput, schema: z.ZodType<T>): Promise<T> {
  if (!env.OPENAI_API_KEY) return schema.parse(configs[promptType].mock(input));
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: env.OPENAI_MODEL_DEFAULT,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: masterSystemPrompt },
      { role: 'user', content: configs[promptType].prompt(input) },
    ],
  });
  const content = response.choices[0]?.message.content ?? '{}';
  return schema.parse(JSON.parse(content));
}

export async function runAiGeneration<T>(args: {
  promptType: PromptType;
  input: unknown;
  userId: string;
  organizationId: string;
}): Promise<{ output: T; cached: boolean; generationId: string }> {
  const parsedInput = campaignWizardInputSchema.parse(args.input);
  const config = configs[args.promptType] as PromptConfig<T>;
  const inputHash = stableHash({ promptType: args.promptType, input: parsedInput });
  const cached = await findDocs<{ id: string; output: unknown; inputHash: string }>(
    'aiGenerations',
    (doc) => doc.inputHash === inputHash,
    1,
  );
  if (cached[0]) {
    return { output: config.schema.parse(cached[0].output), cached: true, generationId: cached[0].id };
  }
  await enforceUsageLimit(args.organizationId, args.userId);
  const output = await generateWithOpenAI(args.promptType, parsedInput, config.schema);
  const generation = aiGenerationSchema.parse({
    id: makeId('ai'),
    organizationId: args.organizationId,
    userId: args.userId,
    promptType: args.promptType,
    inputHash,
    model: env.OPENAI_MODEL_DEFAULT,
    output,
    cached: false,
    createdAt: nowIso(),
  });
  await setDoc('aiGenerations', generation.id, generation);
  await audit({
    organizationId: args.organizationId,
    actorUserId: args.userId,
    action: 'ai_generation',
    targetType: 'aiGeneration',
    targetId: generation.id,
    metadata: { promptType: args.promptType, model: env.OPENAI_MODEL_DEFAULT },
  });
  return { output, cached: false, generationId: generation.id };
}
