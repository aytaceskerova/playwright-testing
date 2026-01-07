import { test, expect } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';

test.describe('Sign in form validation', () => {
  test('button disabled with invalid email', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.openSignInPage();
    await signInPage.fillEmail('invalid-email');
    await signInPage.fillPassword('ValidPassword123');
    expect(await signInPage.isSignInButtonInactive()).toBe(true);
  });

  test('button disabled with short password', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.openSignInPage();
    await signInPage.fillEmail('test@example.com');
    await signInPage.fillPassword('short');
    expect(await signInPage.isSignInButtonInactive()).toBe(true);
  });

  test('button enabled with valid credentials', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.openSignInPage();
    await signInPage.fillEmail('test@example.com');
    await signInPage.fillPassword('ValidPassword123');
    expect(await signInPage.isSignInButtonActive()).toBe(true);
  });

  test('button disabled with empty fields', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.openSignInPage();
    await signInPage.emailInput.focus();
    await signInPage.emailInput.blur();
    await signInPage.passwordInput.focus();
    await signInPage.passwordInput.blur();
    await page.waitForTimeout(300);
    expect(await signInPage.areFieldsEmpty()).toBe(true);
    expect(await signInPage.isSignInButtonInactive()).toBe(true);
  });
});

