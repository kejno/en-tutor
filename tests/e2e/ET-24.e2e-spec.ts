import { expect, test } from '@playwright/test';

test('ET-24: первый экран на мобильной ширине не выходит за границы, CTA доступен', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Speak English with Natural Confidence/i })).toBeVisible();
  await expect(page.getByTestId('trial-cta')).toBeVisible();
  await expect(page.getByTestId('header-trial')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);

  await page.getByTestId('trial-cta').click();
  await expect(page.getByRole('status')).toContainText('Пробный период скоро будет доступен');
});
