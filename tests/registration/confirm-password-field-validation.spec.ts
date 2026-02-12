import { test } from '../fixtures/base';
import { ERROR_BORDER_COLOR } from '../../data/constants/cssPatterns';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../../data/constants/emailConstants';
import { REGISTRATION_TEST_DATA } from '../../data/constants/registrationTestData';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import { VALIDATION_MESSAGES } from '../../data/constants/validationMessages';
import { PasswordTestData } from '../../data/enums/passwordTestData';

test.describe('Confirm password field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.FirstName);
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.LastName);
    await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.DateOfBirth);
    await registrationPage.actions.fill(registrationPage.emailInput, `${EMAIL_PREFIXES.Base}${Date.now()}@${EMAIL_DOMAIN}`);
    await registrationPage.actions.fill(registrationPage.passwordInput, REGISTRATION_TEST_DATA.Password);
  });

  test('[AQAPRACT-531] Register with equal data "Password" and "Confirm password" fields', async ({ registrationPage, signInPage, userProfilePage }) => {
    const password = REGISTRATION_TEST_DATA.Password;
    const email = await registrationPage.getFieldValue('email');
    await test.step('Enter the same data from the field "Password" in the "Confirm password" field', async () => {
      await registrationPage.actions.fill(registrationPage.confirmPasswordInput, password);
      await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, password);
    });
    await test.step('Click the "Submit" button', async () => {
      await Promise.all([
        registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
        registrationPage.actions.click(registrationPage.submitButton),
      ]);
      await signInPage.signIn(email, password);
      await userProfilePage.waitForUserProfileReady();
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
    });
  });

  test('[AQAPRACT-532] Register with different data in "Password" and "Confirm password" fields', async ({ registrationPage }) => {
    await registrationPage.actions.fill(registrationPage.confirmPasswordInput, PasswordTestData.ConfirmMismatch);
    await registrationPage.actions.blur(registrationPage.confirmPasswordInput);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, PasswordTestData.ConfirmMismatch);
    await registrationPage.assertions.verifyElementToHaveCss(registrationPage.confirmPasswordInput, 'border-color', ERROR_BORDER_COLOR);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.confirmPasswordError);
    await registrationPage.assertions.verifyElementToContainText(
      registrationPage.confirmPasswordError,
      VALIDATION_MESSAGES.PasswordsMustMatch,
    );
  });

  test('[AQAPRACT-533] Register with empty "Confirm password" field', async ({ registrationPage }) => {
    await registrationPage.actions.focus(registrationPage.confirmPasswordInput);
    await registrationPage.actions.blur(registrationPage.confirmPasswordInput);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, '');
    await registrationPage.assertions.verifyElementToHaveCss(registrationPage.confirmPasswordInput, 'border-color', ERROR_BORDER_COLOR);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.confirmPasswordError);
    await registrationPage.assertions.verifyElementToContainText(
      registrationPage.confirmPasswordError,
      VALIDATION_MESSAGES.Required,
    );
  });
});
