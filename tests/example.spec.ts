import { test, expect } from '@playwright/test';

test.describe('QA Course Login Page', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*login/);
  });
});

