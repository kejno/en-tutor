import { describe, expect, it } from 'vitest';
import { assessmentDemo, renderAssessmentCard } from '../src/assessment.ts';

describe('assessment demo', () => {
  it('contains a multi-turn conversation and the published speech metrics', () => {
    expect(assessmentDemo.conversation.length).toBeGreaterThan(1);
    expect(assessmentDemo.score).toBe(94);
    expect(assessmentDemo.metrics).toEqual([
      { label: 'Pronunciation Clarity', value: 95 },
      { label: 'Conversational Flow', value: 88 },
      { label: 'Lexical Sophistication', value: 80 },
    ]);
  });

  it('renders the conversation, statuses, score, and metric labels', () => {
    const card = renderAssessmentCard();

    expect(card.querySelector('[data-testid="assessment-score"]')?.textContent).toContain('94%');
    expect(card.querySelectorAll('[data-testid="conversation-message"]')).toHaveLength(3);
    expect(card.textContent).toContain('Emma');
    expect(card.textContent).toContain('Excellent');
    expect(card.textContent).toContain('Pronunciation Clarity');
    expect(card.textContent).toContain('Vocabulary Growth');
  });
});
