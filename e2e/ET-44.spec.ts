import { expect, test } from '@playwright/test';

test('ET-44: прокрутка открывает для просмотра и чтения все карточки и метрики', async ({ page }) => {
  await page.goto('/');

  const capabilities = page.locator('section[aria-label="Verbal mastery capabilities"]');
  const cards = capabilities.locator('.four-grid > article');
  const metrics = page.locator('section[aria-label="Learning metrics"] > div');

  const expectedCards = [
    {
      title: 'Zero-Judgment Conversational Haven',
      description: 'No human tutor sighs when you pause or repeat yourself for the fifth time. Emma adjusts her patience level to infinite, encouraging you until the pronunciation clicks.',
      nestedText: '“I finally stopped feeling ashamed of my French accent. I speak 20 mins every morning before work.”',
    },
    {
      title: 'Phonetic Accent Tuner',
      description: 'Isolate difficult sound pairings—such as the English /θ/ vs /s/—with dynamic visual waveform overlays.',
      nestedText: 'Match: 95%',
    },
    {
      title: '1,200+ Roleplay Scenarios',
      description: 'From ordering artisan coffee in London to pitching VC partners on Sand Hill Road. Experience every nuance before it counts.',
      nestedText: ['Coffee Shop', 'VC Seed Pitch', 'Emergency Room', '+ Custom Prompt'],
    },
    {
      title: 'Adaptive Persistent Memory',
      description: 'Emma remembers your stumbling blocks from 3 days ago. If you struggled with "ubiquitous" or prepositions like "in charge of", she will organically prompt them into tomorrow\'s conversation.',
      nestedText: 'Auto-synced',
    },
  ];

  const expectedMetrics = [
    ['3.4x', 'FLUENCY GAINS'],
    ['87%', 'INTERVIEW SUCCESS'],
    ['+1.5', 'IELTS BAND JUMP'],
    ['12.4M', 'MINUTES PRACTICED'],
  ];

  await expect(capabilities).toBeVisible();
  await expect(cards).toHaveCount(4);
  await expect(metrics).toHaveCount(4);

  for (const [index, expectedCard] of expectedCards.entries()) {
    const card = cards.nth(index);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    await expect(card.getByRole('heading', { level: 3, name: expectedCard.title })).toBeVisible();
    await expect(card.getByText(expectedCard.description, { exact: true })).toBeVisible();

    for (const nestedText of Array.isArray(expectedCard.nestedText) ? expectedCard.nestedText : [expectedCard.nestedText]) {
      await expect(card.getByText(nestedText, { exact: true })).toBeVisible();
    }
  }

  for (const [index, [value, label]] of expectedMetrics.entries()) {
    const metric = metrics.nth(index);
    await metric.scrollIntoViewIfNeeded();
    await expect(metric).toBeVisible();
    await expect(metric.getByText(value, { exact: true })).toBeVisible();
    await expect(metric.getByText(label, { exact: true })).toBeVisible();
  }
});
