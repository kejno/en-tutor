import { expect, test } from '@playwright/test';

test('visitor reaches the final CTA and sees a local confirmation', async ({ page }) => {
  await page.goto('/');
  const faq = page.locator('#faq');
  await faq.scrollIntoViewIfNeeded();

  const firstQuestion = faq.getByRole('button', { name: 'How does the 7-day free trial work?' });
  const firstAnswer = faq.locator('[id="faq-answer-trial"]');
  await expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
  await expect(firstAnswer).toBeHidden();
  await firstQuestion.click();
  await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
  await expect(firstAnswer).toBeVisible();

  await page.locator('#final-cta').scrollIntoViewIfNeeded();
  await page.locator('#cta-email').fill('learner@example.com');
  await page.getByRole('button', { name: 'Получить 7 дней бесплатно' }).click();

  await expect(page.getByRole('status')).toContainText('Заявка сохранена локально');
  await expect(page.getByRole('status')).toContainText('Данные не отправляются на сервер');
});

test('header and hero trial CTAs expose the same action', async ({ page }) => {
  await page.goto('/');

  const status = page.getByRole('status');
  await page.getByTestId('header-trial').click();
  await expect(status).toContainText('Пробный период скоро будет доступен');

  await page.getByTestId('trial-cta').click();
  await expect(status).toContainText('Пробный период скоро будет доступен');
});
