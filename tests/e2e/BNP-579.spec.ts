import { expect, test } from '@playwright/test';

test('BNP-579: корневая страница доступна на мобильной ширине', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Speak English with Natural Confidence/i })).toBeVisible();
  await expect(page.getByTestId('trial-cta')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
