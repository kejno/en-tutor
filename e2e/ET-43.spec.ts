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
      cardsColumns: getComputedStyle(document.querySelector('.four-grid') as Element).gridTemplateColumns,
      metricsColumns: getComputedStyle(document.querySelector('.stats') as Element).gridTemplateColumns,
    }));

    expect(layout.bodyScrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.cardsColumns.split(' ').length).toBe(Number(viewport.cardsColumns));
    expect(layout.metricsColumns.split(' ').length).toBe(Number(viewport.metricsColumns));
    await expect(page.locator('.four-grid')).toBeVisible();
    await expect(page.locator('.stats')).toBeVisible();
  });
}
