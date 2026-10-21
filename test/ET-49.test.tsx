import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../src/App';
import { methodologySteps } from '../src/methodology';

describe('ET-49: секция методики', () => {
  it('связывает якорь с доступным заголовком и показывает три шага с показателями', () => {
    render(<App />);
    const section = screen.getByRole('region', { name: 'The 3-Step Rapid Fluency Method' });
    expect(section).toHaveAttribute('id', 'methodology');
    expect(screen.getAllByRole('link', { name: 'Methodology' })[0]).toHaveAttribute('href', '#methodology');
    const cards = within(section).getAllByRole('article');
    expect(cards).toHaveLength(3);
    methodologySteps.forEach((step, index) => {
      expect(within(cards[index]).getByRole('heading', { level: 3 })).toHaveTextContent(step.title);
      for (const text of [step.number, step.description, step.metricLabel, step.metricValue]) {
        expect(within(cards[index]).getByText(text, { exact: true })).toBeVisible();
      }
    });
    expect(methodologySteps.map(({ title, metricValue }) => [title, metricValue])).toEqual([
      ['Diagnostic Voice Assessment', 'Sub-word FFT analysis'],
      ['Daily 15-Min Micro-Dialogues', '< 320ms Real-Time'],
      ['Surgical Accent Alignment', '96% Retention at 30 days'],
    ]);
  });
});
