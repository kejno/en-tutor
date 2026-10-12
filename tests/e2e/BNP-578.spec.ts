import { expect, test } from '@playwright/test';

test('BNP-578: карточки тарифов адаптируются на разных ширинах без потери содержимого', async ({ page }) => {
  for (const width of [1280, 768, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');

    const pricing = page.locator('#pricing');
    const plans = pricing.locator('.plan');
    await expect(plans).toHaveCount(3);
    await expect(pricing.getByRole('heading', { name: 'Invest in Your Verbal Future' })).toBeVisible();
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth).toBeLessThanOrEqual(width);

    for (const plan of await plans.all()) {
      await expect(plan.locator('h3')).toBeVisible();
      await expect(plan.locator('ul li')).not.toHaveCount(0);
      await expect(plan.getByRole('button', { name: 'Start Free 7-Day Trial' })).toBeVisible();
    }
  }
});
