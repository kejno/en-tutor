import { describe, expect, it } from 'vitest';
import { toggleFaqItem } from './faqState';

describe('toggleFaqItem', () => {
  it('opens one item and closes it when toggled again', () => {
    expect(toggleFaqItem(null, 'trial')).toBe('trial');
    expect(toggleFaqItem('trial', 'trial')).toBe(null);
  });

  it('keeps only one item open at a time', () => {
    expect(toggleFaqItem('trial', 'level')).toBe('level');
  });
});
