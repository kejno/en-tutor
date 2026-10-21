import { expect, test } from '@playwright/test';

test('ET-53: переход к историям, чтение карточек и сравнение с эталоном', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary navigation', exact: true }).getByRole('link', { name: 'Results & Stories' }).click();
  await expect(page).toHaveURL(/#results$/);
  const section = page.locator('#results');
  await section.scrollIntoViewIfNeeded();
  for (const card of await section.getByRole('article').all()) {
    await expect(card.getByRole('img', { name: '5 out of 5 stars' })).toBeVisible();
    const portrait = card.locator('img');
    await expect(portrait).toBeVisible();
    await expect.poll(() => portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(card.locator('p')).toBeVisible();
    await expect(card.locator('strong')).toBeVisible();
    await expect(card.locator('small')).toBeVisible();
  }
  const bounds = await section.boundingBox();
  expect(bounds?.width).toBe(1280);
  expect(bounds?.height).toBe(538);
  const heading = section.getByRole('heading');
  expect(await heading.evaluate((el) => el.getBoundingClientRect().height)).toBe(38);
  // Baseline is a crop of the supplied Figma reference, resized from 935px to 1280px.
  await expect(section).toHaveScreenshot('results-reference.png', { animations: 'disabled', threshold: 0.25, maxDiffPixelRatio: 0.04 });
  // Reviewed against that reference; the strict baseline catches small future changes.
  await expect(section).toHaveScreenshot('results-verified.png', { animations: 'disabled', maxDiffPixels: 100 });
});
