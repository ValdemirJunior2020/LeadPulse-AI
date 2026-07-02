import { describe, expect, it } from 'vitest';
import { callrailPayloadToCallLog, stripRecordingReferences } from '../utils/sanitize.js';

describe('CallRail sanitization', () => {
  it('strips recording and audio fields before storage', () => {
    const cleaned = stripRecordingReferences({
      id: 'call_1',
      recording_url: 'https://example.com/recording.mp3',
      audio_url: 'https://example.com/audio.mp3',
      source: 'facebook',
    });
    expect(cleaned).not.toHaveProperty('recording_url');
    expect(cleaned).not.toHaveProperty('audio_url');
    expect(cleaned).toHaveProperty('source', 'facebook');
  });

  it('maps only metadata to the call log schema', () => {
    const log = callrailPayloadToCallLog(
      {
        id: 'call_1',
        duration: 32,
        answered: true,
        customer_phone_number: '+15555550101',
        recording_url: 'https://example.com/recording.mp3',
      },
      { organizationId: 'org_1', clientId: 'client_1' },
    );
    expect(JSON.stringify(log)).not.toContain('recording');
    expect(JSON.stringify(log)).not.toContain('audio');
    expect(log.duration).toBe(32);
    expect(log.answered).toBe(true);
  });
});
