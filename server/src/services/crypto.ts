import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import { env } from '../config/env.js';

function getKey(): Buffer {
  const configured = env.ENCRYPTION_KEY;
  if (!configured) {
    if (env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY is required in production.');
    }
    return scryptSync('leadpulse-local-dev-key', 'leadpulse-ai', 32);
  }

  if (/^[A-Fa-f0-9]{64}$/.test(configured)) return Buffer.from(configured, 'hex');
  const base64 = Buffer.from(configured, 'base64');
  if (base64.length === 32) return base64;
  return scryptSync(configured, 'leadpulse-ai', 32);
}

export function encryptSecret(plainText: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`;
}

export function decryptSecret(encrypted: string): string {
  const [ivB64, tagB64, encryptedB64] = encrypted.split('.');
  if (!ivB64 || !tagB64 || !encryptedB64) throw new Error('Invalid encrypted payload.');
  const decipher = createDecipheriv('aes-256-gcm', getKey(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedB64, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
