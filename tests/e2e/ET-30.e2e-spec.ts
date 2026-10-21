import { expect, test } from '@playwright/test';

test('ET-30: корневой маршрут отображает лендинг FluentAI без ошибки маршрутизации', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  const errorResponses: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.method()} ${request.url()} — ${request.failure()?.errorText ?? 'unknown error'}`);
  });
  page.on('response', (response) => {
    if (response.status() === 404 || response.status() >= 500) {
      errorResponses.push(`${response.status()} ${response.request().method()} ${response.url()}`);
    }
  });

  const response = await page.goto('/');

  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Speak English with Natural Confidence/i })).toBeVisible();
  await expect(page.getByText('FluentAI', { exact: true }).first()).toBeVisible();
  expect(consoleErrors, `Browser console errors: ${consoleErrors.join('\n')}`).toEqual([]);
  expect(pageErrors, `Unhandled page errors: ${pageErrors.join('\n')}`).toEqual([]);
  expect(failedRequests, `Failed requests: ${failedRequests.join('\n')}`).toEqual([]);
  expect(errorResponses, `HTTP error responses: ${errorResponses.join('\n')}`).toEqual([]);
});
