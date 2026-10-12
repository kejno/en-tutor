import { expect, test } from '@playwright/test';

test('BNP-573: ссылки лендинга и подвала используют существующие якоря', async ({ page }) => {
  await page.goto('/');

  const links = page.locator('a[href]');
  const destinations = await links.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')));
  const anchorDestinations = destinations.filter((href): href is string => Boolean(href?.startsWith('#')));

  expect(anchorDestinations).toEqual(expect.arrayContaining([
    '#top',
    '#methodology',
    '#paths',
    '#live-coach',
    '#results',
    '#pricing',
    '#final-cta',
  ]));

  for (const href of anchorDestinations) {
    await expect(page.locator(href)).toHaveCount(1);
  }

  const invalidRoutes = destinations.filter((href) => href && !href.startsWith('#'));
  expect(invalidRoutes).toEqual([]);
});
