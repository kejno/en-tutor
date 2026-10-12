import { expect, test } from '@playwright/test';

test('visitor reaches the final CTA and sees a local confirmation', async ({ page }) => {
  await page.goto('/');
  await page.locator('#final-cta').scrollIntoViewIfNeeded();
  await page.locator('#cta-email').fill('learner@example.com');
  await page.getByRole('button', { name: 'Получить 7 дней бесплатно' }).click();

  await expect(page.getByRole('status')).toContainText('Заявка сохранена локально');
  await expect(page.getByRole('status')).toContainText('Данные не отправляются на сервер');
});
