import { expect, test } from '@playwright/test';

test('ET-42: полоса ключевых метрик показывает утверждённые значения', async ({ page }) => {
  await page.goto('/');

  const metrics = page.locator('.stats > div');

  await expect(metrics).toHaveCount(4);
  await expect(metrics.nth(0)).toHaveText(/3\.4xFLUENCY GAINS/);
  await expect(metrics.nth(1)).toHaveText(/87%INTERVIEW SUCCESS/);
  await expect(metrics.nth(2)).toHaveText(/\+1\.5IELTS BAND JUMP/);
  await expect(metrics.nth(3)).toHaveText(/12\.4MMINUTES PRACTICED/);
});
