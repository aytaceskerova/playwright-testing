import { test } from '../fixtures/base';
import { RegistrationData } from '../../types/registration';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import { AQA_PRACTICE_OPTIONS } from '../../data/constants/userProfileTestData';
import {
  SELECT_FILTER_VALUES,
  SELECT_DATE_VALUES,
} from '../../data/constants/selectPageTestData';
import { RegistrationTestData } from '../../data/pojos/registrationData';

test.describe('Select page', () => {
  let registeredUser: RegistrationData;

  test.beforeEach(async ({ registrationPage, signInPage, userProfilePage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.waiters.waitForUrl(URL_PATTERNS.Login);
    await signInPage.signIn(registeredUser.email, registeredUser.password);
    await userProfilePage.waitForUserProfileReady();
    await userProfilePage.actions.hover(userProfilePage.aqaPracticeButton);
    await userProfilePage.actions.click(userProfilePage.getAqaPracticeOption(AQA_PRACTICE_OPTIONS[0]));
    await userProfilePage.waiters.waitForPageReady('networkidle');
  });

  test.fail('[AQAPRACT-571] "Select" page elements validation', async ({ selectPage }) => {
    await selectPage.assertions.verifyElementToBeVisible(selectPage.backToProfileLink);
    await selectPage.assertions.verifyElementToBeVisible(selectPage.chooseYourCourseTitle);
    await selectPage.assertions.verifyElementToBeVisible(selectPage.defineStudyPreferencesSection);
    await selectPage.assertions.verifyElementToBeVisible(selectPage.selectCountryField);
    await selectPage.assertions.verifyElementToBeVisible(selectPage.selectLanguageField);
    await selectPage.assertions.verifyElementToBeVisible(selectPage.selectTypeField);
    await selectPage.assertions.verifyElementToBeVisible(selectPage.dateFromField);
    await selectPage.assertions.verifyElementToBeVisible(selectPage.dateToField);
    await selectPage.assertions.verifyElementToBeVisible(selectPage.selectCoursesSection);
    await selectPage.assertions.verifyElementToBeVisible(selectPage.searchButton);
    await selectPage.assertions.verifyElementToBeDisabled(selectPage.searchButton);
  });

  test('[AQAPRACT-572] Search for existing course', async ({ selectPage }) => {
    await selectPage.actions.selectOption(selectPage.selectTypeField, SELECT_FILTER_VALUES.Type.Testing);
    await selectPage.assertions.verifyElementToBeEnabled(selectPage.searchButton);
    await selectPage.actions.click(selectPage.searchButton);
    const courseCount = await selectPage.coursesList.count();
    await selectPage.assertions.verifyNumberToBeGreaterThan(courseCount, 0);
  });

  test('[AQAPRACT-573] Search for a non-existent course', async ({ selectPage }) => {
    await selectPage.actions.selectOption(selectPage.selectCountryField, SELECT_FILTER_VALUES.Country.Italy);
    await selectPage.assertions.verifyElementToBeEnabled(selectPage.searchButton);
    await selectPage.actions.selectOption(selectPage.selectLanguageField, SELECT_FILTER_VALUES.Language.Dutch);
    await selectPage.assertions.verifyElementToBeEnabled(selectPage.searchButton);
    await selectPage.actions.click(selectPage.searchButton);
    await selectPage.assertions.verifyElementToBeVisible(selectPage.noCoursesMessage);
  });

  test('[AQAPRACT-574] Select a country from the "Select country" drop-down list', async ({ selectPage }) => {
    await selectPage.actions.selectOption(selectPage.selectCountryField, 'USA');
    await selectPage.assertions.verifyElementToBeEnabled(selectPage.searchButton);
  });

  test('[AQAPRACT-575] Select a language from the "Select language" drop-down list', async ({ selectPage }) => {
    await selectPage.actions.selectOption(selectPage.selectLanguageField, 'English');
    await selectPage.assertions.verifyElementToBeEnabled(selectPage.searchButton);
  });

  test('[AQAPRACT-576] Select a type from the "Select type" drop-down list', async ({ selectPage }) => {
    await selectPage.actions.selectOption(selectPage.selectTypeField, 'Testing');
    await selectPage.assertions.verifyElementToBeEnabled(selectPage.searchButton);
  });

  test('[AQAPRACT-577] Ability to select a "Date from" from a date picker', async ({ selectPage }) => {
    await selectPage.actions.fill(selectPage.dateFromField, SELECT_DATE_VALUES.StartDate);
    await selectPage.assertions.verifyElementToHaveValue(selectPage.dateFromField, SELECT_DATE_VALUES.StartDate);
    await selectPage.assertions.verifyElementToBeEnabled(selectPage.searchButton);

    await selectPage.dateFromField.clear();
    await selectPage.assertions.verifyElementInputIsEmpty(selectPage.dateFromField);

    await selectPage.actions.fill(selectPage.dateFromField, SELECT_DATE_VALUES.StartDate);
    await selectPage.assertions.verifyElementToHaveValue(selectPage.dateFromField, SELECT_DATE_VALUES.StartDate);
    await selectPage.assertions.verifyElementToBeEnabled(selectPage.searchButton);
  });
});
