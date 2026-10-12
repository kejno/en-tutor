import { describe, expect, it } from 'vitest';
import { assessmentDemo, renderAssessmentCard } from '../src/assessment';

describe('BNP-580: карточка оценки речи Emma', () => {
  it('показывает диалог, статусы, общую оценку и метрики демонстрации', () => {
    const card = renderAssessmentCard();

    expect(assessmentDemo.conversation).toHaveLength(3);
    expect(card.querySelectorAll('[data-testid="conversation-message"]')).toHaveLength(3);
    expect(card.textContent).toContain('Emma');
    expect(card.textContent).toContain('Natural expression');
    expect(card.textContent).toContain('Excellent flow');
    expect(card.textContent).toContain('Clear and confident');
    expect(card.querySelector('[data-testid="assessment-score"]')).toHaveTextContent('94%');
    expect(card.textContent).toContain('Pronunciation Clarity');
    expect(card.textContent).toContain('Conversational Flow');
    expect(card.textContent).toContain('Lexical Sophistication');
    expect(card.textContent).toContain('Vocabulary Growth');
  });
});
