import { expect, test } from '@playwright/test';

test('ET-42: полоса ключевых метрик показывает утверждённые значения', async ({ page }) => {
  await page.goto('/');

  const metrics = page.locator('.stats > div');

  await expect(metrics).toHaveCount(4);
  await expect(metrics.nth(0)).toHaveText(/FLUENCY GAINS3\.4x/);
  await expect(metrics.nth(1)).toHaveText(/INTERVIEW SUCCESS87%/);
  await expect(metrics.nth(2)).toHaveText(/IELTS BAND JUMP\+1\.5/);
  await expect(metrics.nth(3)).toHaveText(/MINUTES PRACTICED12\.4M/);
});
