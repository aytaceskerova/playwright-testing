import { test } from '../fixtures/base';
import { RegistrationData } from '../../types/registration';
import { ERROR_BORDER_COLOR } from '../../data/constants/cssPatterns';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../../data/constants/emailConstants';
import { SIGN_IN_TEST_DATA } from '../../data/constants/signInTestData';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import { VALIDATION_MESSAGES } from '../../data/constants/validationMessages';
import { PasswordTestData } from '../../data/enums/passwordTestData';
import { RegistrationTestData } from '../../data/pojos/registrationData';

test.describe('Sign in/ Credentials validation', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage, signInPage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.fillAllFields(registeredUser);
    await Promise.all([
      registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
      registrationPage.actions.click(registrationPage.submitButton),
    ]);
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
