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
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickSignInLink(): Promise<void> {
    await this.signInLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isSignInButtonActive(): Promise<boolean> {
    await this.signInButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.signInButton.isEnabled();
  }

  async isSignInButtonInactive(): Promise<boolean> {
    try {
      await this.signInButton.waitFor({ state: 'visible', timeout: 5000 });
      const isDisabled = await this.signInButton.getAttribute('disabled');
      const ariaDisabled = await this.signInButton.getAttribute('aria-disabled');
      const isEnabled = await this.signInButton.isEnabled();
      const hasDisabledClass = await this.signInButton.evaluate((el) => 
        el.classList.contains('disabled') || el.classList.contains('Mui-disabled')
      );
      return isDisabled !== null || ariaDisabled === 'true' || hasDisabledClass || !isEnabled;
    } catch {
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
    await this.page.waitForLoadState('domcontentloaded');
  }
}
