import { test, expect } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import { RegistrationData } from '../types/registration';

test.describe('Registration tests', () => {
  let signInPage: SignInPage;
  let registrationPage: RegistrationPage;
  let userProfilePage: UserProfilePage;

  test.beforeEach(async ({ page }) => {
    signInPage = new SignInPage(page);
    registrationPage = new RegistrationPage(page);
    userProfilePage = new UserProfilePage(page);
  });

  test('[AQAPRACT-507] Availability of links \'Registration\' / \'Sign\' on Sign in page', async ({ page }) => {
    await signInPage.openSignInPage();
    await signInPage.registrationLink.click();
    await expect(page).toHaveURL(/.*registration/);
    await registrationPage.areFieldsEmpty();
    await expect(registrationPage.submitButton).toBeVisible();
    await registrationPage.signInLink.click();
    await expect(page).toHaveURL(/.*login/);
    await signInPage.areFieldsEmpty();
  });

  test('[AQAPRACT-508] registers with valid data', async ({ page }) => {
    await registrationPage.openRegistrationPage();
    const data: RegistrationData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123',
      confirmPassword: 'TestPassword123',
    };

    await registrationPage.fillAllFields(data);

    expect(await registrationPage.getFieldValue('firstName')).toBe(data.firstName);
    expect(await registrationPage.getFieldValue('lastName')).toBe(data.lastName);
    expect(await registrationPage.getFieldValue('email')).toBe(data.email);
    expect(await registrationPage.getFieldValue('password')).toBe(data.password);
    expect(await registrationPage.getFieldValue('confirmPassword')).toBe(data.confirmPassword);

    await expect(registrationPage.submitButton).toBeEnabled();
    await registrationPage.clickSubmitButton();
    await expect(page).toHaveURL(/.*login/);
    await signInPage.signIn(data.email, data.password);
    await userProfilePage.waitForPageLoad();
    await expect(userProfilePage.signOut).toBeVisible();
  });
});

test.describe('First name field validation', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.openRegistrationPage();
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillDateOfBirth('2004-09-20');
    await registrationPage.fillEmail(`test${Date.now()}@example.com`);
    await registrationPage.fillPassword('TestPassword123');
    await registrationPage.fillConfirmPassword('TestPassword123');
  });

  test('[AQAPRACT-509] Register with max First name length (255 characters)', async ({ page }) => {
    const firstName255 = 'a'.repeat(255);
    await registrationPage.fillFirstName(firstName255);
    expect(await registrationPage.getFieldValue('firstName')).toBe(firstName255);
    await expect(registrationPage.submitButton).toBeEnabled();
    await registrationPage.clickSubmitButton();
    await expect(page).toHaveURL(/.*login/);
  });

  test('[AQAPRACT-510] Register with min \'First name\' length (1 character)', async ({ page }) => {
    await registrationPage.fillFirstName('a');
    expect(await registrationPage.getFieldValue('firstName')).toBe('a');
    await expect(registrationPage.submitButton).toBeEnabled();
    await registrationPage.clickSubmitButton();
    await expect(page).toHaveURL(/.*login/);
  });
  
  test('[AQAPRACT-511] Register with max+1 \'First name\' length (256 characters)', async ({ page }) => {
    const firstName256 = 'a'.repeat(256);
    await registrationPage.fillFirstName(firstName256);
    expect(await registrationPage.getFieldValue('firstName')).toBe(firstName256);
    await registrationPage.submitButton.click();
    await expect(page).toHaveURL(/.*registration/);
  });

  test('[AQAPRACT-512] Register with empty \'First name\' field', async ({ page }) => {
    expect(await registrationPage.getFieldValue('firstName')).toBe('');
    await expect(registrationPage.submitButton).toBeDisabled();
    await expect(page).toHaveURL(/.*registration/);
  });

  test('[AQAPRACT-513] Register with spaces in \'First name\' field', async ({ page }) => {
    await registrationPage.fillFirstName('   ');
    expect(await registrationPage.getFieldValue('firstName')).toBe('   ');
    await registrationPage.submitButton.click();
    await expect(page).toHaveURL(/.*registration/);
    await expect(registrationPage.firstNameError).toBeVisible();
  });
});

