import { test, expect } from '@playwright/test';
import { RegistrationPage, RegistrationData } from '../pages/RegistrationPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import { SignInPage } from '../pages/SignInPage';

test.describe('AQAPRACT-508: Successful registration', () => {
  test('registers with valid data', async ({ page }) => {
    const registration = new RegistrationPage(page);
    await registration.goto();

    const data: RegistrationData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123',
      confirmPassword: 'TestPassword123',
    };

    await registration.fillAllFields(data);

    expect(await registration.getFieldValue('firstName')).toBe(data.firstName);
    expect(await registration.getFieldValue('lastName')).toBe(data.lastName);
    expect(await registration.getFieldValue('dateOfBirth')).toBeTruthy();
    expect(await registration.getFieldValue('email')).toBe(data.email);
    expect(await registration.getFieldValue('password')).toBe(data.password);
    expect(await registration.getFieldValue('confirmPassword')).toBe(data.confirmPassword);

    expect(await registration.isSubmitButtonActive()).toBe(true);
    await registration.clickSubmitButton();

    // App redirects to Sign In after registration; log in with the new credentials.
    await expect(page).toHaveURL(/.*login/);

    const signIn = new SignInPage(page);
    await signIn.signIn(data.email, data.password);

    const profile = new UserProfilePage(page);
    await profile.waitForPageLoad();
    expect(await profile.isOnProfilePage()).toBe(true);
  });
});
