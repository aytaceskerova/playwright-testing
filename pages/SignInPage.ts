import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignInPage extends BasePage {
  readonly registrationLink: Locator = this.page.locator('a', { hasText: 'Registration' });
  readonly signInLink: Locator = this.page.locator('a', { hasText: 'Sing in' });
  readonly signInButton: Locator = this.page.locator('button', { hasText: 'Sign in' });
  readonly emailInput: Locator = this.page.locator('input[name="email"]');
  readonly passwordInput: Locator = this.page.locator('input[name="password"]');
  readonly emailError: Locator = this.page.locator('//label[input[@name="email"]]/following-sibling::div[1]/span');
  readonly passwordError: Locator = this.page.locator('//label[input[@name="password"]]/following-sibling::div[1]/span');
  readonly signInError: Locator = this.page.getByText('Email or password is not valid').first();

  async areFieldsEmpty(): Promise<void> {
    await this.assertions.verifyElementInputIsEmpty(this.emailInput);
    await this.assertions.verifyElementInputIsEmpty(this.passwordInput);
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.actions.fill(this.emailInput, email);
    await this.actions.fill(this.passwordInput, password);
    await this.actions.click(this.signInButton);
  }
}
