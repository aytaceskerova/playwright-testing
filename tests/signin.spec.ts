import { test, expect } from './fixtures/base';
import { RegistrationData } from '../types/registration';
import { RegistrationTestData } from '../data/registrationData';
import { ERROR_BORDER_COLOR } from '../enums/cssPatterns';
import { PasswordTestData } from '../enums/passwordTestData';

test.describe('Sign in/ Credentials validation', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ page, registrationPage, signInPage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.openRegistrationPage();
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.clickSubmitButton();
    await expect(page).toHaveURL(/.*login/);
    await signInPage.areFieldsEmpty();
  });
  test('[AQAPRACT-534] Sign in with valid email and password', async ({ signInPage, userProfilePage }) => {
    await signInPage.signIn(registeredUser.email, registeredUser.password);
    await userProfilePage.waitForPageLoad();
    await expect(userProfilePage.signOut).toBeVisible();
  });
  test('[AQAPRACT-535] Sign in with invalid email and valid password', async ({ page, signInPage }) => {
    const invalidEmail = `not-registered-${Date.now()}@example.com`;
    await signInPage.signIn(invalidEmail, registeredUser.password);
    await expect(page).toHaveURL(/.*login/);
    await expect(signInPage.signInError).toBeVisible();
  });
  test('[AQAPRACT-536] Sign in with valid email and invalid password', async ({ page, signInPage }) => {
    const invalidPassword = 'WrongPassword123';
    await signInPage.signIn(registeredUser.email, invalidPassword);
    await expect(page).toHaveURL(/.*login/);
    await expect(signInPage.signInError).toBeVisible();
  });
  test('[AQAPRACT-537] Sign in with invalid email and password', async ({ page, signInPage }) => {
    const invalidEmail = `not-registered-${Date.now()}@example.com`;
    const invalidPassword = 'WrongPassword123';
    await signInPage.signIn(invalidEmail, invalidPassword);
    await expect(page).toHaveURL(/.*login/);
    await expect(signInPage.signInError).toBeVisible();
  });
  test('[AQAPRACT-538] Sign in with email address with invalid format', async ({ signInPage }) => {
    await signInPage.fillEmail('Abc');
    await signInPage.emailInput.blur();
    expect(await signInPage.emailInput.inputValue()).toBe('Abc');
    await expect(signInPage.emailInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
    await expect(signInPage.emailError).toBeVisible();
    await expect(signInPage.emailError).toContainText('Invalid email address');
    await expect(signInPage.signInButton).toBeDisabled();
  });
});
test.describe('Sign in / Email field validation', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ page, registrationPage, signInPage }) => {
    registeredUser = new RegistrationTestData();
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
    registeredUser = new RegistrationTestData();
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
    await signInPage.fillPassword(PasswordTestData.Min);
    expect(await signInPage.passwordInput.inputValue()).toBe(PasswordTestData.Min);
    await expect(signInPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(signInPage.passwordError).toHaveCount(0);
  });
  test('[AQAPRACT-542] Validation of "Password" on max length (20 characters)', async ({ signInPage }) => {
    await test.step('Enter the valid email in the "Email" field', async () => {
      await signInPage.fillEmail(registeredUser.email);
      expect(await signInPage.emailInput.inputValue()).toBe(registeredUser.email);
    });
    await test.step('Enter 20 characters in the "Password" field', async () => {
      await signInPage.fillPassword(PasswordTestData.Max);
      expect(await signInPage.passwordInput.inputValue()).toBe(PasswordTestData.Max);
      await expect(signInPage.passwordError).toHaveCount(0);
      await expect(signInPage.signInButton).toBeEnabled();
    });
  });
  test('[AQAPRACT-543] Validation of "Password" on 7 characters', async ({ signInPage }) => {
    await signInPage.fillPassword(PasswordTestData.MinMinus);
    await signInPage.passwordInput.blur();
    expect(await signInPage.passwordInput.inputValue()).toBe(PasswordTestData.MinMinus);
    await expect(signInPage.passwordInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
    await expect(signInPage.passwordError).toBeVisible();
    await expect(signInPage.passwordError).toContainText('Minimum 8 characters');
  });
  test('[AQAPRACT-544] Validation of "Password" on 21 chacacters', async ({ signInPage }) => {
    await signInPage.fillPassword(PasswordTestData.MaxPlus);
    await signInPage.passwordInput.blur();
    expect(await signInPage.passwordInput.inputValue()).toBe(PasswordTestData.MaxPlus);
    await expect(signInPage.passwordInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
    await expect(signInPage.passwordError).toBeVisible();
    await expect(signInPage.passwordError).toContainText('Maximum 20 characters');
  });
});
