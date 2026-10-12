import { expect, test } from '@playwright/test';

test('BNP-574: visitor can open FAQ, reach final CTA, and receive local email confirmation', async ({ page }) => {
  await page.goto('/');

  const faqQuestion = page.getByRole('button', { name: 'How does the 7-day free trial work?' });
  await faqQuestion.scrollIntoViewIfNeeded();
  await faqQuestion.click();
  await expect(faqQuestion).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq-answer-trial')).toBeVisible();

  const email = page.locator('#cta-email');
  await email.scrollIntoViewIfNeeded();
  await email.fill('learner@example.com');
  await page.getByRole('button', { name: 'Получить 7 дней бесплатно' }).click();

  await expect(page.locator('.final-cta')).toBeInViewport();
  await expect(page.locator('.final-cta')).toContainText('Данные не отправляются на сервер');
});
