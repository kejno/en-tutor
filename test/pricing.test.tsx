import { cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import App from '../src/App';

afterEach(cleanup);

it('starts monthly with complete plan options and secondary outer actions', () => {
  const { container } = render(<App />);
  const pricing = within(container.querySelector('#pricing')! as HTMLElement);
  expect(pricing.getByRole('button', { name: 'Billed Monthly' })).toHaveAttribute('aria-pressed', 'true');
  expect(Array.from(container.querySelectorAll('.price-value'), node => node.textContent)).toEqual(['$14', '$24', '$49']);
  expect(Array.from(container.querySelectorAll('.plan ul'), node => node.children.length)).toEqual([4, 5, 4]);
  expect(pricing.getByText('AI Features')).toBeInTheDocument();
  expect(pricing.getByText('Phonetic accent waveforms').closest('li')).toHaveClass('unavailable');
  expect(pricing.getAllByRole('button', { name: 'Start Free 7-Day Trial' }).map(button => button.classList.contains('ant-btn-primary'))).toEqual([false, true, false]);
});

it('switches all prices using the keyboard and shows only a local demo result', async () => {
  const user = userEvent.setup();
  const { container } = render(<App />);
  const pricing = within(container.querySelector('#pricing')! as HTMLElement);
  pricing.getByRole('button', { name: /Billed Annually/ }).focus();
  await user.keyboard(' ');
  expect(Array.from(container.querySelectorAll('.price-value'), node => node.textContent)).toEqual(['$8.40', '$14.40', '$29.40']);
  expect(Array.from(container.querySelectorAll('[data-billing]'), node => node.textContent)).toEqual(['$100.80 списывается ежегодно', '$172.80 списывается ежегодно', '$352.80 списывается ежегодно']);
  for (const button of pricing.getAllByRole('button', { name: 'Start Free 7-Day Trial' })) {
    await user.click(button);
    expect(pricing.getByRole('status')).toHaveTextContent('Локальная демонстрация');
    expect(pricing.getByRole('status')).toHaveTextContent('Подписка не оформлена');
  }
  pricing.getByRole('button', { name: 'Billed Monthly' }).focus();
  await user.keyboard('{Enter}');
  expect(Array.from(container.querySelectorAll('.price-value'), node => node.textContent)).toEqual(['$14', '$24', '$49']);
});
