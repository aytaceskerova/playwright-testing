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

  test.describe('First name field validation', () => {
    const fillAllFieldsExceptFirstName = async (registrationPage: RegistrationPage) => {
      await registrationPage.fillLastName('Doe');
      await registrationPage.fillDateOfBirth('2004-09-20');
      await registrationPage.fillEmail(`test${Date.now()}@example.com`);
      await registrationPage.fillPassword('TestPassword123');
      await registrationPage.fillConfirmPassword('TestPassword123');
    };

    test('[AQAPRACT-509] Register with max First name length (255 characters)', async ({ page }) => {
      await registrationPage.openRegistrationPage();
      await fillAllFieldsExceptFirstName(registrationPage);

      const firstName255 = 'a'.repeat(255);
      await registrationPage.fillFirstName(firstName255);

      expect(await registrationPage.getFieldValue('firstName')).toBe(firstName255);
      await expect(registrationPage.submitButton).toBeEnabled();
      await registrationPage.clickSubmitButton();

      await expect(page).toHaveURL(/.*login/);
    });

    test('[AQAPRACT-510] Register with min \'First name\' length (1 character)', async ({ page }) => {
      await registrationPage.openRegistrationPage();
      await fillAllFieldsExceptFirstName(registrationPage);

      await registrationPage.fillFirstName('a');

      expect(await registrationPage.getFieldValue('firstName')).toBe('a');
      await expect(registrationPage.submitButton).toBeEnabled();
      await registrationPage.clickSubmitButton();

      await expect(page).toHaveURL(/.*login/);
    });

    test('[AQAPRACT-511] Register with max+1 \'First name\' length (256 characters)', async ({ page }) => {
      await registrationPage.openRegistrationPage();
      await fillAllFieldsExceptFirstName(registrationPage);

      const firstName256 = 'a'.repeat(256);
      await registrationPage.fillFirstName(firstName256);

      expect(await registrationPage.getFieldValue('firstName')).toBe(firstName256);
      await registrationPage.submitButton.click();

      await expect(page).toHaveURL(/.*registration/);
    });

    test('[AQAPRACT-512] Register with empty \'First name\' field', async ({ page }) => {
      await registrationPage.openRegistrationPage();
      await fillAllFieldsExceptFirstName(registrationPage);

      expect(await registrationPage.getFieldValue('firstName')).toBe('');
      await expect(registrationPage.submitButton).toBeDisabled();
      await expect(page).toHaveURL(/.*registration/);
    });

    test('[AQAPRACT-513] Register with spaces in \'First name\' field', async ({ page }) => {
      await registrationPage.openRegistrationPage();
      await fillAllFieldsExceptFirstName(registrationPage);

      await registrationPage.fillFirstName('   ');

      expect(await registrationPage.getFieldValue('firstName')).toBe('   ');
      await registrationPage.submitButton.click();

      await expect(page).toHaveURL(/.*registration/);
    });
  });
});

