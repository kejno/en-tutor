import { expect, test } from '@playwright/test';

test('ET-37: выбранная тема отображается в карточке оценки', async ({ page }) => {
  await page.goto('/');

  const selectedTopic = page.getByTestId('topic-tag').nth(1);
  const topicLabel = await selectedTopic.textContent();
  await selectedTopic.click();

  await expect(selectedTopic).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.split-card')).toContainText(topicLabel?.trim() ?? '');
});
