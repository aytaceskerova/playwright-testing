import { test } from '../fixtures/base';
import { RegistrationData } from '../../types/registration';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import { RegistrationTestData } from '../../data/pojos/registrationData';

test.describe('Registration tests', () => {
  test('[AQAPRACT-507] Availability of links \'Registration\' / \'Sign\' on Sign in page', async ({ signInPage, registrationPage }) => {
    await signInPage.actions.goto(URL_PATHS.Login);
    await signInPage.actions.click(signInPage.registrationLink);
    await signInPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
    await registrationPage.areFieldsEmpty();
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.submitButton);
    await registrationPage.actions.click(registrationPage.signInLink);
    await signInPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
    await signInPage.areFieldsEmpty();
  });

  test('[AQAPRACT-508] registers with valid data', async ({ registrationPage, signInPage, userProfilePage }) => {
    await registrationPage.actions.goto(URL_PATHS.Registration);
    const data: RegistrationData = new RegistrationTestData();

    await registrationPage.fillAllFields(data);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, data.firstName);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.lastNameInput, data.lastName);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.emailInput, data.email);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.passwordInput, data.password);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, data.confirmPassword);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await Promise.all([
      registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
      registrationPage.actions.click(registrationPage.submitButton),
    ]);
    await signInPage.signIn(data.email, data.password);
    await userProfilePage.waitForUserProfileReady();
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
  });
});
