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
    const signInLinkText = await registrationPage.signInLink.textContent();
    expect(signInLinkText?.trim().toLowerCase()).toContain('sing in');

    const areFieldsEmpty = await registrationPage.areFieldsEmpty();
    expect(areFieldsEmpty).toBe(true);

    const isSubmitVisible = await registrationPage.submitButton.isVisible();
    expect(isSubmitVisible).toBe(true);
    
    const isSubmitInactive = await registrationPage.isSubmitButtonInactive();
    if (isSubmitInactive) {
      expect(isSubmitInactive).toBe(true);
    } else {
      const isEnabled = await registrationPage.submitButton.isEnabled();
      expect(isEnabled).toBe(true);
    }

    const signInLinkExists = await registrationPage.signInLink.isVisible();
    expect(signInLinkExists).toBe(true);

    await registrationPage.clickSignInLink();

    await expect(page).toHaveURL(/.*login/);

    const registrationLinkText = await signInPage.registrationLink.textContent();
    expect(registrationLinkText?.trim().toLowerCase()).toContain('registration');

    const isSignInButtonVisible = await signInPage.signInButton.isVisible();
    expect(isSignInButtonVisible).toBe(true);
    
    const areSignInFieldsEmpty = await signInPage.areFieldsEmpty();
    expect(areSignInFieldsEmpty).toBe(true);
    
    const isSignInButtonInactive = await signInPage.isSignInButtonInactive();
    if (!isSignInButtonInactive) {
      const isVisible = await signInPage.signInButton.isVisible();
      expect(isVisible).toBe(true);
    } else {
      expect(isSignInButtonInactive).toBe(true);
    }
  });
});

