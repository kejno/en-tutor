import { expect, test } from '@playwright/test';

test('ET-35: отображает полосу доверия с текстом и организациями из макета', async ({ page }) => {
  await page.goto('/');

  const trustStrip = page.locator('.logo-strip');
  await expect(trustStrip).toContainText('TRUSTED BY AMBITIOUS PROFESSIONALS & GRADUATE STUDENTS FROM LEADING INSTITUTIONS WORLDWIDE');
  await expect(trustStrip.locator('b')).toHaveText(['Google', 'Spotify', 'McKinsey', 'Stanford', 'Uber', 'Revolut']);
});
