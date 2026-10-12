import { describe, expect, it } from 'vitest';
import { isValidEmail } from './emailValidation';

describe('isValidEmail', () => {
  it('accepts a correctly formatted email address', () => {
    expect(isValidEmail('learner@example.com')).toBe(true);
  });

  it('rejects an incomplete or whitespace-only address', () => {
    expect(isValidEmail('learner@example')).toBe(false);
    expect(isValidEmail('   ')).toBe(false);
  });
});
