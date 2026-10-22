import { describe, expect, it } from 'vitest';
import { capabilityCards, learningMetrics } from './capabilities';

describe('capability section configuration', () => {
  it('keeps the four cards in the design order with their supporting content', () => {
    expect(capabilityCards.map((card) => card.title)).toEqual([
      'Zero-Judgment Conversational Haven',
      'Phonetic Accent Tuner',
      '1,200+ Roleplay Scenarios',
      'Adaptive Persistent Memory',
    ]);
    expect(capabilityCards[0].sampleMessage).toContain('French accent');
    expect(capabilityCards[1].indicator).toBe('Match: 95%');
    expect(capabilityCards[2].tags).toEqual(['Coffee Shop', 'VC Seed Pitch', 'Emergency Room', '+ Custom Prompt']);
    expect(capabilityCards[3].description).toContain('she will organically prompt');
    expect(capabilityCards[3].indicator).toBe('Auto-synced');
  });

  it('defines the four static metrics in the design order', () => {
    expect(learningMetrics).toEqual([
      { value: '3.4x', label: 'FLUENCY GAINS', description: 'Faster than traditional flashcard apps' },
      { value: '87%', label: 'INTERVIEW SUCCESS', description: 'Passed within 60 days of 15-min practice' },
      { value: '+1.5', label: 'IELTS BAND JUMP', description: 'Documented across 12,000+ test-takers' },
      { value: '12.4M', label: 'MINUTES PRACTICED', description: 'Zero embarrassment. 100% private.' },
    ]);
  });
});
