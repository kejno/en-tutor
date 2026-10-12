import { expect, test } from '@playwright/test';

test('visitor sees the first screen and can use the trial CTA', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Speak English with Natural Confidence/i })).toBeVisible();
  await expect(page.getByTestId('assessment-card')).toBeVisible();
  await page.getByTestId('trial-cta').click();
  await expect(page.getByRole('status')).toContainText('coming soon');
});
