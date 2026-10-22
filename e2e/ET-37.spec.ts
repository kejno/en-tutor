import { expect, test } from '@playwright/test';

test('ET-37: выбранная тема отображается в карточке оценки', async ({ page }) => {
  await page.goto('/');

  const selectedTopic = page.getByTestId('topic-tag').nth(1);
  await selectedTopic.click();

  await expect(selectedTopic).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#paths').getByRole('heading', { name: 'Build Confident IELTS Answers and Academic Arguments', exact: true })).toBeVisible();
  await expect(page.locator('#paths .split-card')).toContainText('Substantiate a claim');
  await expect(page.locator('#paths').getByRole('progressbar')).toHaveAttribute('aria-valuenow', '74');
});
