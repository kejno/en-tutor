import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 390, height: 844 }, { width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
  test(`ET-38: ширина ${viewport.width}px сохраняет порядок секций без горизонтального скролла`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const dimensions = await page.evaluate(() => ({
      bodyScrollWidth: document.body.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(dimensions.viewportWidth);

    const sectionTops = await page.locator('.logo-strip, #methodology, #paths').evaluateAll((sections) => sections.map((section) => section.getBoundingClientRect().top));
    expect(sectionTops).toEqual([...sectionTops].sort((a, b) => a - b));
  });
}
