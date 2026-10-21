import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 960 }, reducedMotion: 'reduce' });

test('ET-46: действия hero и вертикальное расположение Emma', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('.hero');
  const coach = page.getByRole('region', { name: 'Live Coach' });
  const copy = await page.locator('.hero-copy').boundingBox();
  const card = await coach.boundingBox();
  expect(copy).not.toBeNull();
  expect(card).not.toBeNull();
  expect(card!.y).toBeGreaterThan(copy!.y + copy!.height);
  expect(card!.width).toBe(896);
  expect(Math.round((await hero.boundingBox())!.height)).toBe(960);

  await hero.getByRole('button', { name: 'Start trial from hero' }).click();
  await expect(hero.getByRole('status')).toBeVisible();
  await expect(hero.getByRole('status')).toHaveText('Демонстрационный режим активирован. Регистрация аккаунта не требуется.');
  await hero.getByRole('link', { name: /Watch 2-Min Live Demo/ }).click();
  await expect(page).toHaveURL(/#live-coach$/);
  await expect(coach).toBeInViewport();
  await expect.poll(async () => (await coach.boundingBox())!.y).toBeGreaterThanOrEqual(65);
});

test('ET-46: hero соответствует crop приложенного эталона', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  // The committed image is the first 959.875 design pixels of reference-2-3.png,
  // scaled from 935px to 1280px with Chromium canvas. It is never an app capture.
  // Strict provisional tolerance: do not increase it to hide design differences.
  await expect(page.locator('.hero')).toHaveScreenshot('hero-reference.png', {
    animations: 'disabled',
    caret: 'hide',
    scale: 'css',
    threshold: 0.1,
    maxDiffPixelRatio: 0.001,
    style: '.site-header { visibility: hidden; } html { scroll-behavior: auto; }',
  });
});
