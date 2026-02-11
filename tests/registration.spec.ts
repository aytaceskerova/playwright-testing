import { test } from './fixtures/base';
import { RegistrationData } from '../types/registration';
import { ERROR_BORDER_COLOR } from '../data/constants/cssPatterns';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../data/constants/emailConstants';
import { FIELD_LENGTHS } from '../data/constants/fieldLengths';
import { REGISTRATION_TEST_DATA } from '../data/constants/registrationTestData';
import { URL_PATTERNS } from '../data/constants/urlPatterns';
import { VALIDATION_MESSAGES } from '../data/constants/validationMessages';
import { InvalidEmailTestData } from '../data/enums/emailTestData';
import { KeyboardKey } from '../data/enums/keyboardKeys';
import { PasswordTestData } from '../data/enums/passwordTestData';
import { RegistrationTestData } from '../data/pojos/registrationData';

test.describe('Registration tests', () => {
  test('[AQAPRACT-507] Availability of links \'Registration\' / \'Sign\' on Sign in page', async ({ signInPage, registrationPage }) => {
    await signInPage.openSignInPage();
    await signInPage.actions.click(signInPage.registrationLink);
    await signInPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
    await registrationPage.areFieldsEmpty();
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.submitButton);
    await registrationPage.actions.click(registrationPage.signInLink);
    await signInPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
    await signInPage.areFieldsEmpty();
  });

  test('[AQAPRACT-508] registers with valid data', async ({ registrationPage, signInPage, userProfilePage }) => {
    await registrationPage.openRegistrationPage();
    const data: RegistrationData = new RegistrationTestData();

    await registrationPage.fillAllFields(data);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, data.firstName);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.lastNameInput, data.lastName);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.emailInput, data.email);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.passwordInput, data.password);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, data.confirmPassword);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
    await signInPage.signIn(data.email, data.password);
    await userProfilePage.waitForUserProfileReady();
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
  });
});

test.describe('First name field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
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
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
  });

  test('[AQAPRACT-510] Register with min \'First name\' length (1 character)', async ({ registrationPage }) => {
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.MinCharValue);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.MinCharValue);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
  });
  
  test('[AQAPRACT-511] Register with max+1 \'First name\' length (256 characters)', async ({ registrationPage }) => {
    const firstName256 = REGISTRATION_TEST_DATA.MinCharValue.repeat(FIELD_LENGTHS.NameMaxPlus);
    await registrationPage.actions.fill(registrationPage.firstNameInput, firstName256);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, firstName256);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
  });

  test('[AQAPRACT-512] Register with empty \'First name\' field', async ({ registrationPage }) => {
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, '');
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
  });

  test('[AQAPRACT-513] Register with spaces in \'First name\' field', async ({ registrationPage }) => {
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.SpaceValue);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.SpaceValue);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.firstNameError);
  });
});

test.describe('Last name field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
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
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
  });

  test('[AQAPRACT-515] Register with min "Last name" length (1 character)', async ({ registrationPage }) => {
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.MinCharValue);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.MinCharValue);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
  });

  test('[AQAPRACT-516] Register with max+1 "Last name" length (256 characters)', async ({ registrationPage }) => {
    const lastName256 = REGISTRATION_TEST_DATA.MinCharValue.repeat(FIELD_LENGTHS.NameMaxPlus);
    await registrationPage.actions.fill(registrationPage.lastNameInput, lastName256);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.lastNameInput, lastName256);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
  });

  test('[AQAPRACT-517] Register with empty "Last name" field', async ({ registrationPage }) => {
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.lastNameInput, '');
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
  });

  test('[AQAPRACT-518] Register with spaces in "Last name" field', async ({ registrationPage }) => {
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

test.describe('Date of birth field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.FirstName);
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.LastName);
    await registrationPage.actions.fill(registrationPage.emailInput, `${EMAIL_PREFIXES.Base}${Date.now()}@${EMAIL_DOMAIN}`);
    await registrationPage.actions.fill(registrationPage.passwordInput, REGISTRATION_TEST_DATA.Password);
    await registrationPage.actions.fill(registrationPage.confirmPasswordInput, REGISTRATION_TEST_DATA.ConfirmPassword);
  });

  test('[AQAPRACT-519] Register with empty "Date of birth" field', async ({ registrationPage }) => {
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.dateOfBirthInput, '');
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
      await registrationPage.assertions.verifyValueNotToBe(dateOfBirthValue, '');
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

  test('[AQAPRACT-522] It\'s impossible to register with the "Date of birth" in the future', async ({ registrationPage }) => {
    await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.FutureDateOfBirth);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Registration);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.dateOfBirthError);
  });
});

