import { expect, test } from '@playwright/test';

test('BNP-575: секция отзывов содержит три карточки из макета', async ({ page }) => {
  await page.goto('/');

  const results = page.locator('#results');
  await expect(results.getByRole('heading', { name: 'Real Transformations, Real Careers' })).toBeVisible();

  const testimonials = results.locator('.testimonials article');
  await expect(testimonials).toHaveCount(3);
  await expect(testimonials.nth(0)).toContainText('CEFR: B1 ➔ C1 Level');
  await expect(testimonials.nth(0)).toContainText('Marco S.');
  await expect(testimonials.nth(0)).toContainText('Senior Tech Lead · Berlin Hub');
  await expect(testimonials.nth(1)).toContainText('IELTS 6.5 ➔ Band 8.5');
  await expect(testimonials.nth(1)).toContainText('Aiko T.');
  await expect(testimonials.nth(1)).toContainText('Medical Researcher · Tokyo');
  await expect(testimonials.nth(2)).toContainText('Promoted to VP');
  await expect(testimonials.nth(2)).toContainText('Carlos M.');
  await expect(testimonials.nth(2)).toContainText('Marketing Director · Madrid');

  for (const testimonial of await testimonials.all()) {
    await expect(testimonial.locator('p')).toBeVisible();
    await expect(testimonial.locator('strong')).toBeVisible();
    await expect(testimonial.locator('small')).toBeVisible();
  }
});
