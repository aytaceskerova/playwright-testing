import { test, expect } from './fixtures/base';
import { RegistrationData } from '../types/registration';
import { RegistrationTestData } from '../data/registrationData';
import { ERROR_BORDER_COLOR } from '../enums/cssPatterns';
import { PasswordTestData } from '../enums/passwordTestData';

test.describe('Registration tests', () => {
  test('[AQAPRACT-507] Availability of links \'Registration\' / \'Sign\' on Sign in page', async ({ signInPage, registrationPage }) => {
    await signInPage.openSignInPage();
    await signInPage.actions.click(signInPage.registrationLink);
    await signInPage.assertions.verifyPageToHaveUrl(/.*registration/);
    await registrationPage.areFieldsEmpty();
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.submitButton);
    await registrationPage.actions.click(registrationPage.signInLink);
    await signInPage.assertions.verifyPageToHaveUrl(/.*login/);
    await signInPage.areFieldsEmpty();
  });

  test('[AQAPRACT-508] registers with valid data', async ({ registrationPage, signInPage, userProfilePage }) => {
    await registrationPage.openRegistrationPage();
    const data: RegistrationData = new RegistrationTestData();

    await registrationPage.fillAllFields(data);
    expect(await registrationPage.getFieldValue('firstName')).toBe(data.firstName);
    expect(await registrationPage.getFieldValue('lastName')).toBe(data.lastName);
    expect(await registrationPage.getFieldValue('email')).toBe(data.email);
    expect(await registrationPage.getFieldValue('password')).toBe(data.password);
    expect(await registrationPage.getFieldValue('confirmPassword')).toBe(data.confirmPassword);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await registrationPage.clickSubmitButton();
    await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
    await signInPage.signIn(data.email, data.password);
    await userProfilePage.waitForPageLoad();
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
  });
});

test.describe('First name field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillDateOfBirth('2004-09-20');
    await registrationPage.fillEmail(`test${Date.now()}@example.com`);
    await registrationPage.fillPassword('TestPassword123');
    await registrationPage.fillConfirmPassword('TestPassword123');
  });

  test('[AQAPRACT-509] Register with max First name length (255 characters)', async ({ registrationPage }) => {
    const firstName255 = 'a'.repeat(255);
    await registrationPage.fillFirstName(firstName255);
    expect(await registrationPage.getFieldValue('firstName')).toBe(firstName255);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await registrationPage.clickSubmitButton();
    await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
  });

  test('[AQAPRACT-510] Register with min \'First name\' length (1 character)', async ({ registrationPage }) => {
    await registrationPage.fillFirstName('a');
    expect(await registrationPage.getFieldValue('firstName')).toBe('a');
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await registrationPage.clickSubmitButton();
    await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
  });
  
  test('[AQAPRACT-511] Register with max+1 \'First name\' length (256 characters)', async ({ registrationPage }) => {
    const firstName256 = 'a'.repeat(256);
    await registrationPage.fillFirstName(firstName256);
    expect(await registrationPage.getFieldValue('firstName')).toBe(firstName256);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(/.*registration/);
  });

  test('[AQAPRACT-512] Register with empty \'First name\' field', async ({ registrationPage }) => {
    expect(await registrationPage.getFieldValue('firstName')).toBe('');
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(/.*registration/);
  });

  test('[AQAPRACT-513] Register with spaces in \'First name\' field', async ({ registrationPage }) => {
    await registrationPage.fillFirstName('   ');
    expect(await registrationPage.getFieldValue('firstName')).toBe('   ');
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(/.*registration/);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.firstNameError);
  });
});

