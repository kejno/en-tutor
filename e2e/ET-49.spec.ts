import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 900 } });

test('ET-49: переход к методике и сравнение трёх шагов с эталоном', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary navigation', exact: true }).getByRole('link', { name: 'Methodology' }).click();
  await expect(page).toHaveURL(/#methodology$/);
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(async () => Math.round((await page.locator('#methodology').boundingBox())?.y ?? -1)).toBe(65);
  const section = page.locator('#methodology');
  const box = await section.boundingBox();
  expect(box?.width).toBe(1280);
  expect(box?.height).toBe(544);
  const heading = await section.getByRole('heading', { level: 2 }).boundingBox();
  expect(heading!.y).toBeGreaterThanOrEqual(65);
  const cards = section.getByRole('article');
  await expect(cards).toHaveCount(3);
  for (let index = 0; index < 3; index++) {
    await expect(cards.nth(index)).toBeVisible();
    const cardBox = await cards.nth(index).boundingBox();
    expect(cardBox?.width).toBe(368);
    expect(cardBox?.height).toBe(248);
    expect(cardBox?.x).toBe(64 + 392 * index);
    await expect(cards.nth(index).locator('small')).toHaveCSS('border-top-width', '1px');
    await expect(cards.nth(index).locator('strong')).toBeVisible();
  }
  await expect(cards.nth(0).locator('.number')).toHaveCSS('color', 'rgb(22, 119, 255)');
  await expect(cards.nth(1).locator('.number')).toHaveCSS('color', 'rgb(0, 82, 204)');
  await expect(cards.nth(2).locator('.number')).toHaveCSS('color', 'rgb(56, 158, 13)');
  // The expected image is a crop of the supplied design, never a screenshot update.
  const image = await page.screenshot({ clip: { x: 0, y: Math.round(box!.y), width: 1280, height: 544 }, animations: 'disabled' });
  expect(image).toMatchSnapshot('methodology-reference.png', { threshold: 0.2, maxDiffPixelRatio: 0.025 });
  const headingImage = await page.screenshot({ clip: { x: 300, y: Math.round(box!.y) + 64, width: 680, height: 124 }, animations: 'disabled' });
  expect(headingImage).toMatchSnapshot('methodology-heading-reference.png', { threshold: 0.2, maxDiffPixelRatio: 0.055 });
  await page.reload();
  await expect.poll(async () => Math.round((await section.boundingBox())?.y ?? -1)).toBe(65);
});
