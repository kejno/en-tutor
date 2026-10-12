import { expect, test } from '@playwright/test';

test('switches billing period and keeps trial buttons keyboard accessible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-plan="starter"] .price-value')).toHaveText('$8.40');

  const monthly = page.getByRole('button', { name: 'Billed Monthly' });
  await monthly.focus();
  await expect(monthly).toBeFocused();
  await monthly.press('Space');
  await expect(monthly).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-plan="starter"] .price-value')).toHaveText('$14.00');
  await expect(page.locator('[data-plan="starter"] [data-billing="starter"]')).toHaveText('в месяц');
  await expect(page.locator('.cta')).toHaveCount(3);

  const firstCta = page.getByRole('button', { name: 'Start Free 7-Day Trial' }).first();
  await expect(firstCta).toBeEnabled();
  await firstCta.focus();
  await expect(firstCta).toBeFocused();
  await firstCta.press('Enter');
  await expect(firstCta.locator('..').locator('.cta-status')).toHaveText('Trial started locally.');
});
