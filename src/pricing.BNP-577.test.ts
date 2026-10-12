import { describe, expect, it } from 'vitest';
import { getPriceView } from './pricing';

describe('BNP-577: представление тарифов', () => {
  it('рассчитывает годовой эквивалент и итоговую сумму для всех планов', () => {
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

  it('сохраняет месячную цену при помесячной оплате', () => {
    expect(getPriceView(24, 'monthly')).toEqual({
      monthly: '$24.00',
      billing: 'в месяц',
    });
  });
});
