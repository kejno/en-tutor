import { expect, test } from '@playwright/test';

test('BNP-582: корневой маршрут отображает лендинг FluentAI без ошибки маршрутизации', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Speak English with Natural Confidence/i })).toBeVisible();
  await expect(page.getByText('FluentAI', { exact: true }).first()).toBeVisible();
});
