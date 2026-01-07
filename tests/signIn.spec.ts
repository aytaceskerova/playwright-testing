import { test, expect } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';

test.describe('Sign in form validation', () => {
  let signInPage: SignInPage;

  test.beforeEach(async ({ page }) => {
    signInPage = new SignInPage(page);
  });

  test('button disabled with invalid email', async ({ page }) => {
    await signInPage.openSignInPage();
    await signInPage.fillEmail('invalid-email');
    await signInPage.fillPassword('ValidPassword123');
    await expect(signInPage.signInButton).toBeDisabled();
  });

  test('button disabled with short password', async ({ page }) => {
    await signInPage.openSignInPage();
    await signInPage.fillEmail('test@example.com');
    await signInPage.fillPassword('short');
    await expect(signInPage.signInButton).toBeDisabled();
  });

  test('button enabled with valid credentials', async ({ page }) => {
    await signInPage.openSignInPage();
    await signInPage.fillEmail('test@example.com');
    await signInPage.fillPassword('ValidPassword123');
    await expect(signInPage.signInButton).toBeEnabled();
  });

  test('button disabled with empty fields', async ({ page }) => {
    await signInPage.openSignInPage();
    await signInPage.emailInput.focus();
    await signInPage.emailInput.blur();
    await signInPage.passwordInput.focus();
    await signInPage.passwordInput.blur();
    await page.waitForTimeout(300);
    expect(await signInPage.areFieldsEmpty()).toBe(true);
    await expect(signInPage.signInButton).toBeDisabled();
  });
});

