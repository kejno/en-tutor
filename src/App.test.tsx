import { cleanup, render, screen, within } from '@testing-library/react';
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
});
