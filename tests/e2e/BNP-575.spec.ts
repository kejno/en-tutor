import { expect, test } from '@playwright/test';

test('BNP-575: секция отзывов содержит три карточки из макета', async ({ page }) => {
  await page.goto('/');

  const results = page.locator('#results');
  await expect(results.getByRole('heading', { name: 'Real Transformations, Real Careers' })).toBeVisible();

  const testimonials = results.locator('.testimonials article');
  await expect(testimonials).toHaveCount(3);
  await expect(testimonials.nth(0)).toContainText('CEFR: B1 ➔ C1 Level');
  await expect(testimonials.nth(0)).toContainText('★★★★★');
  await expect(testimonials.nth(0)).toContainText('“FluentAI cured my imposter syndrome before standups. I went from hesitant one-word answers to leading multi-team architecture sprint reviews at our Berlin office with zero anxiety.”');
  await expect(testimonials.nth(0)).toContainText('Marco S.');
  await expect(testimonials.nth(0)).toContainText('Senior Tech Lead · Berlin Hub');
  await expect(testimonials.nth(1)).toContainText('IELTS 6.5 ➔ Band 8.5');
  await expect(testimonials.nth(1)).toContainText('★★★★★');
  await expect(testimonials.nth(1)).toContainText('“The IELTS examiner simulator gave me exact Band 8.0 predictions before my official exam. Scored an overall 8.5 last weekend! The instant feedback on transition words made all the difference.”');
  await expect(testimonials.nth(1)).toContainText('Aiko T.');
  await expect(testimonials.nth(1)).toContainText('Medical Researcher · Tokyo');
  await expect(testimonials.nth(2)).toContainText('Promoted to VP');
  await expect(testimonials.nth(2)).toContainText('★★★★★');
  await expect(testimonials.nth(2)).toContainText('“Like having an Oxford linguistics professor in your pocket available at 11 PM after work. It caught every recurring habit I had with irregular verbs within just 3 days.”');
  await expect(testimonials.nth(2)).toContainText('Carlos M.');
  await expect(testimonials.nth(2)).toContainText('Marketing Director · Madrid');

  for (const testimonial of await testimonials.all()) {
    await expect(testimonial.locator('p')).toBeVisible();
    await expect(testimonial.locator('strong')).toBeVisible();
    await expect(testimonial.locator('small')).toBeVisible();
  }
});
