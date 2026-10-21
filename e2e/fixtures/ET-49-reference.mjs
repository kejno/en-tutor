// Rebuild only from the supplied design: node e2e/fixtures/ET-49-reference.mjs [source.png]
// The 935px full-page attachment contains the 1280x544 section at y=792.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const source = readFileSync(process.argv[2] ?? '.dmtools/input/ET-49/reference-2-3.png');
if (createHash('sha256').update(source).digest('hex') !== '01c01dd642d4bcd3d3e18e64e1b28efd7248f3e6405780ddd37b201264232321') {
  throw new Error('Expected the original ET-49 design attachment');
}
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(`<img src="data:image/png;base64,${source.toString('base64')}">`);
  const png = await page.locator('img').evaluate(async (image) => {
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 544;
    canvas.getContext('2d').drawImage(image, 0, 792, 935, 397.375, 0, 0, 1280, 544);
    const section = canvas.toDataURL().split(',')[1];
    const heading = document.createElement('canvas');
    heading.width = 680;
    heading.height = 124;
    heading.getContext('2d').drawImage(canvas, 300, 64, 680, 124, 0, 0, 680, 124);
    return { section, heading: heading.toDataURL().split(',')[1] };
  });
  writeFileSync(new URL('../ET-49.spec.ts-snapshots/methodology-reference-chromium-linux.png', import.meta.url), Buffer.from(png.section, 'base64'));
  writeFileSync(new URL('../ET-49.spec.ts-snapshots/methodology-heading-reference-chromium-linux.png', import.meta.url), Buffer.from(png.heading, 'base64'));
} finally {
  await browser.close();
}
