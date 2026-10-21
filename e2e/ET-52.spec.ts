import { expect, test } from '@playwright/test';

test('ET-52: посетитель читает четыре карточки доказательств обучения', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await page.getByRole('heading', { name: 'Everything You Need for Verbal Mastery' }).scrollIntoViewIfNeeded();
  const section = page.getByRole('region', { name: 'Learning metrics' });
  await section.scrollIntoViewIfNeeded();
  await expect(section).toBeVisible();
  const cards = section.locator(':scope > div');
  await expect(cards).toHaveCount(4);
  const expected = [
    ['FLUENCY GAINS', '3.4x', 'Faster than traditional flashcard apps', 'rgb(22, 119, 255)'],
    ['INTERVIEW SUCCESS', '87%', 'Passed within 60 days of 15-min practice', 'rgb(56, 158, 13)'],
    ['IELTS BAND JUMP', '+1.5', 'Documented across 12,000+ test-takers', 'rgb(207, 19, 34)'],
    ['MINUTES PRACTICED', '12.4M', 'Zero embarrassment. 100% private.', 'rgb(38, 38, 38)'],
  ];
  for (const [index, [label, value, description, color]] of expected.entries()) {
    const card = cards.nth(index);
    await expect(card).toBeVisible();
    await expect(card.locator(':scope > *')).toHaveText([label, value, description]);
    await expect(card).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(card).toHaveCSS('border-radius', '8px');
    await expect(card.locator('b')).toHaveCSS('color', color);
    await expect(card.locator('b')).toHaveCSS('font-size', '36px');
  }
  const bounds = await section.boundingBox();
  expect(bounds?.height).toBe(247);
  if (!bounds) throw new Error('Metrics section is missing');
  // Baseline: supplied reference-2-3.png (935 x 4096), resized with Lanczos
  // to 1280 x 5607 and cropped at (0, 3131, 1280, 3378).
  // Source SHA-256: 01c01dd642d4bcd3d3e18e64e1b28efd7248f3e6405780ddd37b201264232321.
  // Never regenerate this baseline from the app.
  // The reference is a downscaled full-page export; allow its resampling artifacts.
  await expect(page).toHaveScreenshot('learning-metrics.png', {
    clip: { x: 0, y: Math.round(bounds.y), width: 1280, height: 247 },
    animations: 'disabled',
    threshold: 0.2,
    maxDiffPixelRatio: 0.025,
  });
  await page.locator('#results').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Real Transformations, Real Careers' })).toBeVisible();
});
