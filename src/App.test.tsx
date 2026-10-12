import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('FluentAI landing page', () => {
  it('renders the root route with the key header actions', () => {
    render(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    const header = screen.getByRole('banner');
    expect(within(header).getByRole('link', { name: /fluentai/i })).toBeInTheDocument();
    expect(within(header).getByRole('link', { name: /methodology/i })).toHaveAttribute('href', '#methodology');
    expect(within(header).getByRole('link', { name: /interactive demo/i })).toHaveAttribute('href', '#live-coach');
    expect(within(header).getByRole('link', { name: /start free trial/i })).toBeInTheDocument();
  });

  it('keeps navigation usable on small screens through the menu button', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(within(screen.getAllByRole('banner')[0]).getByRole('button', { name: /open navigation/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /pricing/i })).toBeInTheDocument();
  });
});
