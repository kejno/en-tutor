import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import App from '../src/App';

const questions = ['Is an AI tutor genuinely better than a human tutor?', 'How does the 7-day free trial work?', 'What English level do I need before starting?', 'Will FluentAI help me eliminate my native accent completely?'];
const demoAnswer = 'Демо показывает, как FluentAI помогает практиковать английскую речь и получать обратную связь. Это демонстрация возможностей продукта, а не утверждение о превосходстве ИИ-репетитора над человеческим репетитором.';
afterEach(cleanup);
it('renders four ordered questions and the approved demo answer', async () => {
  const user = userEvent.setup();
  render(<App />);
  const faq = screen.getByRole('region', { name: 'Frequently Asked Questions' });
  expect(within(faq).getAllByRole('button').map((button) => button.textContent)).toEqual(questions);
  await user.click(within(faq).getByRole('button', { name: questions[0] }));
  expect(within(faq).getByText(demoAnswer)).toBeVisible();
});
it('opens and closes all answers by keyboard with unique aria relationships', async () => {
  const user = userEvent.setup();
  render(<App />);
  const buttons = within(screen.getByRole('region', { name: 'Frequently Asked Questions' })).getAllByRole('button');
  for (const [index, button] of buttons.entries()) {
    expect(button).toHaveAttribute('aria-expanded', 'false');
    button.focus();
    await user.keyboard(index % 2 ? ' ' : '{Enter}');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const panel = document.getElementById(button.getAttribute('aria-controls')!);
    expect(panel).toBeVisible();
    expect(panel).toHaveAttribute('aria-labelledby', button.id);
    await user.keyboard(index % 2 ? ' ' : '{Enter}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(panel).not.toBeVisible();
  }
  expect(new Set(buttons.map((button) => button.getAttribute('aria-controls'))).size).toBe(4);
  await user.click(buttons[0]);
  await user.click(buttons[1]);
  expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
  expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
});
