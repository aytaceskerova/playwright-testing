import { test } from '../fixtures/base';
import { BLANK } from '../../data/constants/commonValues';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../../data/constants/emailConstants';
import { FIELD_LENGTHS } from '../../data/constants/fieldLengths';
import { REGISTRATION_TEST_DATA } from '../../data/constants/registrationTestData';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import { VALIDATION_MESSAGES } from '../../data/constants/validationMessages';

test.describe('Last name field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.FirstName);
    await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.DateOfBirth);
    await registrationPage.actions.fill(registrationPage.emailInput, `${EMAIL_PREFIXES.Base}${Date.now()}@${EMAIL_DOMAIN}`);
    await registrationPage.actions.fill(registrationPage.passwordInput, REGISTRATION_TEST_DATA.Password);
    await registrationPage.actions.fill(registrationPage.confirmPasswordInput, REGISTRATION_TEST_DATA.ConfirmPassword);
  });

  test('[AQAPRACT-514] Register with max \'Last name\' length (255 characters)', async ({ registrationPage }) => {
    const lastName255 = REGISTRATION_TEST_DATA.MinCharValue.repeat(FIELD_LENGTHS.NameMax);
    await registrationPage.actions.fill(registrationPage.lastNameInput, lastName255);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.lastNameInput, lastName255);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await Promise.all([
      registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
      registrationPage.actions.click(registrationPage.submitButton),
    ]);
  });

  test('[AQAPRACT-515] Register with min "Last name" length (1 character)', async ({ registrationPage }) => {
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.MinCharValue);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.MinCharValue);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await Promise.all([
      registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
      registrationPage.actions.click(registrationPage.submitButton),
    ]);
  });

  test('[AQAPRACT-516] Register with max+1 "Last name" length (256 characters)', async ({ registrationPage }) => {
    const lastName256 = REGISTRATION_TEST_DATA.MinCharValue.repeat(FIELD_LENGTHS.NameMaxPlus);
    await registrationPage.actions.fill(registrationPage.lastNameInput, lastName256);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.lastNameInput, lastName256);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
  });

  test('[AQAPRACT-517] Register with empty "Last name" field', async ({ registrationPage }) => {
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.lastNameInput, BLANK);
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
  });

  test.fail('[AQAPRACT-518] Register with spaces in "Last name" field', async ({ registrationPage }) => {
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.SingleSpaceValue);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.SingleSpaceValue);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.lastNameError);
    await registrationPage.assertions.verifyElementToContainText(
      registrationPage.lastNameError,
      VALIDATION_MESSAGES.Required,
    );
  });
});
