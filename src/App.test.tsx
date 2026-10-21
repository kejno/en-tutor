import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

describe('FluentAI landing page navigation', () => {
  afterEach(cleanup);

  it('links Interactive Demo to the Live Coach region', () => {
    render(<App />);

    expect(within(screen.getByRole('navigation', { name: 'Primary navigation' })).getByRole('link', { name: 'Interactive Demo' })).toHaveAttribute('href', '#live-coach');
    expect(screen.getByRole('region', { name: 'Live Coach' })).toBeInTheDocument();
  });

  it('uses Ant Design for the primary trial action', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'Start Free Trial' })).toHaveClass('ant-btn');
  });

  it('provides a vertical mobile navigation menu without horizontal overflow', () => {
    render(<App />);

    const navigation = screen.getByRole('navigation', { name: 'Mobile primary navigation' });
    expect(navigation).toHaveClass('mobile-navigation-links');
    expect(navigation.querySelectorAll('a')).toHaveLength(5);
  });

  it('changes only the active state when a learning topic is selected', async () => {
    const user = userEvent.setup();
    render(<App />);

    const topics = screen.getAllByTestId('topic-tag');
    expect(topics[0]).toHaveAttribute('aria-pressed', 'true');
    await user.click(topics[1]);

    expect(topics[0]).toHaveAttribute('aria-pressed', 'false');
    expect(topics[1]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Ace C-Suite Reviews/)).toBeInTheDocument();
  });
});
