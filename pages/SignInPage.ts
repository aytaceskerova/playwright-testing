import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignInPage extends BasePage {
  readonly registrationLink: Locator;
  readonly signInLink: Locator;
  readonly signInButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  constructor(page: BasePage['page']) {
    super(page);
    this.registrationLink = page.locator('a', { hasText: 'Registration' });
    this.signInLink = page.locator('a', { hasText: 'Sing in' });
<<<<<<< HEAD
    // Button label is "Sign in" (with 'g')
=======
>>>>>>> a4eaf3b (Refactor registration tests: add BasePage, move interface to types, simplify locators and remove unnecessary waiters)
    this.signInButton = page.locator('button', { hasText: 'Sign in' });
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
  }

<<<<<<< HEAD
  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
=======
  async openSignInPage(): Promise<void> {
    await this.goto('/login');
>>>>>>> a4eaf3b (Refactor registration tests: add BasePage, move interface to types, simplify locators and remove unnecessary waiters)
  }

  async clickRegistrationLink(): Promise<void> {
    await this.registrationLink.click();
  }

  async clickSignInLink(): Promise<void> {
    await this.signInLink.click();
  }

  async isSignInButtonActive(): Promise<boolean> {
    return await this.signInButton.isEnabled();
  }

  async isSignInButtonInactive(): Promise<boolean> {
    const isDisabled = await this.signInButton.getAttribute('disabled');
    const ariaDisabled = await this.signInButton.getAttribute('aria-disabled');
    const isEnabled = await this.signInButton.isEnabled();
    const hasDisabledClass = await this.signInButton.evaluate((el) =>
      el.classList.contains('disabled') || el.classList.contains('Mui-disabled')
    );
    return isDisabled !== null || ariaDisabled === 'true' || hasDisabledClass || !isEnabled;
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
  }
}
