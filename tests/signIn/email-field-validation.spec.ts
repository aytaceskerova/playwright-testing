import { test } from '../fixtures/base';
import { RegistrationData } from '../../types/registration';
import { ERROR_BORDER_COLOR } from '../../data/constants/cssPatterns';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import { VALIDATION_MESSAGES } from '../../data/constants/validationMessages';
import { RegistrationTestData } from '../../data/pojos/registrationData';

test.describe('Sign in / Email field validation', () => {
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
