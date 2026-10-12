import { describe, expect, it } from 'vitest';
import { getPriceView } from '../src/pricing';

describe('getPriceView', () => {
  it('calculates annual equivalent and total for all plans', () => {
    expect(getPriceView(14, 'annual')).toEqual({
      monthly: '$8.40',
      billing: '$100.80 списывается ежегодно',
    });
    expect(getPriceView(24, 'annual')).toEqual({
      monthly: '$14.40',
      billing: '$172.80 списывается ежегодно',
    });
    expect(getPriceView(49, 'annual')).toEqual({
      monthly: '$29.40',
      billing: '$352.80 списывается ежегодно',
    });
  });

  it('keeps monthly price when billed monthly', () => {
    expect(getPriceView(24, 'monthly')).toEqual({
      monthly: '$24.00',
      billing: 'в месяц',
    });
  });
});
