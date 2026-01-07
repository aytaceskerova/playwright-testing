import { Page, Locator } from '@playwright/test';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class RegistrationPage {
  readonly page: Page;
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

  constructor(page: Page) {
    this.page = page;
    this.signInLink = page.locator('a', { hasText: 'Sing in' });
    this.registrationLink = page.locator('a', { hasText: 'Registration' });
    this.firstNameInput = page.locator('input[name="firstName"], input[placeholder*="First name" i], input[id*="firstName" i]').first();
    this.lastNameInput = page.locator('input[name="lastName"], input[placeholder*="Last name" i], input[id*="lastName" i]').first();
    this.dateOfBirthInput = page.locator('input[name="dateOfBirth"], input[type="date"], input[placeholder*="Date of birth" i], input[id*="dateOfBirth" i]').first();
    this.emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="Email" i], input[id*="email" i]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[placeholder*="Confirm password" i], input[id*="confirmPassword" i]').first();
    this.submitButton = page.locator('button[type="submit"], button', { hasText: 'Submit' }).first();
    this.signInButton = page.locator('button', { hasText: 'Sing in' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/registration', { waitUntil: 'domcontentloaded' });
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickSignInLink(): Promise<void> {
    await this.signInLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.signInLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickRegistrationLink(): Promise<void> {
    await this.registrationLink.click();
    await this.page.waitForLoadState('networkidle');
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
    await this.page.waitForTimeout(200); // Small wait to ensure date picker is closed
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
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
    const firstName = await this.firstNameInput.inputValue();
    const lastName = await this.lastNameInput.inputValue();
    const dateOfBirth = await this.dateOfBirthInput.inputValue();
    const email = await this.emailInput.inputValue();
    const password = await this.passwordInput.inputValue();
    const confirmPassword = await this.confirmPasswordInput.inputValue();

    return (
      firstName === '' &&
      lastName === '' &&
      dateOfBirth === '' &&
      email === '' &&
      password === '' &&
      confirmPassword === ''
    );
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
        return await this.confirmPasswordInput.inputValue();
    }
  }
}

