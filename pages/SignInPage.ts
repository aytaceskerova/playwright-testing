import { Locator, expect } from '@playwright/test';
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
    this.signInButton = page.locator('button', { hasText: 'Sign in' });
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
  }

  async openSignInPage(): Promise<void> {
    await this.goto('/login');
  }



  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async areFieldsEmpty(): Promise<void> {
    await this.expectInputToBeEmpty(this.emailInput);
    await this.expectInputToBeEmpty(this.passwordInput);
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.signInButton.click();
  }
}
