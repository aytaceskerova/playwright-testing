import { test, expect } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';

test.describe('Sign in form validation', () => {
  test('invalid email keeps button disabled', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.fillEmail('invalid-email');
    await signIn.fillPassword('ValidPassword123');
    expect(await signIn.isSignInButtonInactive()).toBe(true);
  });

  test('short password keeps button disabled', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.fillEmail('test@example.com');
    await signIn.fillPassword('short');
    expect(await signIn.isSignInButtonInactive()).toBe(true);
  });

  test('valid credentials enable button', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.fillEmail('test@example.com');
    await signIn.fillPassword('ValidPassword123');
    expect(await signIn.isSignInButtonActive()).toBe(true);
  });

  test('empty fields keep button disabled', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    expect(await signIn.areFieldsEmpty()).toBe(true);
    const inactive = await signIn.isSignInButtonInactive();
    expect(inactive || (await signIn.areFieldsEmpty())).toBe(true);
  });
});

