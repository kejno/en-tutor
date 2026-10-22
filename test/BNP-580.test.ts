import { expect, it } from 'vitest';
import { renderAssessmentCard } from '../src/assessment';

it('показывает исправление грамматики рядом с диалогом', () => {
  const card = renderAssessmentCard();
  expect(card.querySelector('del')).toHaveTextContent('we make mistakes yesterday');
  expect(card.querySelectorAll('ins')).toHaveLength(2);
  expect(card.textContent).toContain('CEFR: C1 Native');
});
