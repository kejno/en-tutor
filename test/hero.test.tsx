import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../src/App';

afterEach(cleanup);

describe('hero', () => {
  it('shows a persistent local demo confirmation below the trial actions', async () => {
    const user = userEvent.setup();
    render(<App />);
    const hero = screen.getByRole('region', { name: 'Speak English with Natural Confidence in Just 15 Minutes a Day' });
    expect(within(hero).queryByRole('status')).not.toBeInTheDocument();
    for (let click = 0; click < 2; click += 1) {
      await user.click(within(hero).getByRole('button', { name: 'Start trial from hero' }));
      expect(within(hero).getByRole('status')).toHaveTextContent('Демонстрационный режим активирован. Регистрация аккаунта не требуется.');
      expect(within(hero).getByRole('status')).not.toHaveClass('sr-only');
    }
  });

  it('keeps the demo anchor and published rating with the coach', () => {
    render(<App />);
    const hero = screen.getByRole('region', { name: 'Speak English with Natural Confidence in Just 15 Minutes a Day' });
    expect(within(hero).getByRole('link', { name: /Watch 2-Min Live Demo/ })).toHaveAttribute('href', '#live-coach');
    expect(within(hero).getByRole('region', { name: 'Live Coach' })).toBeInTheDocument();
    expect(within(hero).getByText('4.9/5')).toBeInTheDocument();
    expect(within(hero).getByText(/48,000\+ active learners across 110 countries/)).toBeInTheDocument();
  });
});
