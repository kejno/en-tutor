import { expect, test } from '@playwright/test';

test('ET-41: четыре карточки речевой практики показывают вложенные элементы', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('section[aria-label="Verbal mastery capabilities"]');
  const cards = section.locator('.four-grid > article');

  await expect(section).toBeVisible();
  await expect(cards).toHaveCount(4);
  await expect(cards.nth(0)).toContainText('Zero-Judgment Conversational Haven');
  await expect(cards.nth(0).locator('blockquote')).toContainText('French accent');
  await expect(cards.nth(1)).toContainText('Phonetic Accent Tuner');
  await expect(cards.nth(1).getByRole('figure', { name: 'Пример визуализации произношения' })).toBeVisible();
  await expect(cards.nth(1)).toContainText('Match: 95%');
  await expect(cards.nth(2)).toContainText('1,200+ Roleplay Scenarios');
  await expect(cards.nth(2).locator('.capability-tags span')).toHaveText(['Coffee Shop', 'VC Seed Pitch', 'Emergency Room', '+ Custom Prompt']);
  await expect(cards.nth(3)).toContainText('Adaptive Persistent Memory');
  await expect(cards.nth(3)).toContainText('Auto-synced');
});
