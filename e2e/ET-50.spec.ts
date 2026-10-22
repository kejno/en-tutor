import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.use({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });

test('ET-50: переключение направлений обновляет карточку и поддерживает клавиатуру', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#paths');
  const topics = section.getByRole('button');
  await topics.first().focus();
  const cases = [
    ['Build Confident IELTS Answers and Academic Arguments', 'Substantiate a claim', '74', 'IELTS Speaking Feedback'],
    ['Keep Natural Conversations Moving with Ease', 'That makes sense', '82', 'Conversation Confidence Drills'],
    ['Handle Travel and Relocation Conversations Smoothly', 'Could you clarify?', '80', 'Relocation Roleplay Drills'],
  ];
  for (const [title, term, readiness, benefit] of cases) {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(section.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(section.getByText(term, { exact: true })).toBeVisible();
    await expect(section.getByText(benefit, { exact: true })).toBeVisible();
    await expect(section.getByRole('progressbar')).toHaveAttribute('aria-valuenow', readiness);
    await expect(section.locator('[aria-pressed="true"]')).toHaveCount(1);
    await expect(section.locator('.roleplay-scenario')).not.toBeEmpty();
  }
  await topics.first().click();
  await expect(section.getByRole('heading', { name: 'Ace C-Suite Reviews and Executive Phrasing Without Stumbling', exact: true })).toBeVisible();
  await expect(section.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '78');
});

test('ET-50: desktop-секция соответствует исходному макету и проверенному снимку', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator('#paths');
  await expect(section).toHaveCSS('height', '673px');
  await expect(section.locator('.split-card')).toHaveCSS('width', '1152px');
  const actual = await section.screenshot({ animations: 'disabled' });
  const reference = await readFile(new URL('./fixtures/ET-50-reference.png', import.meta.url));
  // Compare low-resolution color/layout against the supplied design, whose full-page
  // export is 935px wide. Text rasterization differs from a native browser capture.
  const error = await page.evaluate(async ({ actualUrl, referenceUrl }) => {
    const pixels = [];
    for (const [index, url] of [referenceUrl, actualUrl].entries()) {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 67;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable');
      if (index === 0) context.drawImage(image, 0, 1188, 935, 491, 0, 0, 128, 67);
      else context.drawImage(image, 0, 0, 128, 67);
      pixels.push(context.getImageData(0, 0, 128, 67).data);
    }
    return pixels[1].reduce((sum, value, index) => sum + (index % 4 === 3 ? 0 : Math.abs(value - pixels[0][index])), 0) / (128 * 67 * 3);
  }, { actualUrl: `data:image/png;base64,${actual.toString('base64')}`, referenceUrl: `data:image/png;base64,${reference.toString('base64')}` });
  expect(error).toBeLessThan(4);
  // Round the crop origin so preceding sections cannot add a screenshot row.
  const bounds = await section.boundingBox();
  const scrollY = await page.evaluate(() => window.scrollY);
  const image = await page.screenshot({
    animations: 'disabled', fullPage: true,
    clip: { x: Math.round(bounds!.x), y: Math.round(bounds!.y + scrollY), width: bounds!.width, height: bounds!.height },
  });
  expect(image).toMatchSnapshot('learning-paths.png', { maxDiffPixelRatio: 0.005 });
});
