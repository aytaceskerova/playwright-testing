import { test } from '../fixtures/base';
import { ERROR_BORDER_COLOR } from '../../data/constants/cssPatterns';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../../data/constants/emailConstants';
import { REGISTRATION_TEST_DATA } from '../../data/constants/registrationTestData';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import { VALIDATION_MESSAGES } from '../../data/constants/validationMessages';
import { InvalidEmailTestData } from '../../data/enums/emailTestData';

test.describe('Email field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.FirstName);
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.AltLastName);
    await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.DateOfBirth);
    await registrationPage.actions.fill(registrationPage.passwordInput, REGISTRATION_TEST_DATA.Password);
    await registrationPage.actions.fill(registrationPage.confirmPasswordInput, REGISTRATION_TEST_DATA.ConfirmPassword);
  });

  test('[AQAPRACT-523] Register with empty "Email" field', async ({ registrationPage }) => {
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.emailInput, '');
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
  });

  test('[AQAPRACT-524] Register with invalid format of email address', async ({ registrationPage }) => {
    for (const invalidEmail of InvalidEmailTestData) {
      await test.step(`Input "${invalidEmail}" value and focus out`, async () => {
        await registrationPage.actions.fill(registrationPage.emailInput, invalidEmail);
        await registrationPage.actions.blur(registrationPage.emailInput);
        await registrationPage.assertions.verifyElementToHaveValue(registrationPage.emailInput, invalidEmail);
        await registrationPage.assertions.verifyElementToHaveCss(registrationPage.emailInput, 'border-color', ERROR_BORDER_COLOR);
        await registrationPage.assertions.verifyElementToBeVisible(registrationPage.emailError);
        await registrationPage.assertions.verifyElementToContainText(
          registrationPage.emailError,
          VALIDATION_MESSAGES.InvalidEmail,
        );
      });
    }
  });

  test.fail('[AQAPRACT-525] Register with already existed email', async ({ registrationPage }) => {
    const existingEmail = `${EMAIL_PREFIXES.Existing}${Date.now()}@${EMAIL_DOMAIN}`;
    await test.step('Register user with email', async () => {
      await registrationPage.actions.fill(registrationPage.emailInput, existingEmail);
      await Promise.all([
        registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
        registrationPage.actions.click(registrationPage.submitButton),
      ]);
    });
    await test.step('Enter already registered email', async () => {
      await registrationPage.actions.goto(URL_PATHS.Registration);
      await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.FirstName);
      await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.AltLastName);
      await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.DateOfBirth);
      await registrationPage.actions.fill(registrationPage.passwordInput, REGISTRATION_TEST_DATA.Password);
      await registrationPage.actions.fill(registrationPage.confirmPasswordInput, REGISTRATION_TEST_DATA.ConfirmPassword);
      await registrationPage.actions.fill(registrationPage.emailInput, existingEmail);
      await registrationPage.assertions.verifyElementToHaveValue(registrationPage.emailInput, existingEmail);
      await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    });
    await test.step('Click on the Submit button', async () => {
      await registrationPage.actions.click(registrationPage.submitButton);
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.emailError);
      await registrationPage.assertions.verifyElementToContainText(
        registrationPage.emailError,
        VALIDATION_MESSAGES.ExistingEmail,
      );
      await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
    });
  });
});
