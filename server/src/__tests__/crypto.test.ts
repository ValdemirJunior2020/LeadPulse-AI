import { describe, expect, it } from 'vitest';
import { decryptSecret, encryptSecret } from '../services/crypto.js';

describe('AES secret encryption', () => {
  it('round-trips API keys without storing them directly', () => {
    const encrypted = encryptSecret('callrail_test_key_123');
    expect(encrypted).not.toContain('callrail_test_key_123');
    expect(decryptSecret(encrypted)).toBe('callrail_test_key_123');
  });
});
