import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 960 }, reducedMotion: 'reduce' });

test('переходы к статичной демонстрации из первого экрана и навигации', async ({ page }) => {
  await page.goto('/');
  const card = page.getByTestId('assessment-card');
  for (const name of ['Watch 2-Min Live Demo', 'Interactive Demo']) {
    await page.getByRole('link', { name, exact: name === 'Interactive Demo' }).first().click();
    await expect(page).toHaveURL(/#live-coach$/);
    await expect(card).toBeInViewport();
    await expect(card.getByText('Статичная демонстрация')).toBeVisible();
    await expect(card.getByRole('textbox')).toBeDisabled();
    await expect(card.getByRole('button')).toBeDisabled();
    await expect(card.getByTestId('conversation-message')).toHaveCount(2);
    await expect(card.getByRole('progressbar')).toHaveCount(3);
    await page.getByRole('banner').locator('.brand').click();
  }
  await expect(card.getByRole('progressbar').nth(0)).toHaveAttribute('aria-valuenow', '92');
  await expect(card.getByRole('progressbar').nth(1)).toHaveAttribute('aria-valuenow', '88');
  await expect(card.getByRole('progressbar').nth(2)).toHaveAttribute('aria-valuenow', '80');
});

test('оформление карточки при 1280 px соответствует проверенной композиции эталона', async ({ page }) => {
  await page.goto('/');
  const card = page.getByTestId('assessment-card');
  await card.locator('img').evaluate(async (image: HTMLImageElement) => image.decode());
  await page.evaluate(() => document.fonts.ready);
  // Reference composition at 1280px: centered 896px card, 70px header,
  // approximately 440px total height, conversation/score split 58%/42%.
  const bounds = await card.boundingBox();
  expect(bounds?.x).toBe(192);
  expect(bounds?.width).toBe(896);
  expect(bounds?.height).toBeGreaterThan(430);
  expect(bounds?.height).toBeLessThan(455);
  const conversation = await card.locator('.conversation-panel').boundingBox();
  const score = await card.locator('.score-panel').boundingBox();
  expect(conversation!.width / score!.width).toBeCloseTo(1.4, 1);
  expect(conversation!.y).toBe(score!.y);
  await expect(card).toHaveScreenshot('emma-assessment-1280.png', {
    animations: 'disabled', maxDiffPixelRatio: 0.001,
  });
});
