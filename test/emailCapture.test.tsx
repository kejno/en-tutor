import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { EmailCapture } from '../src/components/EmailCapture';

afterEach(cleanup);

it('uses the reference English field and action labels', () => {
  render(<EmailCapture />);
  expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveAttribute('placeholder', 'Enter your email address');
  expect(screen.getByRole('button', { name: 'Claim 7 Days Free' })).toHaveClass('ant-btn');
});

it('rejects empty and invalid emails, clears errors on edit and confirms only locally', async () => {
  const user = userEvent.setup();
  render(<EmailCapture />);
  const input = screen.getByRole('textbox');
  const submit = screen.getByRole('button');
  for (const value of ['', 'invalid', 'learner@example']) {
    fireEvent.change(input, { target: { value } });
    await user.click(submit);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Введите корректный адрес электронной почты.')).toHaveAttribute('id', 'cta-email-error');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  }
  await user.type(input, '.com');
  expect(input).toHaveAttribute('aria-invalid', 'false');
  await user.click(submit);
  expect(screen.getByRole('status')).toHaveTextContent('Данные не отправляются на сервер');
  expect(screen.getByRole('status')).not.toHaveTextContent('сохранена');
  await user.type(input, 'x');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('prevents form navigation and keeps the footer form functional', () => {
  const { container } = render(<EmailCapture compact />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: ' footer@example.com ' } });
  expect(fireEvent.submit(container.querySelector('form')!)).toBe(false);
  expect(screen.getByRole('button', { name: 'Join' })).toBeInTheDocument();
  expect(screen.getByRole('status')).toBeInTheDocument();
});
