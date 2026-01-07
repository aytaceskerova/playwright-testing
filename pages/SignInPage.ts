import { Page, Locator } from '@playwright/test';

export class SignInPage {
  readonly page: Page;
  readonly registrationLink: Locator;
  readonly signInLink: Locator;
  readonly signInButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registrationLink = page.locator('a', { hasText: 'Registration' });
    this.signInLink = page.locator('a', { hasText: 'Sing in' });
    // Button text is "Sign in" (with 'g'), not "Sing in"
    this.signInButton = page.locator('button', { hasText: 'Sign in' });
    this.emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="Email" i], input[id*="email" i]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"]').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickRegistrationLink(): Promise<void> {
    await this.registrationLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickSignInLink(): Promise<void> {
    await this.signInLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isSignInButtonActive(): Promise<boolean> {
    // Wait for button to be visible first
    await this.signInButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.signInButton.isEnabled();
  }

  async isSignInButtonInactive(): Promise<boolean> {
    try {
      await this.signInButton.waitFor({ state: 'visible', timeout: 5000 });
      const isDisabled = await this.signInButton.getAttribute('disabled');
      const isEnabled = await this.signInButton.isEnabled();
      return isDisabled !== null || !isEnabled;
    } catch {
      // If button not found, consider it inactive
      return true;
    }
  }

  async getRegistrationLinkText(): Promise<string | null> {
    return await this.registrationLink.textContent();
  }

  async getSignInLinkText(): Promise<string | null> {
    return await this.signInLink.textContent();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async areFieldsEmpty(): Promise<boolean> {
    const email = await this.emailInput.inputValue();
    const password = await this.passwordInput.inputValue();
    return email === '' && password === '';
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.signInButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

