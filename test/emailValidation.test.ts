import { expect, it } from 'vitest';
import { isValidEmail } from '../src/lib/emailValidation';

it.each(['learner@example.com', ' first.last+trial@example.co.uk ', 'another@example.org'])('accepts %s', value => {
  expect(isValidEmail(value)).toBe(true);
});

it.each(['', '   ', 'learner', 'learner@example', '@example.com', 'a@@example.com', 'a b@example.com', 'a@example .com'])('rejects %s', value => {
  expect(isValidEmail(value)).toBe(false);
});
