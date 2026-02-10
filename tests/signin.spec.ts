import { test, expect } from './fixtures/base';
import { RegistrationData } from '../types/registration';
import { RegistrationTestData } from '../data/registrationData';
import { ERROR_BORDER_COLOR } from '../enums/cssPatterns';
import { PasswordTestData } from '../enums/passwordTestData';

test.describe('Sign in/ Credentials validation', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage, signInPage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.openRegistrationPage();
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.clickSubmitButton();
    await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
    await signInPage.areFieldsEmpty();
  });
  test('[AQAPRACT-534] Sign in with valid email and password', async ({ signInPage, userProfilePage }) => {
    await signInPage.signIn(registeredUser.email, registeredUser.password);
    await userProfilePage.waitForPageLoad();
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
  });
  test('[AQAPRACT-535] Sign in with invalid email and valid password', async ({ signInPage }) => {
    const invalidEmail = `not-registered-${Date.now()}@example.com`;
    await signInPage.signIn(invalidEmail, registeredUser.password);
    await signInPage.assertions.verifyPageToHaveUrl(/.*login/);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.signInError);
  });
  test('[AQAPRACT-536] Sign in with valid email and invalid password', async ({ signInPage }) => {
    await signInPage.signIn(registeredUser.email, PasswordTestData.Invalid);
    await signInPage.assertions.verifyPageToHaveUrl(/.*login/);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.signInError);
  });
  test('[AQAPRACT-537] Sign in with invalid email and password', async ({ signInPage }) => {
    const invalidEmail = `not-registered-${Date.now()}@example.com`;
    await signInPage.signIn(invalidEmail, PasswordTestData.Invalid);
    await signInPage.assertions.verifyPageToHaveUrl(/.*login/);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.signInError);
  });
  test('[AQAPRACT-538] Sign in with email address with invalid format', async ({ signInPage }) => {
    await signInPage.fillEmail('Abc');
    await signInPage.actions.blur(signInPage.emailInput);
    expect(await signInPage.emailInput.inputValue()).toBe('Abc');
    await signInPage.assertions.verifyElementToHaveCss(signInPage.emailInput, 'border-color', ERROR_BORDER_COLOR);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.emailError);
    await signInPage.assertions.verifyElementToContainText(signInPage.emailError, 'Invalid email address');
    await signInPage.assertions.verifyElementToBeDisabled(signInPage.signInButton);
  });
});
test.describe('Sign in / Email field validation', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage, signInPage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.openRegistrationPage();
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.clickSubmitButton();
    await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
    await signInPage.areFieldsEmpty();
  });
  test('[AQAPRACT-539] Validation of empty "Email" field on "Sign in" page', async ({ signInPage }) => {
    await test.step('Leave the "Email" field empty', async () => {
      await signInPage.actions.focus(signInPage.emailInput);
      await signInPage.actions.blur(signInPage.emailInput);
      expect(await signInPage.emailInput.inputValue()).toBe('');
      await signInPage.assertions.verifyElementToHaveCss(signInPage.emailInput, 'border-color', ERROR_BORDER_COLOR);
      await signInPage.assertions.verifyElementToBeVisible(signInPage.emailError);
      await signInPage.assertions.verifyElementToContainText(signInPage.emailError, 'Required');
    });
    await test.step('Enter the valid password', async () => {
      await signInPage.fillPassword(registeredUser.password);
      expect(await signInPage.passwordInput.inputValue()).toBe(registeredUser.password);
      await signInPage.assertions.verifyElementToBeDisabled(signInPage.signInButton);
    });
  });
});
test.describe('Sign in / Password field validation', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.openRegistrationPage();
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.clickSubmitButton();
    await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
  });
  test('[AQAPRACT-540] Validation of empty "Password" field on sign in page', async ({ signInPage }) => {
    await test.step('Enter the valid email in the "Email" field', async () => {
      await signInPage.fillEmail(registeredUser.email);
      expect(await signInPage.emailInput.inputValue()).toBe(registeredUser.email);
    });
    await test.step('Leave the "Password" field empty', async () => {
      await signInPage.actions.focus(signInPage.passwordInput);
      await signInPage.actions.blur(signInPage.passwordInput);
      expect(await signInPage.passwordInput.inputValue()).toBe('');
      await signInPage.assertions.verifyElementToHaveCss(signInPage.passwordInput, 'border-color', ERROR_BORDER_COLOR);
      await signInPage.assertions.verifyElementToBeVisible(signInPage.passwordError);
      await signInPage.assertions.verifyElementToContainText(signInPage.passwordError, 'Required');
      await signInPage.assertions.verifyElementToBeDisabled(signInPage.signInButton);
    });
  });
  test('[AQAPRACT-541] Validation of "Password" on min length (8 characters)', async ({ signInPage }) => {
    await signInPage.fillPassword(PasswordTestData.Min);
    expect(await signInPage.passwordInput.inputValue()).toBe(PasswordTestData.Min);
    await signInPage.assertions.verifyElementToHaveAttribute(signInPage.passwordInput, 'type', 'password');
    await signInPage.assertions.verifyElementToHaveCount(signInPage.passwordError, 0);
  });
  test('[AQAPRACT-542] Validation of "Password" on max length (20 characters)', async ({ signInPage }) => {
    await test.step('Enter the valid email in the "Email" field', async () => {
      await signInPage.fillEmail(registeredUser.email);
      expect(await signInPage.emailInput.inputValue()).toBe(registeredUser.email);
    });
    await test.step('Enter 20 characters in the "Password" field', async () => {
      await signInPage.fillPassword(PasswordTestData.Max);
      expect(await signInPage.passwordInput.inputValue()).toBe(PasswordTestData.Max);
      await signInPage.assertions.verifyElementToHaveCount(signInPage.passwordError, 0);
      await signInPage.assertions.verifyElementToBeEnabled(signInPage.signInButton);
    });
  });
  test('[AQAPRACT-543] Validation of "Password" on 7 characters', async ({ signInPage }) => {
    await signInPage.fillPassword(PasswordTestData.MinMinus);
    await signInPage.actions.blur(signInPage.passwordInput);
    expect(await signInPage.passwordInput.inputValue()).toBe(PasswordTestData.MinMinus);
    await signInPage.assertions.verifyElementToHaveCss(signInPage.passwordInput, 'border-color', ERROR_BORDER_COLOR);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.passwordError);
    await signInPage.assertions.verifyElementToContainText(signInPage.passwordError, 'Minimum 8 characters');
  });
  test('[AQAPRACT-544] Validation of "Password" on 21 chacacters', async ({ signInPage }) => {
    await signInPage.fillPassword(PasswordTestData.MaxPlus);
    await signInPage.actions.blur(signInPage.passwordInput);
    expect(await signInPage.passwordInput.inputValue()).toBe(PasswordTestData.MaxPlus);
    await signInPage.assertions.verifyElementToHaveCss(signInPage.passwordInput, 'border-color', ERROR_BORDER_COLOR);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.passwordError);
    await signInPage.assertions.verifyElementToContainText(signInPage.passwordError, 'Maximum 20 characters');
  });
});
