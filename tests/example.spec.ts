import { test, expect } from '@playwright/test';

test.describe('QA Course Login Page', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Verify page title or some element is visible
    await expect(page).toHaveURL(/.*login/);
  });
});

