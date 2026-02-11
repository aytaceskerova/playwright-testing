import { test } from './fixtures/base';
import { RegistrationData } from '../types/registration';
import { ERROR_BORDER_COLOR } from '../data/constants/cssPatterns';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../data/constants/emailConstants';
import { SIGN_IN_TEST_DATA } from '../data/constants/signInTestData';
import { URL_PATHS } from '../data/constants/urlPaths';
import { URL_PATTERNS } from '../data/constants/urlPatterns';
import { VALIDATION_MESSAGES } from '../data/constants/validationMessages';
import { PasswordTestData } from '../data/enums/passwordTestData';
import { RegistrationTestData } from '../data/pojos/registrationData';

test.describe('Sign in/ Credentials validation', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage, signInPage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
    await signInPage.areFieldsEmpty();
  });
  test('[AQAPRACT-534] Sign in with valid email and password', async ({ signInPage, userProfilePage }) => {
    await signInPage.signIn(registeredUser.email, registeredUser.password);
    await userProfilePage.waitForUserProfileReady();
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
  });
  test('[AQAPRACT-535] Sign in with invalid email and valid password', async ({ signInPage }) => {
    const invalidEmail = `${EMAIL_PREFIXES.NotRegistered}${Date.now()}@${EMAIL_DOMAIN}`;
    await signInPage.signIn(invalidEmail, registeredUser.password);
    await signInPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.signInError);
  });
  test('[AQAPRACT-536] Sign in with valid email and invalid password', async ({ signInPage }) => {
    await signInPage.signIn(registeredUser.email, PasswordTestData.Invalid);
    await signInPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.signInError);
  });
  test('[AQAPRACT-537] Sign in with invalid email and password', async ({ signInPage }) => {
    const invalidEmail = `${EMAIL_PREFIXES.NotRegistered}${Date.now()}@${EMAIL_DOMAIN}`;
    await signInPage.signIn(invalidEmail, PasswordTestData.Invalid);
    await signInPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.signInError);
  });
  test('[AQAPRACT-538] Sign in with email address with invalid format', async ({ signInPage }) => {
    await signInPage.actions.fill(signInPage.emailInput, SIGN_IN_TEST_DATA.InvalidEmail);
    await signInPage.actions.blur(signInPage.emailInput);
    await signInPage.assertions.verifyElementToHaveValue(signInPage.emailInput, SIGN_IN_TEST_DATA.InvalidEmail);
    await signInPage.assertions.verifyElementToHaveCss(signInPage.emailInput, 'border-color', ERROR_BORDER_COLOR);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.emailError);
    await signInPage.assertions.verifyElementToContainText(signInPage.emailError, VALIDATION_MESSAGES.InvalidEmail);
    await signInPage.assertions.verifyElementToBeDisabled(signInPage.signInButton);
  });
});
test.describe('Sign in / Email field validation', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage, signInPage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
    await signInPage.areFieldsEmpty();
  });
  test('[AQAPRACT-539] Validation of empty "Email" field on "Sign in" page', async ({ signInPage }) => {
    await test.step('Leave the "Email" field empty', async () => {
      await signInPage.actions.focus(signInPage.emailInput);
      await signInPage.actions.blur(signInPage.emailInput);
      await signInPage.assertions.verifyElementToHaveValue(signInPage.emailInput, '');
      await signInPage.assertions.verifyElementToHaveCss(signInPage.emailInput, 'border-color', ERROR_BORDER_COLOR);
      await signInPage.assertions.verifyElementToBeVisible(signInPage.emailError);
      await signInPage.assertions.verifyElementToContainText(signInPage.emailError, VALIDATION_MESSAGES.Required);
    });
    await test.step('Enter the valid password', async () => {
      await signInPage.actions.fill(signInPage.passwordInput, registeredUser.password);
      await signInPage.assertions.verifyElementToHaveValue(signInPage.passwordInput, registeredUser.password);
      await signInPage.assertions.verifyElementToBeDisabled(signInPage.signInButton);
    });
  });
});
test.describe('Sign in / Password field validation', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
  });
  test('[AQAPRACT-540] Validation of empty "Password" field on sign in page', async ({ signInPage }) => {
    await test.step('Enter the valid email in the "Email" field', async () => {
      await signInPage.actions.fill(signInPage.emailInput, registeredUser.email);
      await signInPage.assertions.verifyElementToHaveValue(signInPage.emailInput, registeredUser.email);
    });
    await test.step('Leave the "Password" field empty', async () => {
      await signInPage.actions.focus(signInPage.passwordInput);
      await signInPage.actions.blur(signInPage.passwordInput);
      await signInPage.assertions.verifyElementToHaveValue(signInPage.passwordInput, '');
      await signInPage.assertions.verifyElementToHaveCss(signInPage.passwordInput, 'border-color', ERROR_BORDER_COLOR);
      await signInPage.assertions.verifyElementToBeVisible(signInPage.passwordError);
      await signInPage.assertions.verifyElementToContainText(signInPage.passwordError, VALIDATION_MESSAGES.Required);
      await signInPage.assertions.verifyElementToBeDisabled(signInPage.signInButton);
    });
  });
  test('[AQAPRACT-541] Validation of "Password" on min length (8 characters)', async ({ signInPage }) => {
    await signInPage.actions.fill(signInPage.passwordInput, PasswordTestData.Min);
    await signInPage.assertions.verifyElementToHaveValue(signInPage.passwordInput, PasswordTestData.Min);
    await signInPage.assertions.verifyElementToHaveAttribute(signInPage.passwordInput, 'type', 'password');
    await signInPage.assertions.verifyElementToHaveCount(signInPage.passwordError, 0);
  });
  test('[AQAPRACT-542] Validation of "Password" on max length (20 characters)', async ({ signInPage }) => {
    await test.step('Enter the valid email in the "Email" field', async () => {
      await signInPage.actions.fill(signInPage.emailInput, registeredUser.email);
      await signInPage.assertions.verifyElementToHaveValue(signInPage.emailInput, registeredUser.email);
    });
    await test.step('Enter 20 characters in the "Password" field', async () => {
      await signInPage.actions.fill(signInPage.passwordInput, PasswordTestData.Max);
      await signInPage.assertions.verifyElementToHaveValue(signInPage.passwordInput, PasswordTestData.Max);
      await signInPage.assertions.verifyElementToHaveCount(signInPage.passwordError, 0);
      await signInPage.assertions.verifyElementToBeEnabled(signInPage.signInButton);
    });
  });
  test('[AQAPRACT-543] Validation of "Password" on 7 characters', async ({ signInPage }) => {
    await signInPage.actions.fill(signInPage.passwordInput, PasswordTestData.MinMinus);
    await signInPage.actions.blur(signInPage.passwordInput);
    await signInPage.assertions.verifyElementToHaveValue(signInPage.passwordInput, PasswordTestData.MinMinus);
    await signInPage.assertions.verifyElementToHaveCss(signInPage.passwordInput, 'border-color', ERROR_BORDER_COLOR);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.passwordError);
    await signInPage.assertions.verifyElementToContainText(signInPage.passwordError, VALIDATION_MESSAGES.MinPasswordLength);
  });
  test('[AQAPRACT-544] Validation of "Password" on 21 chacacters', async ({ signInPage }) => {
    await signInPage.actions.fill(signInPage.passwordInput, PasswordTestData.MaxPlus);
    await signInPage.actions.blur(signInPage.passwordInput);
    await signInPage.assertions.verifyElementToHaveValue(signInPage.passwordInput, PasswordTestData.MaxPlus);
    await signInPage.assertions.verifyElementToHaveCss(signInPage.passwordInput, 'border-color', ERROR_BORDER_COLOR);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.passwordError);
    await signInPage.assertions.verifyElementToContainText(signInPage.passwordError, VALIDATION_MESSAGES.MaxPasswordLength);
  });
});
