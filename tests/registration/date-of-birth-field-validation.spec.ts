import { test } from '../fixtures/base';
import { BLANK } from '../../data/constants/commonValues';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../../data/constants/emailConstants';
import { REGISTRATION_TEST_DATA } from '../../data/constants/registrationTestData';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import { KeyboardKey } from '../../data/enums/keyboardKeys';

test.describe('Date of birth field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.FirstName);
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.LastName);
    await registrationPage.actions.fill(registrationPage.emailInput, `${EMAIL_PREFIXES.Base}${Date.now()}@${EMAIL_DOMAIN}`);
    await registrationPage.actions.fill(registrationPage.passwordInput, REGISTRATION_TEST_DATA.Password);
    await registrationPage.actions.fill(registrationPage.confirmPasswordInput, REGISTRATION_TEST_DATA.ConfirmPassword);
  });

  test('[AQAPRACT-519] Register with empty "Date of birth" field', async ({ registrationPage }) => {
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.dateOfBirthInput, BLANK);
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
  });

  test('[AQAPRACT-520] The elements on the calendar picker are available', async ({ registrationPage }) => {
    await test.step('Open calendar', async () => {
      await registrationPage.actions.click(registrationPage.dateOfBirthInput);
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendar);
    });

    await test.step('Navigate months with arrows', async () => {
      const monthBeforePrev = await registrationPage.getSelectedMonth();
      await registrationPage.actions.click(registrationPage.calendarPrevButton);
      const monthAfterPrev = await registrationPage.getSelectedMonth();
      await registrationPage.assertions.verifyValueNotToBe(monthAfterPrev, monthBeforePrev);
      await registrationPage.actions.click(registrationPage.calendarNextButton);
      const monthAfterNext = await registrationPage.getSelectedMonth();
      await registrationPage.assertions.verifyValueToBe(monthAfterNext, monthBeforePrev);
    });

    await test.step('Select year from dropdown', async () => {
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendarYearDropdown);
      await registrationPage.validateYearDropdownScrollable();
      await registrationPage.selectYear(REGISTRATION_TEST_DATA.CalendarYear);
      const selectedYear = await registrationPage.getSelectedYear();
      await registrationPage.assertions.verifyValueToBe(selectedYear, REGISTRATION_TEST_DATA.CalendarYear);
    });

    await test.step('Select month from dropdown', async () => {
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendarMonthDropdown);
      await registrationPage.validateMonthDropdownScrollable();
      await registrationPage.selectMonth(REGISTRATION_TEST_DATA.CalendarMonth);
      const selectedMonth = await registrationPage.getSelectedMonth();
      await registrationPage.assertions.verifyValueToBe(selectedMonth, REGISTRATION_TEST_DATA.CalendarMonth);
    });

    await test.step('Select day and verify date input', async () => {
      await registrationPage.selectDay();
      const dateOfBirthValue = await registrationPage.getFieldValue('dateOfBirth');
      await registrationPage.assertions.verifyValueNotToBe(dateOfBirthValue, BLANK);
      await registrationPage.assertions.verifyValueToContain(dateOfBirthValue, REGISTRATION_TEST_DATA.CalendarYear);
      await registrationPage.assertions.verifyValueToContain(dateOfBirthValue, REGISTRATION_TEST_DATA.CalendarMonthNumeric);
    });

    await test.step('Close calendar', async () => {
      await registrationPage.actions.pressKey(KeyboardKey.Escape);
      await registrationPage.assertions.verifyElementNotVisible(registrationPage.calendar);
    });
  });

  test('[AQAPRACT-521] The date is filled in manually in the "Date of birth" field', async ({ registrationPage }) => {
    await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.ManualDateInput);
    await registrationPage.assertions.verifyElementToHaveValue(
      registrationPage.dateOfBirthInput,
      REGISTRATION_TEST_DATA.ManualDateOutput,
    );
  });

  test.fail('[AQAPRACT-522] It\'s impossible to register with the "Date of birth" in the future', async ({ registrationPage }) => {
    await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.FutureDateOfBirth);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.dateOfBirthError);
  });
});
