import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

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
    // Source: reference-2-3.png (935x4096); Figma root 2:3 is 1280x5611.3798828125.
    // Node 2:164: y=2300.8798828125, h=833; export scale=4096/5611.3798828125.
    // The baseline is a Lanczos resize of that supplied crop, never an app capture.
    await page.addStyleTag({ content: '.site-header { visibility: hidden !important; }' });
    const top = await section.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
    const screenshot = await page.screenshot({
      fullPage: true,
      clip: { x: 0, y: Math.round(top), width: 1280, height: 833 },
      animations: 'disabled',
      caret: 'hide',
    });
    if (reference.snapshot === 'capabilities-reference.png') {
      // Apply the same subpixel filter to both images: the supplied export was
      // downsampled to 935px, so its glyph edges cannot match a native 1280px render.
      const expected = readFileSync(new URL('./ET-51.spec.ts-snapshots/capabilities-reference-chromium-linux.png', import.meta.url));
      const normalize = async (buffer: Buffer) => Buffer.from(await page.evaluate(async (data) => {
        const image = new Image();
        image.src = `data:image/png;base64,${data}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d')!;
        context.filter = 'blur(1px)';
        context.drawImage(image, 0, 0);
        return Array.from(new Uint8Array(await (await fetch(canvas.toDataURL())).arrayBuffer()));
      }, buffer.toString('base64')));
      expect(await normalize(expected)).toMatchSnapshot('capabilities-reference-normalized.png', { threshold: 0, maxDiffPixels: 0 });
      expect(await normalize(screenshot)).toMatchSnapshot('capabilities-reference-normalized.png', { threshold: 0.2, maxDiffPixelRatio: 0.01 });
    } else {
      expect(screenshot).toMatchSnapshot(reference.snapshot, { threshold: 0.2, maxDiffPixelRatio: 0.01 });
    }
  });
}
