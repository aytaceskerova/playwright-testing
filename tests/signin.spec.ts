import { test, expect } from './fixtures/base';
import { RegistrationData } from '../types/registration';
const enum CssPattern {
  ErrorBorderColor = 'rgb\\(2\\d{2}',
}
const ERROR_BORDER_COLOR = new RegExp(CssPattern.ErrorBorderColor);
const PASSWORD_MIN = 'Test1234';
const PASSWORD_MIN_MINUS = 'Test123';
const PASSWORD_MAX = 'A'.repeat(20);
const PASSWORD_MAX_PLUS = 'A'.repeat(21);

test.describe('Sign in / Email field validation', () => {
  let registeredUser: RegistrationData;

  test.beforeEach(async ({ page, registrationPage, signInPage }) => {
    registeredUser = {
      firstName: 'Ai',
      lastName: 'kai',
      dateOfBirth: '2000-01-15',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123',
      confirmPassword: 'TestPassword123',
    };
    await registrationPage.openRegistrationPage();
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.clickSubmitButton();
    await expect(page).toHaveURL(/.*login/);
    await signInPage.areFieldsEmpty();
  });

  test('[AQAPRACT-539] Validation of empty "Email" field on "Sign in" page', async ({ signInPage }) => {
    await test.step('Leave the "Email" field empty', async () => {
      await signInPage.emailInput.focus();
      await signInPage.emailInput.blur();
      expect(await signInPage.emailInput.inputValue()).toBe('');
      await expect(signInPage.emailInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
      await expect(signInPage.emailError).toBeVisible();
      await expect(signInPage.emailError).toContainText('Required');
    });
    await test.step('Enter the valid password', async () => {
      await signInPage.fillPassword(registeredUser.password);
      expect(await signInPage.passwordInput.inputValue()).toBe(registeredUser.password);
      await expect(signInPage.signInButton).toBeDisabled();
    });
  });
});

test.describe('Sign in / Password field validation', () => {
  let registeredUser: RegistrationData;

  test.beforeEach(async ({ page, registrationPage }) => {
    registeredUser = {
      firstName: 'Ai',
      lastName: 'Kai',
      dateOfBirth: '2000-01-15',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123',
      confirmPassword: 'TestPassword123',
    };
    await registrationPage.openRegistrationPage();
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.clickSubmitButton();
    await expect(page).toHaveURL(/.*login/);
  });

  test('[AQAPRACT-540] Validation of empty "Password" field on sign in page', async ({ signInPage }) => {
    await test.step('Enter the valid email in the "Email" field', async () => {
      await signInPage.fillEmail(registeredUser.email);
      expect(await signInPage.emailInput.inputValue()).toBe(registeredUser.email);
    });
    await test.step('Leave the "Password" field empty', async () => {
      await signInPage.passwordInput.focus();
      await signInPage.passwordInput.blur();
      expect(await signInPage.passwordInput.inputValue()).toBe('');
      await expect(signInPage.passwordInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
      await expect(signInPage.passwordError).toBeVisible();
      await expect(signInPage.passwordError).toContainText('Required');
      await expect(signInPage.signInButton).toBeDisabled();
    });
  });
  test('[AQAPRACT-541] Validation of "Password" on min length (8 characters)', async ({ signInPage }) => {
    await signInPage.fillPassword(PASSWORD_MIN);
    expect(await signInPage.passwordInput.inputValue()).toBe(PASSWORD_MIN);
    await expect(signInPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(signInPage.passwordError).toHaveCount(0);
  });

  test('[AQAPRACT-542] Validation of "Password" on max length (20 characters)', async ({ signInPage }) => {
    await test.step('Enter the valid email in the "Email" field', async () => {
      await signInPage.fillEmail(registeredUser.email);
      expect(await signInPage.emailInput.inputValue()).toBe(registeredUser.email);
    });
    await test.step('Enter 20 characters in the "Password" field', async () => {
      await signInPage.fillPassword(PASSWORD_MAX);
      expect(await signInPage.passwordInput.inputValue()).toBe(PASSWORD_MAX);
      await expect(signInPage.passwordError).toHaveCount(0);
      await expect(signInPage.signInButton).toBeEnabled();
    });
  });

  test('[AQAPRACT-543] Validation of "Password" on 7 characters', async ({ signInPage }) => {
    await signInPage.fillPassword(PASSWORD_MIN_MINUS);
    await signInPage.passwordInput.blur();
    expect(await signInPage.passwordInput.inputValue()).toBe(PASSWORD_MIN_MINUS);
    await expect(signInPage.passwordInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
    await expect(signInPage.passwordError).toBeVisible();
    await expect(signInPage.passwordError).toContainText('Minimum 8 characters');
  });

  test('[AQAPRACT-544] Validation of "Password" on 21 chacacters', async ({ signInPage }) => {
    await signInPage.fillPassword(PASSWORD_MAX_PLUS);
    await signInPage.passwordInput.blur();
    expect(await signInPage.passwordInput.inputValue()).toBe(PASSWORD_MAX_PLUS);
    await expect(signInPage.passwordInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
    await expect(signInPage.passwordError).toBeVisible();
    await expect(signInPage.passwordError).toContainText('Maximum 20 characters');
  });
});
