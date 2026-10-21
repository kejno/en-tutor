import { expect, test } from '@playwright/test';

test('shows the trust, methodology, and personalized assessment sections', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.logo-strip')).toBeVisible();
  await expect(page.locator('#methodology')).toBeVisible();
  await expect(page.locator('#paths')).toBeVisible();
  await expect(page.locator('#methodology .feature-card')).toHaveCount(3);
  await expect(page.locator('#paths .split-card')).toBeVisible();
});

test('changes the displayed active topic without changing the demonstration card', async ({ page }) => {
  await page.goto('/');

  const topics = page.getByTestId('topic-tag');
  const cardTitle = page.locator('#paths .roleplay-panel h3');
  await expect(topics.nth(0)).toHaveAttribute('aria-pressed', 'true');
  await topics.nth(1).click();

  await expect(topics.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(cardTitle).toHaveText('Ace C-Suite Reviews and Executive Phrasing Without Stumbling');
});