test.describe('Last name field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
    await registrationPage.fillFirstName('TestKai');
    await registrationPage.fillDateOfBirth('2004-09-20');
    await registrationPage.fillEmail(`test${Date.now()}@example.com`);
    await registrationPage.fillPassword('TestPassword123');
    await registrationPage.fillConfirmPassword('TestPassword123');
  });

  test('[AQAPRACT-514] Register with max \'Last name\' length (255 characters)', async ({ registrationPage }) => {
    const lastName255 = 'a'.repeat(255);
    await registrationPage.fillLastName(lastName255);
    expect(await registrationPage.getFieldValue('lastName')).toBe(lastName255);
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await registrationPage.clickSubmitButton();
    await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
  });

  test('[AQAPRACT-515] Register with min "Last name" length (1 character)', async ({ registrationPage }) => {
    await registrationPage.fillLastName('a');
    expect(await registrationPage.getFieldValue('lastName')).toBe('a');
    await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    await registrationPage.clickSubmitButton();
    await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
  });

  test('[AQAPRACT-516] Register with max+1 "Last name" length (256 characters)', async ({ registrationPage }) => {
    const lastName256 = 'a'.repeat(256);
    await registrationPage.fillLastName(lastName256);
    expect(await registrationPage.getFieldValue('lastName')).toBe(lastName256);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(/.*registration/);
  });

  test('[AQAPRACT-517] Register with empty "Last name" field', async ({ registrationPage }) => {
    expect(await registrationPage.getFieldValue('lastName')).toBe('');
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(/.*registration/);
  });

  test('[AQAPRACT-518] Register with spaces in "Last name" field', async ({ registrationPage }) => {
    await registrationPage.fillLastName(' ');
    expect(await registrationPage.getFieldValue('lastName')).toBe(' ');
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(/.*registration/);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.lastNameError);
    await registrationPage.assertions.verifyElementToContainText(registrationPage.lastNameError, 'Required');
  });
});

test.describe('Date of birth field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
    await registrationPage.fillFirstName('TestKai');
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillEmail(`test${Date.now()}@example.com`);
    await registrationPage.fillPassword('TestPassword123');
    await registrationPage.fillConfirmPassword('TestPassword123');
  });

  test('[AQAPRACT-519] Register with empty "Date of birth" field', async ({ registrationPage }) => {
    expect(await registrationPage.getFieldValue('dateOfBirth')).toBe('');
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(/.*registration/);
  });

  test('[AQAPRACT-520] The elements on the calendar picker are available', async ({ registrationPage }) => {
    await test.step('Open calendar', async () => {
      await registrationPage.actions.click(registrationPage.dateOfBirthInput);
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendar);
    });

    await test.step('Navigate months with arrows', async () => {
      const monthBeforePrev = await registrationPage.getSelectedMonth();
      await registrationPage.navigateCalendarPrev();
      const monthAfterPrev = await registrationPage.getSelectedMonth();
      expect(monthAfterPrev).not.toBe(monthBeforePrev);
      await registrationPage.navigateCalendarNext();
      const monthAfterNext = await registrationPage.getSelectedMonth();
      expect(monthAfterNext).toBe(monthBeforePrev);
    });

    await test.step('Select year from dropdown', async () => {
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendarYearDropdown);
      await registrationPage.validateYearDropdownScrollable();
      await registrationPage.selectYear('2026');
      const selectedYear = await registrationPage.getSelectedYear();
      expect(selectedYear).toBe('2026');
    });

    await test.step('Select month from dropdown', async () => {
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendarMonthDropdown);
      await registrationPage.validateMonthDropdownScrollable();
      await registrationPage.selectMonth('June');
      const selectedMonth = await registrationPage.getSelectedMonth();
      expect(selectedMonth).toBe('June');
    });

    await test.step('Select day and verify date input', async () => {
      await registrationPage.selectDay();
      const dateOfBirthValue = await registrationPage.getFieldValue('dateOfBirth');
      expect(dateOfBirthValue).not.toBe('');
      expect(dateOfBirthValue).toContain('2026');
      expect(dateOfBirthValue).toContain('06');
    });

    await test.step('Close calendar', async () => {
      await registrationPage.closeCalendar();
      await registrationPage.assertions.verifyElementNotVisible(registrationPage.calendar);
    });
  });

  test('[AQAPRACT-521] The date is filled in manually in the "Date of birth" field', async ({ registrationPage }) => {
    const date = '2004-09-20';
    await registrationPage.fillDateOfBirth(date);
    expect(await registrationPage.getFieldValue('dateOfBirth')).toBe('09/20/2004');
  });

  test('[AQAPRACT-522] It\'s impossible to register with the "Date of birth" in the future', async ({ registrationPage }) => {
    const futureDate = '2999-01-01';
    await registrationPage.fillDateOfBirth(futureDate);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(/.*registration/);
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
    await registrationPage.navigateCalendarPrev();
    const monthAfterPrev = await registrationPage.getSelectedMonth();
    expect(monthAfterPrev).not.toBe(monthBefore);
    await registrationPage.navigateCalendarNext();
    const monthAfterNext = await registrationPage.getSelectedMonth();
    expect(monthAfterNext).toBe(monthBefore);
  });

  test('[AQAPRACT-746] Year drop down is possible to be opened', async ({ registrationPage }) => {
    await test.step('Click the "Year" dropdown', async () => {
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendarYearDropdown);
      await registrationPage.actions.click(registrationPage.calendarYearDropdown);
      const yearOptions = registrationPage.calendarYearDropdown.locator('option');
      const yearCount = await yearOptions.count();
      expect(yearCount).toBeGreaterThan(1);
    });
    await test.step('Scroll down the list', async () => {
      const yearOptions = registrationPage.calendarYearDropdown.locator('option');
      const lastIndex = (await yearOptions.count()) - 1;
      await registrationPage.actions.selectOption(registrationPage.calendarYearDropdown, { index: lastIndex });
      const selectedYear = await registrationPage.getSelectedYear();
      expect(selectedYear).not.toBe('');
    });
  });
  test('[AQAPRACT-747] The year is possible to be selected in the drop down', async ({ registrationPage }) => {
    await test.step('Scroll down the years', async () => {
      const yearOptions = registrationPage.calendarYearDropdown.locator('option');
      const lastIndex = (await yearOptions.count()) - 1;
      await registrationPage.actions.selectOption(registrationPage.calendarYearDropdown, { index: lastIndex });
      const selectedYear = await registrationPage.getSelectedYear();
      expect(selectedYear).not.toBe('');
    });
    await test.step('Select any year', async () => {
      await registrationPage.selectYear('2026');
      const selectedYear = await registrationPage.getSelectedYear();
      expect(selectedYear).toBe('2026');
    });
  });

  test('[AQAPRACT-748] Month drop down is possible to be opened', async ({ registrationPage }) => {
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.calendarMonthDropdown);
    await registrationPage.actions.click(registrationPage.calendarMonthDropdown);
    const monthOptions = registrationPage.calendarMonthDropdown.locator('option');
    const monthCount = await monthOptions.count();
    expect(monthCount).toBeGreaterThan(1);
  });
  test('[AQAPRACT-749] The month is possible to be selected in the drop down', async ({ registrationPage }) => {
    await registrationPage.selectMonth('June');
    const selectedMonth = await registrationPage.getSelectedMonth();
    expect(selectedMonth).toBe('June');
  });
  test('[AQAPRACT-750] The date is possible to be selected', async ({ registrationPage }) => {
    await registrationPage.selectYear('2026');
    await registrationPage.selectMonth('June');
    await registrationPage.selectDay();
    const dateOfBirthValue = await registrationPage.getFieldValue('dateOfBirth');
    expect(dateOfBirthValue).not.toBe('');
    await registrationPage.assertions.verifyElementNotVisible(registrationPage.calendar);
  });
});

