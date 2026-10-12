import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';
import { Faq } from './Faq';

const faqItems = [
  {
    id: 'trial',
    question: 'How does the 7-day free trial work?',
    answer: 'The landing page offers a 7-day free trial.',
  },
];

describe('Faq', () => {
  afterEach(cleanup);

  it('renders the landing page FAQ questions', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'How does the 7-day free trial work?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'What English level do I need before starting?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Will FluentAI help me eliminate my native accent completely?' })).toBeInTheDocument();
  });

  it('renders supplied questions and exposes the answer state', async () => {
    const user = userEvent.setup();

    render(<Faq items={faqItems} />);

    const question = screen.getByRole('button', { name: faqItems[0].question });
    const answer = screen.getByText(faqItems[0].answer);

    expect(question).toHaveAttribute('aria-expanded', 'false');
    expect(answer).not.toBeVisible();

    await user.click(question);

    expect(question).toHaveAttribute('aria-expanded', 'true');
    expect(answer).toBeVisible();
  });
});
