import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { RegistrationData } from '../types/registration';

export class RegistrationPage extends BasePage {
  readonly signInLink: Locator;
  readonly registrationLink: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly signInButton: Locator;

  constructor(page: BasePage['page']) {
    super(page);
    this.signInLink = page.locator('a', { hasText: 'Sing in' });
    this.registrationLink = page.locator('a', { hasText: 'Registration' });
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.dateOfBirthInput = page.locator('input[name="dateOfBirth"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.confirmPasswordInput = page.getByLabel(/confirm password/i).or(page.locator('input[name="confirmPassword"]')).first();
    this.submitButton = page.locator('button[type="submit"]');
    this.signInButton = page.locator('button', { hasText: 'Sing in' });
  }

  async openRegistrationPage(): Promise<void> {
    await this.goto('/registration');
  }

  async clickSignInLink(): Promise<void> {
    await this.signInLink.click();
  }

  async clickRegistrationLink(): Promise<void> {
    await this.registrationLink.click();
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillDateOfBirth(dateOfBirth: string): Promise<void> {
    await this.dateOfBirthInput.click();
    await this.dateOfBirthInput.fill(dateOfBirth);
    await this.page.keyboard.press('Escape');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(confirmPassword: string): Promise<void> {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async fillAllFields(data: RegistrationData): Promise<void> {
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.fillDateOfBirth(data.dateOfBirth);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.confirmPassword);
  }

  async clickSubmitButton(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.submitButton.click();
  }

  async isSubmitButtonActive(): Promise<boolean> {
    return await this.submitButton.isEnabled();
  }

  async isSubmitButtonInactive(): Promise<boolean> {
    const isDisabled = await this.submitButton.getAttribute('disabled');
    const isEnabled = await this.submitButton.isEnabled();
    return isDisabled !== null || !isEnabled;
  }

  async isSignInButtonActive(): Promise<boolean> {
    return await this.signInButton.isEnabled();
  }

  async areFieldsEmpty(): Promise<boolean> {
    try {
      const firstName = await this.firstNameInput.inputValue();
      const lastName = await this.lastNameInput.inputValue();
      const dateOfBirth = await this.dateOfBirthInput.inputValue();
      const email = await this.emailInput.inputValue();
      const password = await this.passwordInput.inputValue();
      const confirmPassword = await this.confirmPasswordInput.inputValue().catch(() => '');

      return (
        firstName === '' &&
        lastName === '' &&
        dateOfBirth === '' &&
        email === '' &&
        password === '' &&
        confirmPassword === ''
      );
    } catch {
      return false;
    }
  }

  async getFieldValue(fieldName: keyof RegistrationData): Promise<string> {
    switch (fieldName) {
      case 'firstName':
        return await this.firstNameInput.inputValue();
      case 'lastName':
        return await this.lastNameInput.inputValue();
      case 'dateOfBirth':
        return await this.dateOfBirthInput.inputValue();
      case 'email':
        return await this.emailInput.inputValue();
      case 'password':
        return await this.passwordInput.inputValue();
      case 'confirmPassword':
        return await this.confirmPasswordInput.inputValue().catch(() => '');
    }
  }
}