test.describe('Email field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
    await registrationPage.fillFirstName('TestKai');
    await registrationPage.fillLastName('Egv');
    await registrationPage.fillDateOfBirth('2004-09-20');
    await registrationPage.fillPassword('TestPassword123');
    await registrationPage.fillConfirmPassword('TestPassword123');
  });

  test('[AQAPRACT-523] Register with empty "Email" field', async ({ registrationPage }) => {
    expect(await registrationPage.getFieldValue('email')).toBe('');
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(/.*registration/);
  });

  test('[AQAPRACT-524] Register with invalid format of email address', async ({ registrationPage }) => {
    await test.step('Input "Abc" value and focus out', async () => {
      await registrationPage.fillEmail('Abc');
      await registrationPage.actions.blur(registrationPage.emailInput);
      expect(await registrationPage.getFieldValue('email')).toBe('Abc');
      await registrationPage.assertions.verifyElementToHaveCss(registrationPage.emailInput, 'border-color', ERROR_BORDER_COLOR);
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.emailError);
      await registrationPage.assertions.verifyElementToContainText(registrationPage.emailError, 'Invalid email address');
    });
    await test.step('Input "Abc@abc@abc" value and focus out', async () => {
      await registrationPage.fillEmail('Abc@abc@abc');
      await registrationPage.actions.blur(registrationPage.emailInput);
      expect(await registrationPage.getFieldValue('email')).toBe('Abc@abc@abc');
      await registrationPage.assertions.verifyElementToHaveCss(registrationPage.emailInput, 'border-color', ERROR_BORDER_COLOR);
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.emailError);
      await registrationPage.assertions.verifyElementToContainText(registrationPage.emailError, 'Invalid email address');
    });
    await test.step('Input "Abc abc@abc" value and focus out', async () => {
      await registrationPage.fillEmail('Abc abc@abc');
      await registrationPage.actions.blur(registrationPage.emailInput);
      expect(await registrationPage.getFieldValue('email')).toBe('Abc abc@abc');
      await registrationPage.assertions.verifyElementToHaveCss(registrationPage.emailInput, 'border-color', ERROR_BORDER_COLOR);
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.emailError);
      await registrationPage.assertions.verifyElementToContainText(registrationPage.emailError, 'Invalid email address');
    });
    await test.step('Input "dsf()ds@ds" value and focus out', async () => {
      await registrationPage.fillEmail('dsf()ds@ds');
      await registrationPage.actions.blur(registrationPage.emailInput);
      expect(await registrationPage.getFieldValue('email')).toBe('dsf()ds@ds');
      await registrationPage.assertions.verifyElementToHaveCss(registrationPage.emailInput, 'border-color', ERROR_BORDER_COLOR);
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.emailError);
      await registrationPage.assertions.verifyElementToContainText(registrationPage.emailError, 'Invalid email address');
    });
  });

  test('[AQAPRACT-525] Register with already existed email', async ({ registrationPage }) => {
    const existingEmail = `existing${Date.now()}@example.com`;
    await test.step('Register user with email', async () => {
      await registrationPage.fillEmail(existingEmail);
      await registrationPage.clickSubmitButton();
      await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
    });
    await test.step('Enter already registered email', async () => {
      await registrationPage.openRegistrationPage();
      await registrationPage.fillFirstName('TestKai');
      await registrationPage.fillLastName('Egv');
      await registrationPage.fillDateOfBirth('2004-09-20');
      await registrationPage.fillPassword('TestPassword123');
      await registrationPage.fillConfirmPassword('TestPassword123');
      await registrationPage.fillEmail(existingEmail);
      expect(await registrationPage.getFieldValue('email')).toBe(existingEmail);
      await registrationPage.assertions.verifyElementToBeEnabled(registrationPage.submitButton);
    });
    await test.step('Click on the Submit button', async () => {
      await registrationPage.clickSubmitButton();
      await registrationPage.assertions.verifyElementToBeVisible(registrationPage.emailError);
      await registrationPage.assertions.verifyElementToContainText(registrationPage.emailError, 'User with email address already exist');
      await registrationPage.assertions.verifyPageToHaveUrl(/.*registration/);
    });
  });
});

