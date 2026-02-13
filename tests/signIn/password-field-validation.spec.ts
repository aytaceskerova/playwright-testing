import { test } from '../fixtures/base';
import { BLANK } from '../../data/constants/commonValues';
import { RegistrationData } from '../../types/registration';
import { ERROR_BORDER_COLOR } from '../../data/constants/cssPatterns';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import { VALIDATION_MESSAGES } from '../../data/constants/validationMessages';
import { PasswordTestData } from '../../data/enums/passwordTestData';
import { RegistrationTestData } from '../../data/pojos/registrationData';

test.describe('Sign in / Password field validation', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.fillAllFields(registeredUser);
    await Promise.all([
      registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
      registrationPage.actions.click(registrationPage.submitButton),
    ]);
  });

  test('[AQAPRACT-540] Validation of empty "Password" field on sign in page', async ({ signInPage }) => {
    await test.step('Enter the valid email in the "Email" field', async () => {
      await signInPage.actions.fill(signInPage.emailInput, registeredUser.email);
      await signInPage.assertions.verifyElementToHaveValue(signInPage.emailInput, registeredUser.email);
    });
    await test.step('Leave the "Password" field empty', async () => {
      await signInPage.actions.focus(signInPage.passwordInput);
      await signInPage.actions.blur(signInPage.passwordInput);
      await signInPage.assertions.verifyElementToHaveValue(signInPage.passwordInput, BLANK);
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
