import { expect, test } from '@playwright/test';

test('root route exposes accessible navigation and anchor links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { name: /speak english with natural confidence/i })).toBeVisible();
  await page.getByRole('link', { name: 'Interactive Demo' }).click();
  await expect(page).toHaveURL(/#live-coach$/);
  await expect(page.locator('#live-coach')).toBeInViewport();
});
