import { expect, test } from '@playwright/test';

test('BNP-576: секция тарифов показывает три плана, рекомендацию и CTA', async ({ page }) => {
  await page.goto('/');

  const pricing = page.locator('#pricing');
  await expect(pricing.getByRole('heading', { name: 'Invest in Your Verbal Future' })).toBeVisible();

  const plans = pricing.locator('.plan');
  await expect(plans).toHaveCount(3);
  await expect(plans.nth(0)).toContainText('Starter');
  await expect(plans.nth(1)).toContainText('Pro Fluency');
  await expect(plans.nth(2)).toContainText('Executive 1-on-1 AI+');
  await expect(pricing.locator('.plan.featured')).toHaveCount(1);
  await expect(pricing.locator('.plan.featured')).toContainText('Most Popular Choice');

  for (const plan of await plans.all()) {
    await expect(plan.locator('.price-value')).toBeVisible();
    await expect(plan.locator('ul li').first()).toBeVisible();
    await expect(plan.getByRole('button', { name: 'Start Free 7-Day Trial' })).toBeVisible();
  }
});
