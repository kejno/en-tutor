import { describe, expect, it } from 'vitest';
import { assessmentDemo, renderAssessmentCard } from '../src/assessment';

describe('assessment demo', () => {
  it('uses the approved dialogue and metrics', () => {
    expect(assessmentDemo.score).toBe(94);
    expect(assessmentDemo.metrics.map(metric => metric.value)).toEqual([92, 88, 80]);
    expect(assessmentDemo.conversation).toHaveLength(2);
    expect(assessmentDemo.conversation[0].text).toContain('latency spike');
    expect(assessmentDemo.conversation[1].text).toContain('make mistakes yesterday');
  });

  it('renders both messages and all accessible metric bars', () => {
    const card = renderAssessmentCard();
    expect(card.querySelectorAll('[data-testid="conversation-message"]')).toHaveLength(2);
    expect(card.querySelector('[data-testid="assessment-score"]')).toHaveTextContent('94%');
    expect([...card.querySelectorAll('[role="progressbar"]')].map(bar => bar.getAttribute('aria-valuenow'))).toEqual(['92', '88', '80']);
    expect(card.textContent).toContain('we made mistakes yesterday');
    expect(card.textContent).toContain('we encountered an oversight');
  });

  it('clearly limits the preview to a static demonstration', () => {
    const card = renderAssessmentCard();
    expect(card.textContent).toContain('Статичная демонстрация');
    expect(card.querySelector('input')).toBeDisabled();
    expect(card.querySelector('button')).toBeDisabled();
    expect(card.querySelector('form')).toBeNull();
  });
});
