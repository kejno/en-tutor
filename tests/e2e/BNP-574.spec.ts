import { expect, test } from '@playwright/test';

test('BNP-574: visitor can open FAQ, reach final CTA, and receive local email confirmation', async ({ page }) => {
  await page.goto('/');

  const faqQuestion = page.getByRole('button', { name: 'How does the 7-day free trial work?' });
  await faqQuestion.scrollIntoViewIfNeeded();
  await faqQuestion.click();
  await expect(faqQuestion).toHaveAttribute('aria-expanded', 'true');
  const answerId = await faqQuestion.getAttribute('aria-controls');
  expect(answerId).toBeTruthy();
  const faqAnswer = page.locator(`[id="${answerId}"]`);
  await expect(faqAnswer).toBeVisible();
  await expect(faqAnswer).toHaveAttribute('aria-labelledby', await faqQuestion.getAttribute('id') ?? '');
  await faqQuestion.click();
  await expect(faqQuestion).toHaveAttribute('aria-expanded', 'false');
  await expect(faqAnswer).toBeHidden();

  const email = page.locator('#cta-email');
  await email.scrollIntoViewIfNeeded();
  await email.fill('learner@example.com');
  await page.getByRole('button', { name: 'Claim 7 Days Free' }).click();

  await expect(page.locator('.final-cta')).toBeInViewport();
  await expect(page.locator('.final-cta')).toContainText('Данные не отправляются на сервер');
});
