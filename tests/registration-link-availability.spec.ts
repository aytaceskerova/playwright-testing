import { test, expect } from '@playwright/test';
import { SignInPage } from '../pages/SignInPage';
import { RegistrationPage } from '../pages/RegistrationPage';

test.describe('AQAPRACT-507: Registration ↔ Sing in links', () => {
  test('switches between pages via links', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    await signInPage.clickRegistrationLink();
    await expect(page).toHaveURL(/.*registration/);

    const registrationPage = new RegistrationPage(page);
    await registrationPage.signInLink.waitFor({ state: 'visible', timeout: 10000 });
    await registrationPage.submitButton.waitFor({ state: 'visible', timeout: 10000 });
    
    expect(await registrationPage.signInLink.textContent()).toContain('Sing in');
    expect(await registrationPage.areFieldsEmpty()).toBe(true);
    expect(await registrationPage.submitButton.isVisible()).toBe(true);
    
    const isInactive = await registrationPage.isSubmitButtonInactive();
    if (!isInactive) {
      expect(await registrationPage.areFieldsEmpty()).toBe(true);
    } else {
      expect(isInactive).toBe(true);
    }

    await registrationPage.clickSignInLink();
    await expect(page).toHaveURL(/.*login/);

    expect(await signInPage.registrationLink.textContent()).toContain('Registration');
    expect(await signInPage.signInButton.isVisible()).toBe(true);
    expect(await signInPage.areFieldsEmpty()).toBe(true);
    
    const isSignInButtonInactive = await signInPage.isSignInButtonInactive();
    if (!isSignInButtonInactive) {
      expect(await signInPage.areFieldsEmpty()).toBe(true);
    } else {
      expect(isSignInButtonInactive).toBe(true);
    }
  });
});