test.describe('Last name field validation', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.openRegistrationPage();
    await registrationPage.fillFirstName('TestKai');
    await registrationPage.fillDateOfBirth('2004-09-20');
    await registrationPage.fillEmail(`test${Date.now()}@example.com`);
    await registrationPage.fillPassword('TestPassword123');
    await registrationPage.fillConfirmPassword('TestPassword123');
  });

  test('[AQAPRACT-514] Register with max \'Last name\' length (255 characters)', async ({ page }) => {
    const lastName255 = 'a'.repeat(255);
    await registrationPage.fillLastName(lastName255);
    expect(await registrationPage.getFieldValue('lastName')).toBe(lastName255);
    await expect(registrationPage.submitButton).toBeEnabled();
    await registrationPage.clickSubmitButton();
    await expect(page).toHaveURL(/.*login/);
  });

  test('[AQAPRACT-515] Register with min "Last name" length (1 character)', async ({ page }) => {
    await registrationPage.fillLastName('a');
    expect(await registrationPage.getFieldValue('lastName')).toBe('a');
    await expect(registrationPage.submitButton).toBeEnabled();
    await registrationPage.clickSubmitButton();
    await expect(page).toHaveURL(/.*login/);
  });

  test('[AQAPRACT-516] Register with max+1 "Last name" length (256 characters)', async ({ page }) => {
    const lastName256 = 'a'.repeat(256);
    await registrationPage.fillLastName(lastName256);
    expect(await registrationPage.getFieldValue('lastName')).toBe(lastName256);
    await registrationPage.submitButton.click();
    await expect(page).toHaveURL(/.*registration/);
  });

  test('[AQAPRACT-517] Register with empty "Last name" field', async ({ page }) => {
    expect(await registrationPage.getFieldValue('lastName')).toBe('');
    await expect(registrationPage.submitButton).toBeDisabled();
    await expect(page).toHaveURL(/.*registration/);
  });

  test('[AQAPRACT-518] Register with spaces in "Last name" field', async ({ page }) => {
    await registrationPage.fillLastName(' ');
    expect(await registrationPage.getFieldValue('lastName')).toBe(' ');
    await registrationPage.submitButton.click();
    await expect(page).toHaveURL(/.*registration/);
    await expect(registrationPage.lastNameError).toBeVisible();
    await expect(registrationPage.lastNameError).toContainText('Required');
  });
});

test.describe('Date of birth field validation', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.openRegistrationPage();
    await registrationPage.fillFirstName('TestKai');
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillEmail(`test${Date.now()}@example.com`);
    await registrationPage.fillPassword('TestPassword123');
    await registrationPage.fillConfirmPassword('TestPassword123');
  });

  test('[AQAPRACT-519] Register with empty "Date of birth" field', async ({ page }) => {
    expect(await registrationPage.getFieldValue('dateOfBirth')).toBe('');
    await expect(registrationPage.submitButton).toBeDisabled();
    await expect(page).toHaveURL(/.*registration/);
  });

  test('[AQAPRACT-520] The elements on the calendar picker are available', async ({ page }) => {
    await registrationPage.dateOfBirthInput.click();
    await expect(registrationPage.calendar).toBeVisible();
    const monthBeforePrev = await registrationPage.getSelectedMonth();
    await registrationPage.navigateCalendarPrev();
    const monthAfterPrev = await registrationPage.getSelectedMonth();
    expect(monthAfterPrev).not.toBe(monthBeforePrev);
    await registrationPage.navigateCalendarNext();
    const monthAfterNext = await registrationPage.getSelectedMonth();
    expect(monthAfterNext).toBe(monthBeforePrev);
    await expect(registrationPage.calendarYearDropdown).toBeVisible();
    const isYearScrollable = await registrationPage.isYearDropdownScrollable();
    expect(isYearScrollable).toBe(true);
    await registrationPage.selectYear('2026');
    const selectedYear = await registrationPage.getSelectedYear();
    expect(selectedYear).toBe('2026');
    await expect(registrationPage.calendarMonthDropdown).toBeVisible();
    const isMonthScrollable = await registrationPage.isMonthDropdownScrollable();
    expect(isMonthScrollable).toBe(true);
    await registrationPage.selectMonth('June');
    const selectedMonth = await registrationPage.getSelectedMonth();
    expect(selectedMonth).toBe('June');
    await registrationPage.selectDay();
    const dateOfBirthValue = await registrationPage.getFieldValue('dateOfBirth');
    expect(dateOfBirthValue).not.toBe('');
    expect(dateOfBirthValue).toContain('2026');
    expect(dateOfBirthValue).toContain('06');
    await registrationPage.closeCalendar();
    await expect(registrationPage.calendar).not.toBeVisible();
  });

  test('[AQAPRACT-521] The date is filled in manually in the "Date of birth" field', async () => {
    const date = '2004-09-20';
    await registrationPage.fillDateOfBirth(date);
    expect(await registrationPage.getFieldValue('dateOfBirth')).toBe('09/20/2004');
  });

  test('[AQAPRACT-522] It\'s impossible to register with the "Date of birth" in the future', async ({ page }) => {
    const futureDate = '2999-01-01';
    await registrationPage.fillDateOfBirth(futureDate);
    await registrationPage.submitButton.click();
    await expect(page).toHaveURL(/.*registration/);
    await expect(registrationPage.dateOfBirthError).toBeVisible();
  });
});

