import { expect, test } from '@playwright/test';

test('root route exposes accessible navigation and anchor links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { name: /speak english with natural confidence/i })).toBeVisible();
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Interactive Demo' }).click();
  await expect(page).toHaveURL(/#live-coach$/);
  await expect(page.locator('#live-coach')).toBeInViewport();
});

test('mobile navigation stays vertical without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.locator('summary[aria-label="Open navigation"]').click();
  await page.locator('details.mobile-navigation').evaluate((element) => element.setAttribute('open', ''));
  const mobileNavigation = page.locator('.mobile-navigation-links');
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation.getByRole('link', { name: 'Pricing' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
