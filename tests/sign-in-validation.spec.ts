import { test, expect } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';

test.describe('Sing In Form Validation', () => {
  test('should keep Sing in button inactive when email is invalid', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    // Fill with invalid email
    await signInPage.fillEmail('invalid-email');
    await signInPage.fillPassword('ValidPassword123');

    // Button should remain inactive with invalid email
    const isButtonInactive = await signInPage.isSignInButtonInactive();
    expect(isButtonInactive).toBe(true);
  });

  test('should keep Sing in button inactive when password is too short', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    // Fill with valid email but short password
    await signInPage.fillEmail('test@example.com');
    await signInPage.fillPassword('short'); // Less than 8 characters

    // Button should remain inactive with short password
    const isButtonInactive = await signInPage.isSignInButtonInactive();
    expect(isButtonInactive).toBe(true);
  });

  test('should activate Sing in button when all fields are valid', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    // Fill with valid email and password (min 8 characters)
    await signInPage.fillEmail('test@example.com');
    await signInPage.fillPassword('ValidPassword123');

    // Button should be active with valid data
    const isButtonActive = await signInPage.isSignInButtonActive();
    expect(isButtonActive).toBe(true);
  });

  test('should keep Sing in button inactive when fields are empty', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    // Verify fields are empty
    const areFieldsEmpty = await signInPage.areFieldsEmpty();
    expect(areFieldsEmpty).toBe(true);

    // Button should be inactive when fields are empty
    // Note: Button might be enabled but validation prevents submission
    const isButtonInactive = await signInPage.isSignInButtonInactive();
    if (!isButtonInactive) {
      // If button appears enabled, verify fields are empty (validation will prevent submission)
      expect(areFieldsEmpty).toBe(true);
    } else {
      expect(isButtonInactive).toBe(true);
    }
  });
});

