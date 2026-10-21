import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 833 }, reducedMotion: 'reduce' });

test('ET-51: посетитель читает четыре полных демонстрационных карточки', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('.capabilities');
  await section.scrollIntoViewIfNeeded();
  const cards = section.locator('article');
  await expect(cards).toHaveCount(4);
  for (const card of await cards.all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByRole('heading', { level: 3 })).toBeVisible();
    await expect(card.locator('p')).toBeVisible();
  }
  await expect(section.getByRole('img', { name: 'Claire D.' })).toBeVisible();
  await expect(section.getByText(/I speak 20 mins every morning before work/)).toBeVisible();
  await expect(section.getByText('Claire D. • Paris, France')).toBeVisible();
  await expect(section.getByText('Sound: "Thorough"')).toBeVisible();
  await expect(section.getByText('Match: 95%')).toBeVisible();
  for (const tag of ['Coffee Shop', 'VC Seed Pitch', 'Emergency Room', '+ Custom Prompt']) {
    await expect(section.getByText(tag, { exact: true })).toBeVisible();
  }
  await expect(section.getByText('Active Memory Cache: 30 words reinforced this week')).toBeVisible();
  await expect(section.getByText('Auto-synced')).toBeVisible();
  await expect(section.getByRole('button')).toHaveCount(0);
});

for (const reference of [
  { name: 'вложение reference-2-3.png', snapshot: 'capabilities-reference.png' },
  { name: 'исходная нода Figma 2:164', snapshot: 'capabilities-figma-source.png' },
]) {
  test(`ET-51: визуальное сравнение — ${reference.name}`, async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator('.capabilities');
  await expect(section).toHaveCSS('height', '833px');
  // Source: reference-2-3.png (935x4096); Figma root 2:3 is 1280x5612.
  // Node 2:164: y=2300.8798828125, h=833; export scale=4096/5612.
  // Fractional source crop: (0,1679.33)-(934.25,2287.31).
  // The baseline is a Lanczos resize of that supplied crop, never an app capture.
  await page.addStyleTag({ content: '.site-header { visibility: hidden !important; }' });
  const top = await section.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
  const screenshot = await page.screenshot({
    fullPage: true,
    clip: { x: 0, y: Math.round(top), width: 1280, height: 833 },
    animations: 'disabled',
    caret: 'hide',
  });
  expect(screenshot).toMatchSnapshot(reference.snapshot, { threshold: 0.2, maxDiffPixelRatio: 0.01 });
});
}
