import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../src/App';
import { learningMetrics } from '../src/capabilities';

const descriptions = [
  'Faster than traditional flashcard apps',
  'Passed within 60 days of 15-min practice',
  'Documented across 12,000+ test-takers',
  'Zero embarrassment. 100% private.',
];

describe('learning metrics', () => {
  it('keeps all four values and explanations in design order', () => {
    expect(learningMetrics.map(({ value }) => value)).toEqual(['3.4x', '87%', '+1.5', '12.4M']);
    expect(learningMetrics.map((metric) => metric.description)).toEqual(descriptions);
  });

  it('renders label, value and explanation together for every metric', () => {
    render(<App />);
    const section = screen.getByRole('region', { name: 'Learning metrics' });
    expect(section.children).toHaveLength(4);
    learningMetrics.forEach((metric, index) => {
      const card = section.children[index] as HTMLElement;
      expect(within(card).getByText(metric.label)).toBeVisible();
      expect(Array.from(card.children).map((child) => child.textContent)).toEqual([
        metric.label, metric.value, descriptions[index],
      ]);
    });
  });
});
