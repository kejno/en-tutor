import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 900 } });

test('ET-56: final offer follows the supplied reference', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#final-cta');
  await section.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  expect(await section.boundingBox()).toMatchObject({ width: 1280, height: 483 });
  await expect(section.getByText('No credit card required upfront • Setup takes 90 seconds')).toBeVisible();
  // Reference is the supplied design, not a screenshot of the implementation:
  // reference-2-3.png (935×4096), crop (0,3743)-(935,4096), resize to 1280×483.
  // The allowance accounts for resampling and font rasterization in the supplied image.
  await expect(section.locator('.final-cta-card')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(section.locator('.final-cta-card')).toHaveCSS('border-top-color', 'rgb(22, 119, 255)');
  const bounds = await section.boundingBox();
  const scrollY = await page.evaluate(() => window.scrollY);
  const sectionImage = await page.screenshot({
    animations: 'disabled', fullPage: true,
    clip: { x: 0, y: Math.round(bounds!.y + scrollY), width: 1280, height: 483 },
  });
  expect(sectionImage).toMatchSnapshot('final-cta-reference.png', { threshold: 0.2, maxDiffPixelRatio: 0.025 });
  // Keep a strict browser baseline as well, after checking against the supplied design.
  expect(sectionImage).toMatchSnapshot('final-cta-approved.png', { maxDiffPixelRatio: 0.001 });
});

test('ET-56: email correction and local confirmation require no navigation or API', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.dataset.documentMarker = 'same-document'; });
  const requests: string[] = [];
  page.on('request', request => {
    if (['fetch', 'xhr'].includes(request.resourceType()) || request.method() === 'POST') requests.push(request.url());
  });
  const section = page.locator('#final-cta');
  const email = section.getByRole('textbox', { name: 'Email address' });
  const submit = section.getByRole('button', { name: 'Claim 7 Days Free' });
  await email.scrollIntoViewIfNeeded();
  for (const value of ['', 'invalid', 'learner@example']) {
    await email.fill(value);
    await submit.click();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(section.locator('#cta-email-error')).toBeVisible();
    await expect(section.getByRole('status')).toHaveCount(0);
  }
  await email.fill('learner@example.com');
  await expect(email).toHaveAttribute('aria-invalid', 'false');
  await expect(section.locator('#cta-email-error')).toHaveCount(0);
  await email.press('Enter');
  await expect(section.getByRole('status')).toContainText('Данные не отправляются на сервер');
  await expect(section.getByRole('status')).not.toContainText('сохранена');
  await email.fill('another@example.com');
  await expect(section.getByRole('status')).toHaveCount(0);
  await submit.click();
  await expect(section.getByRole('status')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-document-marker', 'same-document');
  expect(requests).toEqual([]);
  await expect(page.locator('main > section').last()).toHaveAttribute('id', 'final-cta');
  await expect(page.locator('.site-footer #footer-email')).toBeAttached();
});
