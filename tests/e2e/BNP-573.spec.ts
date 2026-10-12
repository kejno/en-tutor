import { expect, test } from '@playwright/test';

test('BNP-573: landing and footer links use valid anchors or non-navigation placeholders', async ({ page }) => {
  await page.goto('/');

  const expectedAnchors = ['#methodology', '#paths', '#live-coach', '#results', '#pricing', '#final-cta', '#top'];
  const anchorHrefs = await page.locator('header a[href], main a[href], footer a[href]').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href')).filter((href): href is string => href !== null),
  );

  for (const href of anchorHrefs) {
    expect(href).toMatch(/^#/);
    expect(expectedAnchors).toContain(href);
    await expect(page.locator(href)).toHaveCount(1);
  }

  expect(await page.locator('.footer-link-disabled').evaluateAll((links) => links.every((link) => !link.hasAttribute('href')))).toBe(true);
});