test.describe('Calendar validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
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
      await registrationPage.assertions.verifyValueNotToBe(selectedYear, '');
    });
  });
  test('[AQAPRACT-747] The year is possible to be selected in the drop down', async ({ registrationPage }) => {
    await test.step('Scroll down the years', async () => {
      const yearOptions = registrationPage.calendarYearDropdown.locator('option');
      const lastIndex = (await yearOptions.count()) - 1;
      await registrationPage.actions.selectOption(registrationPage.calendarYearDropdown, { index: lastIndex });
      const selectedYear = await registrationPage.getSelectedYear();
      await registrationPage.assertions.verifyValueNotToBe(selectedYear, '');
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
  test('[AQAPRACT-750] The date is possible to be selected', async ({ registrationPage }) => {
    await registrationPage.selectYear(REGISTRATION_TEST_DATA.CalendarYear);
    await registrationPage.selectMonth(REGISTRATION_TEST_DATA.CalendarMonth);
    await registrationPage.selectDay();
    const dateOfBirthValue = await registrationPage.getFieldValue('dateOfBirth');
    await registrationPage.assertions.verifyValueNotToBe(dateOfBirthValue, '');
    await registrationPage.assertions.verifyElementNotVisible(registrationPage.calendar);
  });
});

test.describe('Email field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
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

  test('[AQAPRACT-525] Register with already existed email', async ({ registrationPage }) => {
    const existingEmail = `${EMAIL_PREFIXES.Existing}${Date.now()}@${EMAIL_DOMAIN}`;
    await test.step('Register user with email', async () => {
      await registrationPage.actions.fill(registrationPage.emailInput, existingEmail);
      await registrationPage.actions.click(registrationPage.submitButton);
      await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
    });
    await test.step('Enter already registered email', async () => {
      await registrationPage.openRegistrationPage();
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

test.describe('Password field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.FirstName);
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.LastName);
    await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.DateOfBirth);
    await registrationPage.actions.fill(registrationPage.emailInput, `${EMAIL_PREFIXES.Base}${Date.now()}@${EMAIL_DOMAIN}`);
  });
  test('[AQAPRACT-526] Register with min \'Password\' length (8 characters)', async ({ registrationPage, signInPage, userProfilePage }) => {
    const password8 = PasswordTestData.Min;
    const email = await registrationPage.getFieldValue('email');
    await test.step('Enter 8 characters in "Password" field', async () => {
      await registrationPage.actions.fill(registrationPage.passwordInput, password8);
      await registrationPage.assertions.verifyElementToHaveValue(registrationPage.passwordInput, password8);
    });
    await test.step('Enter the same 8 characters from the first step in the "Confirm password" field', async () => {
      await registrationPage.actions.fill(registrationPage.confirmPasswordInput, password8);
      await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, password8);
    });
    await test.step('Click the "Submit" button', async () => {
      await registrationPage.actions.click(registrationPage.submitButton);
      await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
      await signInPage.signIn(email, password8);
      await userProfilePage.waitForUserProfileReady();
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
    });
  });
  test('[AQAPRACT-527] Register with max "Password" length (20 characters)', async ({ registrationPage, signInPage, userProfilePage }) => {
    const password20 = PasswordTestData.Max;
    const email = await registrationPage.getFieldValue('email');
    await test.step('Enter 20 characters to the "Password" field', async () => {
      await registrationPage.actions.fill(registrationPage.passwordInput, password20);
      await registrationPage.assertions.verifyElementToHaveValue(registrationPage.passwordInput, password20);
    });
    await test.step('Enter the same 20 characters from the first step in the "Confirm password" field', async () => {
      await registrationPage.actions.fill(registrationPage.confirmPasswordInput, password20);
      await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, password20);
    });
    await test.step('Click the "Submit" button', async () => {
      await registrationPage.actions.click(registrationPage.submitButton);
      await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
      await signInPage.signIn(email, password20);
      await userProfilePage.waitForUserProfileReady();
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
    });
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

test.describe('Confirm password field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
    await registrationPage.actions.fill(registrationPage.firstNameInput, REGISTRATION_TEST_DATA.FirstName);
    await registrationPage.actions.fill(registrationPage.lastNameInput, REGISTRATION_TEST_DATA.LastName);
    await registrationPage.fillDateOfBirth(REGISTRATION_TEST_DATA.DateOfBirth);
    await registrationPage.actions.fill(registrationPage.emailInput, `${EMAIL_PREFIXES.Base}${Date.now()}@${EMAIL_DOMAIN}`);
    await registrationPage.actions.fill(registrationPage.passwordInput, REGISTRATION_TEST_DATA.Password);
  });

  test('[AQAPRACT-531] Register with equal data "Password" and "Confirm password" fields', async ({ registrationPage, signInPage, userProfilePage }) => {
    const password = REGISTRATION_TEST_DATA.Password;
    const email = await registrationPage.getFieldValue('email');
    await test.step('Enter the same data from the field "Password" in the "Confirm password" field', async () => {
      await registrationPage.actions.fill(registrationPage.confirmPasswordInput, password);
      await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, password);
    });
    await test.step('Click the "Submit" button', async () => {
      await registrationPage.actions.click(registrationPage.submitButton);
      await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
      await signInPage.signIn(email, password);
      await userProfilePage.waitForUserProfileReady();
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
    });
  });

  test('[AQAPRACT-532] Register with different data in "Password" and "Confirm password" fields', async ({ registrationPage }) => {
    await registrationPage.actions.fill(registrationPage.confirmPasswordInput, PasswordTestData.ConfirmMismatch);
    await registrationPage.actions.blur(registrationPage.confirmPasswordInput);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, PasswordTestData.ConfirmMismatch);
    await registrationPage.assertions.verifyElementToHaveCss(registrationPage.confirmPasswordInput, 'border-color', ERROR_BORDER_COLOR);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.confirmPasswordError);
    await registrationPage.assertions.verifyElementToContainText(
      registrationPage.confirmPasswordError,
      VALIDATION_MESSAGES.PasswordsMustMatch,
    );
  });

  test('[AQAPRACT-533] Register with empty "Confirm password" field', async ({ registrationPage }) => {
    await registrationPage.actions.focus(registrationPage.confirmPasswordInput);
    await registrationPage.actions.blur(registrationPage.confirmPasswordInput);
    await registrationPage.assertions.verifyElementToHaveValue(registrationPage.confirmPasswordInput, '');
    await registrationPage.assertions.verifyElementToHaveCss(registrationPage.confirmPasswordInput, 'border-color', ERROR_BORDER_COLOR);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.confirmPasswordError);
    await registrationPage.assertions.verifyElementToContainText(
      registrationPage.confirmPasswordError,
      VALIDATION_MESSAGES.Required,
    );
  });
});