test.describe('Password field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
    await registrationPage.fillFirstName('TestKai');
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillDateOfBirth('2004-09-20');
    await registrationPage.fillEmail(`test${Date.now()}@example.com`);
  });
  test('[AQAPRACT-526] Register with min \'Password\' length (8 characters)', async ({ registrationPage, signInPage, userProfilePage }) => {
    const password8 = PasswordTestData.Min;
    const email = await registrationPage.getFieldValue('email');
    await test.step('Enter 8 characters in "Password" field', async () => {
      await registrationPage.fillPassword(password8);
      expect(await registrationPage.getFieldValue('password')).toBe(password8);
    });
    await test.step('Enter the same 8 characters from the first step in the "Confirm password" field', async () => {
      await registrationPage.fillConfirmPassword(password8);
      expect(await registrationPage.getFieldValue('confirmPassword')).toBe(password8);
    });
    await test.step('Click the "Submit" button', async () => {
      await registrationPage.clickSubmitButton();
      await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
      await signInPage.signIn(email, password8);
      await userProfilePage.waitForPageLoad();
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
    });
  });
  test('[AQAPRACT-527] Register with max "Password" length (20 characters)', async ({ registrationPage, signInPage, userProfilePage }) => {
    const password20 = PasswordTestData.Max;
    const email = await registrationPage.getFieldValue('email');
    await test.step('Enter 20 characters to the "Password" field', async () => {
      await registrationPage.fillPassword(password20);
      expect(await registrationPage.getFieldValue('password')).toBe(password20);
    });
    await test.step('Enter the same 20 characters from the first step in the "Confirm password" field', async () => {
      await registrationPage.fillConfirmPassword(password20);
      expect(await registrationPage.getFieldValue('confirmPassword')).toBe(password20);
    });
    await test.step('Click the "Submit" button', async () => {
      await registrationPage.clickSubmitButton();
      await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
      await signInPage.signIn(email, password20);
      await userProfilePage.waitForPageLoad();
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
    });
  });
  test('[AQAPRACT-528] Register with min-1 "Password" length (7 characters)', async ({ registrationPage }) => {
    const password7 = PasswordTestData.MinMinus;
    await registrationPage.fillPassword(password7);
    await registrationPage.actions.blur(registrationPage.passwordInput);
    expect(await registrationPage.getFieldValue('password')).toBe(password7);
    await registrationPage.assertions.verifyElementToHaveCss(registrationPage.passwordInput, 'border-color', ERROR_BORDER_COLOR);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.passwordError);
    await registrationPage.assertions.verifyElementToContainText(registrationPage.passwordError, 'Minimum 8 characters');
  });
  test('[AQAPRACT-529] Register with max+1 "Password" length (21 characters)', async ({ registrationPage }) => {
    const password21 = PasswordTestData.MaxPlus;
    await registrationPage.fillPassword(password21);
    await registrationPage.actions.blur(registrationPage.passwordInput);
    expect(await registrationPage.getFieldValue('password')).toBe(password21);
    await registrationPage.assertions.verifyElementToHaveCss(registrationPage.passwordInput, 'border-color', ERROR_BORDER_COLOR);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.passwordError);
    await registrationPage.assertions.verifyElementToContainText(registrationPage.passwordError, 'Maximum 20 characters');
  });
  test('[AQAPRACT-530] Register with empty "Password" field', async ({ registrationPage }) => {
    await registrationPage.actions.focus(registrationPage.passwordInput);
    await registrationPage.actions.blur(registrationPage.passwordInput);
    expect(await registrationPage.getFieldValue('password')).toBe('');
    await registrationPage.assertions.verifyElementToBeDisabled(registrationPage.submitButton);
  });
});

