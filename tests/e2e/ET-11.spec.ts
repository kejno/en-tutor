import { expect, test } from '@playwright/test';

test('visitor can reach every capability card and learning metric by scrolling', async ({ page }) => {
  await page.goto('/');

  const capabilitySection = page.getByRole('region', { name: 'Everything You Need for Verbal Mastery' });
  await capabilitySection.scrollIntoViewIfNeeded();
  await expect(capabilitySection).toBeVisible();

  for (const title of [
    'Zero-Judgment Conversational Haven',
    'Phonetic Accent Tuner',
    '1,200+ Roleplay Scenarios',
    'Adaptive Persistent Memory',
  ]) {
    await expect(capabilitySection.getByRole('heading', { name: title })).toBeVisible();
  }

  const metrics = page.getByRole('region', { name: 'Learning metrics' });
  await metrics.scrollIntoViewIfNeeded();
  await expect(metrics).toBeVisible();
  for (const label of ['FLUENCY GAINS', 'INTERVIEW SUCCESS', 'IELTS BAND JUMP', 'MINUTES PRACTICED']) {
    await expect(metrics.getByText(label)).toBeVisible();
  }
  await expect(metrics.getByText('+1.5')).toBeVisible();
});
