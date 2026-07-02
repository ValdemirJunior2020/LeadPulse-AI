import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8080),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  SERVER_URL: z.string().default('http://localhost:8080'),
  CLERK_SECRET_KEY: z.string().optional(),
  CLERK_JWT_ISSUER: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL_DEFAULT: z.string().default('gpt-4o-mini'),
  OPENAI_MODEL_UPGRADE: z.string().default('gpt-4o'),
  AI_MONTHLY_LIMIT_PER_USER: z.coerce.number().int().positive().default(100),
  META_APP_ID: z.string().optional(),
  META_APP_SECRET: z.string().optional(),
  META_REDIRECT_URI: z.string().optional(),
  META_GRAPH_VERSION: z.string().default('v23.0'),
  META_MOCK_MODE: z
    .string()
    .default('true')
    .transform((value) => value === 'true'),
  CALLRAIL_WEBHOOK_SECRET: z.string().optional(),
  ENCRYPTION_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export const isProduction = env.NODE_ENV === 'production';
