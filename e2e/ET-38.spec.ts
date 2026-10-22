import { expect, test } from '@playwright/test';

const viewports = [
  { width: 1280, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];

const sectionSelectors = ['.logo-strip', '#methodology', '#paths'];

for (const viewport of viewports) {
  test(`ET-38: ширина ${viewport.width}px сохраняет порядок секций и доступность содержимого`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const dimensions = await page.evaluate(() => ({
      bodyScrollWidth: document.body.scrollWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
    expect(dimensions.documentScrollWidth).toBeLessThanOrEqual(dimensions.viewportWidth);

    const sectionTops = await Promise.all(sectionSelectors.map(async (selector) => {
      const box = await page.locator(selector).boundingBox();
      expect(box, `Секция ${selector} должна быть видима`).not.toBeNull();
      return box?.y ?? Number.POSITIVE_INFINITY;
    }));
    expect(sectionTops[0]).toBeLessThan(sectionTops[1]);
    expect(sectionTops[1]).toBeLessThan(sectionTops[2]);

    const expectedSectionPadding = viewport.width <= 767
      ? '16px'
      : `${Math.max(32, (viewport.width - 1152) / 2)}px`;
    const expectedPathsPadding = viewport.width <= 767
      ? '16px'
      : viewport.width === 1280 ? '64px' : '32px';
    await expect(page.locator('#methodology')).toHaveCSS('padding-left', expectedSectionPadding);
    await expect(page.locator('#methodology')).toHaveCSS('padding-right', expectedSectionPadding);
    await expect(page.locator('#paths')).toHaveCSS('padding-left', expectedPathsPadding);
    await expect(page.locator('#paths')).toHaveCSS('padding-right', expectedPathsPadding);
    await expect(page.locator('#paths .pill-row')).toHaveCSS('margin-bottom', '24px');

    const contentSelectors = [
      '#methodology .feature-card',
      '#paths .split-card',
      '#paths .topic-tag',
      '#paths .split-card h3',
      '#paths .split-card p',
      '#paths .split-card li',
    ];
    for (const selector of contentSelectors) {
      const overflow = await page.locator(selector).evaluateAll((elements, viewportWidth) => elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          right: rect.right,
          left: rect.left,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          viewportWidth,
        };
      }), viewport.width);

      expect(overflow.length, `${selector} должен содержать элементы`).toBeGreaterThan(0);
      for (const element of overflow) {
        expect(element.left, `${selector} выходит за левую границу`).toBeGreaterThanOrEqual(0);
        expect(element.right, `${selector} выходит за правую границу`).toBeLessThanOrEqual(element.viewportWidth);
        expect(element.scrollWidth, `${selector} содержит горизонтальное переполнение текста`).toBeLessThanOrEqual(element.clientWidth);
      }
    }

    if (viewport.width === 390) {
      const cardTops = await page.locator('#methodology .feature-card').evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().top));
      expect(cardTops[0]).toBeLessThan(cardTops[1]);
      expect(cardTops[1]).toBeLessThan(cardTops[2]);

      const pathPanelTops = await page.locator('#paths .split-card > *').evaluateAll((panels) => panels.map((panel) => panel.getBoundingClientRect().top));
      expect(pathPanelTops[0]).toBeLessThan(pathPanelTops[1]);
    }
  });
}
