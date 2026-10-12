import { expect, test } from '@playwright/test';

test('switches billing period and keeps trial buttons keyboard accessible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-plan="starter"] .price-value')).toHaveText('$8.40');
  await page.getByText('Billed Monthly').click();
  await expect(page.locator('[data-plan="starter"] .price-value')).toHaveText('$14.00');
  await expect(page.locator('[data-plan="starter"] [data-billing="starter"]')).toHaveText('в месяц');
  await expect(page.locator('.cta')).toHaveCount(3);
  for (const button of await page.locator('.cta').all()) {
    await expect(button).toBeEnabled();
  }
});
