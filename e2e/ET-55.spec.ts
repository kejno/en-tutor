import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });

test('ET-55: четыре ответа доступны мышью и клавиатурой', async ({ page }) => {
  await page.goto('/');
  const faq = page.getByRole('region', { name: 'Frequently Asked Questions', exact: true });
  await faq.scrollIntoViewIfNeeded();
  const questions = faq.getByRole('button');
  await expect(questions).toHaveCount(4);
  for (let index = 0; index < 4; index++) {
    const question = questions.nth(index);
    await expect(question).toHaveAttribute('aria-expanded', 'false');
    await question.click();
    const panel = page.locator(`[id="${await question.getAttribute('aria-controls')}"]`);
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('aria-labelledby', await question.getAttribute('id') ?? '');
    await question.press('Enter');
    await expect(panel).toBeHidden();
    await question.press('Space');
    await expect(panel).toBeVisible();
    await question.click();
    await expect(panel).toBeHidden();
  }
  await questions.nth(0).click();
  await expect(faq).toContainText('Демо показывает, как FluentAI помогает практиковать английскую речь');
  await questions.nth(1).click();
  await expect(questions.nth(0)).toHaveAttribute('aria-expanded', 'false');
});

test('ET-55: закрытая секция соответствует эталону Figma при 1280 px', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const faq = page.locator('#faq');
  await faq.scrollIntoViewIfNeeded();
  await expect(faq).toHaveCSS('min-height', '452px');
  expect((await faq.boundingBox())?.height).toBe(452);
  const list = await faq.locator('.faq-list').boundingBox();
  expect(list?.width).toBe(720);
  expect(list?.x).toBe(280);
  // Baseline is the FAQ crop from the supplied reference-2-3.png, resized to 1280 × 452.
  // Allow rasterization differences from the downscaled reference, not layout changes.
  const bounds = await faq.boundingBox();
  expect(bounds).not.toBeNull();
  expect(await page.screenshot({ path: testInfo.outputPath('faq-1280.png'), animations: 'disabled', clip: { x: 0, y: Math.round(bounds!.y), width: 1280, height: 452 } })).toMatchSnapshot('faq-reference.png', {
    threshold: 0.25, maxDiffPixelRatio: 0.035,
  });
});
