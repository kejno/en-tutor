import { expect, test } from '@playwright/test';

// Chromium on Linux (package-lock.json), Arial resolved to Liberation Sans.
// Baseline reviewed against reference-2-3.png: crop (0, 700, 935, 792),
// normalized to 1280 × 125. reference-strip.png preserves that independent target.
// Reference centers: 149, 346, 541, 737, 933, 1129; caption y≈36, names y≈78.
test.use({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, locale: 'en-US', colorScheme: 'light' });

test('ET-48: полоса после первого экрана соответствует проверенному эталону', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const strip = page.locator('.logo-strip');
  await strip.scrollIntoViewIfNeeded();
  await expect(strip).toBeInViewport();
  const geometry = await strip.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      width: rect.width, height: rect.height, x: rect.x,
      afterHero: rect.top === element.previousElementSibling!.getBoundingClientRect().bottom,
      beforeMethodology: rect.bottom === element.nextElementSibling!.getBoundingClientRect().top,
      background: style.backgroundColor, top: style.borderTop, bottom: style.borderBottom,
      names: Array.from(element.querySelectorAll('b'), item => {
        const box = item.getBoundingClientRect();
        const css = getComputedStyle(item);
        return { text: item.textContent, x: box.x, y: box.y - rect.y, size: css.fontSize, color: css.color };
      }),
    };
  });
  expect(geometry).toMatchObject({ width: 1280, height: 125, x: 0, afterHero: true, beforeMethodology: true,
    background: 'rgb(250, 250, 250)', top: '1px solid rgb(238, 238, 238)', bottom: '1px solid rgb(238, 238, 238)' });
  expect(geometry.names.map(item => item.text)).toEqual(['Google', 'Spotify', 'McKinsey', 'Stanford', 'Uber', 'Revolut']);
  for (const [index, item] of geometry.names.entries()) {
    expect(item.x).toBe(52 + 196 * index);
    expect(item.y).toBe(72);
    expect(item.size).toBe('14px');
    expect(item.color).toBe('rgb(119, 119, 119)');
  }
  await expect(strip.locator('p')).toHaveText('TRUSTED BY AMBITIOUS PROFESSIONALS & GRADUATE STUDENTS FROM LEADING INSTITUTIONS WORLDWIDE');
  await expect(strip.locator('p')).toHaveCSS('font-size', '12px');
  await expect(strip.locator('p')).toHaveCSS('color', 'rgb(153, 153, 153)');
  await expect(strip.locator('p')).toHaveCSS('letter-spacing', '0.6px');
  expect(await strip.locator('p').evaluate(element => element.getBoundingClientRect().top - element.parentElement!.getBoundingClientRect().top)).toBe(34);
  for (const name of await strip.locator('b').all()) {
    await expect(name).toHaveCSS('font-weight', '700');
    await expect(name).toHaveCSS('line-height', '21px');
  }
  await expect(strip.locator('a, button, input')).toHaveCount(0);
  await expect(strip).toHaveScreenshot('trust-strip.png', { animations: 'disabled', maxDiffPixels: 200 });
});
