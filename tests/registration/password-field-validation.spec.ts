import { test } from '../fixtures/base';
import { ERROR_BORDER_COLOR } from '../../data/constants/cssPatterns';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../../data/constants/emailConstants';
import { REGISTRATION_TEST_DATA } from '../../data/constants/registrationTestData';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import { VALIDATION_MESSAGES } from '../../data/constants/validationMessages';
import { PasswordTestData } from '../../data/enums/passwordTestData';

test.describe('Password field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.FirstName);
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.LastName);
    await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.DateOfBirth);
    await registrationPage.actions.fill(registrationPage.emailInput, `${EMAIL_PREFIXES.Base}${Date.now()}@${EMAIL_DOMAIN}`);
  });

  test('[AQAPRACT-526] Register with min \'Password\' length (8 characters)', async ({ registrationPage, signInPage, userProfilePage }) => {
    const password8 = PasswordTestData.Min;
    const email = await registrationPage.getFieldValue('email');
    await registrationPage.actions.fill(registrationPage.passwordInput, password8);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.passwordInput, password8);
    await registrationPage.actions.fill(registrationPage.confirmPasswordInput, password8);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, password8);
    await Promise.all([
      registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
      registrationPage.actions.click(registrationPage.submitButton),
    ]);
    await signInPage.signIn(email, password8);
    await userProfilePage.waitForUserProfileReady();
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
  });

  test('[AQAPRACT-527] Register with max "Password" length (20 characters)', async ({ registrationPage, signInPage, userProfilePage }) => {
    const password20 = PasswordTestData.Max;
    const email = await registrationPage.getFieldValue('email');
    await registrationPage.actions.fill(registrationPage.passwordInput, password20);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.passwordInput, password20);
    await registrationPage.actions.fill(registrationPage.confirmPasswordInput, password20);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, password20);
    await Promise.all([
      registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
      registrationPage.actions.click(registrationPage.submitButton),
    ]);
    await signInPage.signIn(email, password20);
    await userProfilePage.waitForUserProfileReady();
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
  });

  test('[AQAPRACT-528] Register with min-1 "Password" length (7 characters)', async ({ registrationPage }) => {
    const password7 = PasswordTestData.MinMinus;
    await registrationPage.actions.fill(registrationPage.passwordInput, password7);
    await registrationPage.actions.blur(registrationPage.passwordInput);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.passwordInput, password7);
    await registrationPage.assertions.verifyElementToHaveCss(registrationPage.passwordInput, 'border-color', ERROR_BORDER_COLOR);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.passwordError);
    await registrationPage.assertions.verifyElementToContainText(
      registrationPage.passwordError,
      VALIDATION_MESSAGES.MinPasswordLength,
    );
  });

  test('[AQAPRACT-529] Register with max+1 "Password" length (21 characters)', async ({ registrationPage }) => {
    const password21 = PasswordTestData.MaxPlus;
    await registrationPage.actions.fill(registrationPage.passwordInput, password21);
    await registrationPage.actions.blur(registrationPage.passwordInput);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.passwordInput, password21);
    await registrationPage.assertions.verifyElementToHaveCss(registrationPage.passwordInput, 'border-color', ERROR_BORDER_COLOR);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.passwordError);
    await registrationPage.assertions.verifyElementToContainText(
      registrationPage.passwordError,
      VALIDATION_MESSAGES.MaxPasswordLength,
    );
  });

  test('[AQAPRACT-530] Register with empty "Password" field', async ({ registrationPage }) => {
    await registrationPage.actions.focus(registrationPage.passwordInput);
    await registrationPage.actions.blur(registrationPage.passwordInput);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.passwordInput, '');
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
  });
});
