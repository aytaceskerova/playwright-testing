import { test } from '../fixtures/base';
import { BLANK } from '../../data/constants/commonValues';
import { REGISTRATION_TEST_DATA } from '../../data/constants/registrationTestData';
import { URL_PATHS } from '../../data/constants/urlPaths';

test.describe('Calendar validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.actions.click(registrationPage.dateOfBirthInput);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendar);
  });

  test('[AQAPRACT-745] Month navigators switch months', async ({ registrationPage }) => {
    const monthBefore = await registrationPage.getSelectedMonth();
    await registrationPage.actions.click(registrationPage.calendarPrevButton);
    const monthAfterPrev = await registrationPage.getSelectedMonth();
    await registrationPage.assertions.verifyValueNotToBe(monthAfterPrev, monthBefore);
    await registrationPage.actions.click(registrationPage.calendarNextButton);
    const monthAfterNext = await registrationPage.getSelectedMonth();
    await registrationPage.assertions.verifyValueToBe(monthAfterNext, monthBefore);
  });

  test('[AQAPRACT-746] Year drop down is possible to be opened', async ({ registrationPage }) => {
    await test.step('Click the "Year" dropdown', async () => {
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendarYearDropdown);
      await registrationPage.actions.click(registrationPage.calendarYearDropdown);
      const yearOptions = registrationPage.calendarYearDropdown.locator('option');
      const yearCount = await yearOptions.count();
      await registrationPage.assertions.verifyNumberToBeGreaterThan(yearCount, 1);
    });
    await test.step('Scroll down the list', async () => {
      const yearOptions = registrationPage.calendarYearDropdown.locator('option');
      const lastIndex = (await yearOptions.count()) - 1;
      await registrationPage.actions.selectOption(registrationPage.calendarYearDropdown, { index: lastIndex });
      const selectedYear = await registrationPage.getSelectedYear();
      await registrationPage.assertions.verifyValueNotToBe(selectedYear, BLANK);
    });
  });

  test('[AQAPRACT-747] The year is possible to be selected in the drop down', async ({ registrationPage }) => {
    await test.step('Scroll down the years', async () => {
      const yearOptions = registrationPage.calendarYearDropdown.locator('option');
      const lastIndex = (await yearOptions.count()) - 1;
      await registrationPage.actions.selectOption(registrationPage.calendarYearDropdown, { index: lastIndex });
      const selectedYear = await registrationPage.getSelectedYear();
      await registrationPage.assertions.verifyValueNotToBe(selectedYear, BLANK);
    });
    await test.step('Select any year', async () => {
      await registrationPage.selectYear(REGISTRATION_TEST_DATA.CalendarYear);
      const selectedYear = await registrationPage.getSelectedYear();
      await registrationPage.assertions.verifyValueToBe(selectedYear, REGISTRATION_TEST_DATA.CalendarYear);
    });
  });

  test('[AQAPRACT-748] Month drop down is possible to be opened', async ({ registrationPage }) => {
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendarMonthDropdown);
    await registrationPage.actions.click(registrationPage.calendarMonthDropdown);
    const monthOptions = registrationPage.calendarMonthDropdown.locator('option');
    const monthCount = await monthOptions.count();
    await registrationPage.assertions.verifyNumberToBeGreaterThan(monthCount, 1);
  });

  test('[AQAPRACT-749] The month is possible to be selected in the drop down', async ({ registrationPage }) => {
    await registrationPage.selectMonth(REGISTRATION_TEST_DATA.CalendarMonth);
    const selectedMonth = await registrationPage.getSelectedMonth();
    await registrationPage.assertions.verifyValueToBe(selectedMonth, REGISTRATION_TEST_DATA.CalendarMonth);
  });

  test.fail('[AQAPRACT-750] The date is possible to be selected', async ({ registrationPage }) => {
    await registrationPage.selectYear(REGISTRATION_TEST_DATA.CalendarYear);
    await registrationPage.selectMonth(REGISTRATION_TEST_DATA.CalendarMonth);
    await registrationPage.selectDay();
    const dateOfBirthValue = await registrationPage.getFieldValue('dateOfBirth');
    await registrationPage.assertions.verifyValueNotToBe(dateOfBirthValue, BLANK);
    await registrationPage.assertions.verifyElementNotVisible(registrationPage.calendar);
  });
});
