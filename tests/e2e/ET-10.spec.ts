import { expect, test } from '@playwright/test';

test('shows the trust, methodology, and personalized assessment sections', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.logo-strip')).toBeVisible();
  await expect(page.locator('#methodology')).toBeVisible();
  await expect(page.locator('#paths')).toBeVisible();
  await expect(page.locator('#methodology .feature-card')).toHaveCount(3);
  await expect(page.locator('#paths .split-card')).toBeVisible();
});

test('changes the displayed active topic and demonstration card together', async ({ page }) => {
  await page.goto('/');

  const topics = page.getByTestId('topic-tag');
  const cardTitle = page.locator('#paths .roleplay-panel h3');
  await expect(topics.nth(0)).toHaveAttribute('aria-pressed', 'true');
  await topics.nth(1).click();

  await expect(topics.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(cardTitle).toContainText('🎓 IELTS & Academic Prep');
  await expect(cardTitle).toContainText('Build Confident IELTS Answers and Academic Arguments');
  await expect(page.locator('#paths .roleplay-panel')).toContainText('Structured Response Framework');
  await expect(page.locator('#paths .roleplay-panel')).not.toContainText('C-Suite Phrasing Vault');
});

test('uses 16px horizontal section padding at the mobile breakpoint boundary', async ({ page }) => {
  await page.setViewportSize({ width: 767, height: 900 });
  await page.goto('/');

  await expect(page.locator('#paths')).toHaveCSS('padding-left', '16px');
  await expect(page.locator('#paths')).toHaveCSS('padding-right', '16px');
});
