import { expect, test } from '@playwright/test';

test('BNP-577: период оплаты меняет цены и доступен с клавиатуры', async ({ page }) => {
  await page.goto('/');

  const pricing = page.locator('#pricing');
  const monthly = pricing.getByRole('button', { name: 'Billed Monthly' });
  const annual = pricing.getByRole('button', { name: /Billed Annually/ });
  const starter = pricing.locator('[data-plan="starter"]');

  await expect(annual).toHaveAttribute('aria-pressed', 'true');
  await expect(monthly).toHaveAttribute('aria-pressed', 'false');
  await expect(starter.locator('.price-value')).toHaveText('$8.40');

  await monthly.focus();
  await expect(monthly).toBeFocused();
  await monthly.press('Space');
  await expect(monthly).toHaveAttribute('aria-pressed', 'true');
  await expect(annual).toHaveAttribute('aria-pressed', 'false');
  await expect(starter.locator('.price-value')).toHaveText('$14.00');
  await expect(starter.locator('[data-billing="starter"]')).toHaveText('в месяц');

  const ctas = pricing.getByRole('button', { name: 'Start Free 7-Day Trial' });
  await expect(ctas).toHaveCount(3);
  await expect(ctas.first()).toBeEnabled();
  await ctas.first().focus();
  await expect(ctas.first()).toBeFocused();
  await ctas.first().press('Enter');
  await expect(starter.locator('.cta-status')).toHaveText('Trial started locally.');
});
