import { expect, test } from '@playwright/test';

test('ET-44: прокрутка открывает для просмотра и чтения все карточки и метрики', async ({ page }) => {
  await page.goto('/');

  const cards = page.locator('.four-grid > article');
  const metrics = page.locator('.stats > div');

  await expect(cards).toHaveCount(4);
  await expect(metrics).toHaveCount(4);

  for (const item of [cards, metrics]) {
    const count = await item.count();
    for (let index = 0; index < count; index += 1) {
      const element = item.nth(index);
      await element.scrollIntoViewIfNeeded();
      await expect(element).toBeVisible();
      await expect(element).not.toBeEmpty();
    }
  }
});
