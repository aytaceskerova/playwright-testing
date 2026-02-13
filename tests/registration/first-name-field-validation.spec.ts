import { test } from '../fixtures/base';
import { BLANK } from '../../data/constants/commonValues';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../../data/constants/emailConstants';
import { FIELD_LENGTHS } from '../../data/constants/fieldLengths';
import { REGISTRATION_TEST_DATA } from '../../data/constants/registrationTestData';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';

test.describe('First name field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.LastName);
    await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.DateOfBirth);
    await registrationPage.actions.fill(registrationPage.emailInput, `${EMAIL_PREFIXES.Base}${Date.now()}@${EMAIL_DOMAIN}`);
    await registrationPage.actions.fill(registrationPage.passwordInput, REGISTRATION_TEST_DATA.Password);
    await registrationPage.actions.fill(registrationPage.confirmPasswordInput, REGISTRATION_TEST_DATA.ConfirmPassword);
  });

  test('[AQAPRACT-509] Register with max First name length (255 characters)', async ({ registrationPage }) => {
    const firstName255 = REGISTRATION_TEST_DATA.MinCharValue.repeat(FIELD_LENGTHS.NameMax);
    await registrationPage.actions.fill(registrationPage.firstNameInput, firstName255);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, firstName255);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await Promise.all([
      registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
      registrationPage.actions.click(registrationPage.submitButton),
    ]);
  });

  test('[AQAPRACT-510] Register with min \'First name\' length (1 character)', async ({ registrationPage }) => {
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.MinCharValue);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.MinCharValue);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await Promise.all([
      registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
      registrationPage.actions.click(registrationPage.submitButton),
    ]);
  });

  test('[AQAPRACT-511] Register with max+1 \'First name\' length (256 characters)', async ({ registrationPage }) => {
    const firstName256 = REGISTRATION_TEST_DATA.MinCharValue.repeat(FIELD_LENGTHS.NameMaxPlus);
    await registrationPage.actions.fill(registrationPage.firstNameInput, firstName256);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, firstName256);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
  });

  test('[AQAPRACT-512] Register with empty \'First name\' field', async ({ registrationPage }) => {
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, BLANK);
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
  });

  test.fail('[AQAPRACT-513] Register with spaces in \'First name\' field', async ({ registrationPage }) => {
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.SpaceValue);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.SpaceValue);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.firstNameError);
  });
});
