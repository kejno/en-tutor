import { expect, test } from '@playwright/test';

const viewports = [
  { width: 1280, height: 900, cardsColumns: '2', metricsColumns: '4' },
  { width: 768, height: 900, cardsColumns: '1', metricsColumns: '2' },
  { width: 390, height: 844, cardsColumns: '1', metricsColumns: '2' },
];

for (const viewport of viewports) {
  test(`ET-43: ширина ${viewport.width}px перестраивает карточки и метрики без переполнения`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');

    const layout = await page.evaluate(() => ({
      bodyScrollWidth: document.body.scrollWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      metricsColumns: getComputedStyle(document.querySelector('.stats') as Element).gridTemplateColumns,
    }));

    expect(layout.bodyScrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    const cards = await page.locator('.four-grid > article').all();
    const bounds = await Promise.all(cards.map(card => card.boundingBox()));
    const [first, second, third, fourth] = bounds;
    expect(bounds.every(Boolean)).toBe(true);
    if (viewport.cardsColumns === '2') {
      expect(first!.y).toBe(second!.y);
      expect(third!.y).toBe(fourth!.y);
      expect(second!.x).toBeGreaterThanOrEqual(first!.x + first!.width);
      expect(third!.y).toBeGreaterThanOrEqual(first!.y + first!.height);
      expect(fourth!.x).toBeGreaterThanOrEqual(third!.x + third!.width);
    } else {
      for (let index = 1; index < bounds.length; index++) {
        expect(bounds[index]!.x).toBe(first!.x);
        expect(bounds[index]!.y).toBeGreaterThanOrEqual(bounds[index - 1]!.y + bounds[index - 1]!.height);
      }
    }
    expect(layout.metricsColumns.split(' ').length).toBe(Number(viewport.metricsColumns));
    await expect(page.locator('.four-grid')).toBeVisible();
    await expect(page.locator('.stats')).toBeVisible();
  });
}
