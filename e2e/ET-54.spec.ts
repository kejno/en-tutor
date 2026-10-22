import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });

test('ET-54: тарифы соответствуют эталону и выбор доступен с клавиатуры', async ({ page }) => {
  await page.goto('/');
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  const pricing = page.locator('#pricing');
  await pricing.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const box = await pricing.boundingBox();
  expect(box?.width).toBe(1280);
  expect(box?.height).toBe(758);
  await expect(pricing.locator('.price-value')).toHaveText(['$14', '$24', '$49']);
  // Source: input/ET-54/reference-2-3.png, crop (0, 2860, 935, 554), scaled to 1280 × 758.
  // The supplied raster is downscaled; allow rasterization differences in this source comparison.
  const sectionImage = await page.screenshot({ animations: 'disabled', clip: { x: 0, y: Math.round(box!.y), width: 1280, height: 758 } });
  expect(sectionImage).toMatchSnapshot('pricing-figma.png', { threshold: 0.25, maxDiffPixelRatio: 0.08 });
  expect(sectionImage).toMatchSnapshot('pricing-reviewed.png', { maxDiffPixelRatio: 0.001 });

  const annual = pricing.getByRole('button', { name: /Billed Annually/ });
  await annual.focus();
  await annual.press('Space');
  await expect(annual).toHaveAttribute('aria-pressed', 'true');
  await expect(pricing.locator('.price-value')).toHaveText(['$8.40', '$14.40', '$29.40']);
  await expect(pricing.locator('[data-billing]')).toHaveText(['$100.80 списывается ежегодно', '$172.80 списывается ежегодно', '$352.80 списывается ежегодно']);
  for (const plan of await pricing.locator('.plan').all()) {
    const cta = plan.getByRole('button', { name: 'Start Free 7-Day Trial' });
    await cta.focus();
    await cta.press('Enter');
    await expect(pricing.getByRole('status')).toContainText(await plan.locator('h3').innerText());
    await expect(pricing.getByRole('status')).toContainText('Подписка не оформлена, списаний нет.');
  }
  const monthly = pricing.getByRole('button', { name: 'Billed Monthly' });
  await monthly.focus();
  await monthly.press('Enter');
  await expect(monthly).toHaveAttribute('aria-pressed', 'true');
  await expect(pricing.locator('.price-value')).toHaveText(['$14', '$24', '$49']);
});
