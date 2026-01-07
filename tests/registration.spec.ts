import { test, expect } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import { RegistrationData } from '../types/registration';

test.describe('Registration tests', () => {
  test('AQAPRACT-507: switches between pages via links', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.openSignInPage();
    await signInPage.clickRegistrationLink();

    await expect(page).toHaveURL(/.*registration/);

    const registrationPage = new RegistrationPage(page);
    expect(await registrationPage.areFieldsEmpty()).toBe(true);
    expect(await registrationPage.submitButton.isVisible()).toBe(true);

    await registrationPage.clickSignInLink();
    await expect(page).toHaveURL(/.*login/);
    expect(await signInPage.areFieldsEmpty()).toBe(true);
  });

  test('AQAPRACT-508: registers with valid data', async ({ page }) => {
    test.setTimeout(60_000);
    const registrationPage = new RegistrationPage(page);
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

    expect(await registrationPage.isSubmitButtonActive()).toBe(true);
    await registrationPage.clickSubmitButton();

    await expect(page).toHaveURL(/.*login/);

    const signInPage = new SignInPage(page);
    await signInPage.signIn(data.email, data.password);

    const profilePage = new UserProfilePage(page);
    await profilePage.waitForPageLoad();
    expect(await profilePage.isOnProfilePage()).toBe(true);
  });
});

