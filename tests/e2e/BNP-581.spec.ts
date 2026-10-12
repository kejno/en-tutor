import { expect, test } from '@playwright/test';

test('BNP-581: действие первого экрана выполняется без ошибки', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('trial-cta').click();
  await expect(page.getByRole('status')).toContainText('Пробный период скоро будет доступен');

  await page.getByRole('link', { name: 'Watch 2-Min Live Demo' }).click();
  await expect(page).toHaveURL(/#live-coach$/);
  await expect(page.getByTestId('assessment-card')).toBeVisible();
});