test.describe('Confirm password field validation', () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.openRegistrationPage();
    await registrationPage.fillFirstName('TestKai');
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillDateOfBirth('2004-09-20');
    await registrationPage.fillEmail(`test${Date.now()}@example.com`);
    await registrationPage.fillPassword('TestPassword123');
  });

  test('[AQAPRACT-531] Register with equal data "Password" and "Confirm password" fields', async ({ registrationPage, signInPage, userProfilePage }) => {
    const password = 'TestPassword123';
    const email = await registrationPage.getFieldValue('email');
    await test.step('Enter the same data from the field "Password" in the "Confirm password" field', async () => {
      await registrationPage.fillConfirmPassword(password);
      expect(await registrationPage.getFieldValue('confirmPassword')).toBe(password);
    });
    await test.step('Click the "Submit" button', async () => {
      await registrationPage.clickSubmitButton();
      await registrationPage.assertions.verifyPageToHaveUrl(/.*login/);
      await signInPage.signIn(email, password);
      await userProfilePage.waitForPageLoad();
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
    });
  });

  test('[AQAPRACT-532] Register with different data in "Password" and "Confirm password" fields', async ({ registrationPage }) => {
    await registrationPage.fillConfirmPassword(PasswordTestData.ConfirmMismatch);
    await registrationPage.actions.blur(registrationPage.confirmPasswordInput);
    expect(await registrationPage.getFieldValue('confirmPassword')).toBe(PasswordTestData.ConfirmMismatch);
    await registrationPage.assertions.verifyElementToHaveCss(registrationPage.confirmPasswordInput, 'border-color', ERROR_BORDER_COLOR);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.confirmPasswordError);
    await registrationPage.assertions.verifyElementToContainText(registrationPage.confirmPasswordError, 'Passwords must match');
  });

  test('[AQAPRACT-533] Register with empty "Confirm password" field', async ({ registrationPage }) => {
    await registrationPage.actions.focus(registrationPage.confirmPasswordInput);
    await registrationPage.actions.blur(registrationPage.confirmPasswordInput);
    expect(await registrationPage.getFieldValue('confirmPassword')).toBe('');
    await registrationPage.assertions.verifyElementToHaveCss(registrationPage.confirmPasswordInput, 'border-color', ERROR_BORDER_COLOR);
    await registrationPage.assertions.verifyElementToBeVisible(registrationPage.confirmPasswordError);
    await registrationPage.assertions.verifyElementToContainText(registrationPage.confirmPasswordError, 'Required');
  });
});
