import { expect, test } from '@playwright/test';

test('BNP-583: элементы шапки доступны с клавиатуры и имеют корректные назначения', async ({ page }) => {
  await page.goto('/');

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
  const navigationLinks = navigation.getByRole('link');
  await expect(navigationLinks).toHaveCount(5);

  for (let index = 0; index < 5; index += 1) {
    const link = navigationLinks.nth(index);
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toHaveAttribute('href', /^#/);
  }

  const login = page.getByRole('link', { name: 'Log in' });
  await login.focus();
  await expect(login).toBeFocused();
  await expect(login).toHaveAttribute('href', '#final-cta');

  const trialButton = page.getByTestId('header-trial');
  await trialButton.focus();
  await expect(trialButton).toBeFocused();
  await trialButton.press('Enter');
  await expect(page.getByRole('status')).toContainText('Пробный период скоро будет доступен');
});
