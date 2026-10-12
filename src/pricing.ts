export type BillingPeriod = 'monthly' | 'annual';

export interface PriceView {
  monthly: string;
  billing: string;
}

export function getPriceView(monthlyPrice: number, period: BillingPeriod): PriceView {
  if (period === 'monthly') {
    return {
      monthly: `$${monthlyPrice.toFixed(2)}`,
      billing: 'в месяц',
    };
  }

  const annualMonthlyPrice = monthlyPrice * 0.6;
  const annualTotal = annualMonthlyPrice * 12;

  return {
    monthly: `$${annualMonthlyPrice.toFixed(2)}`,
    billing: `$${annualTotal.toFixed(2)} списывается ежегодно`,
  };
}
