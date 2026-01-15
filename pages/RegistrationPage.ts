import { Locator, expect, Page } from '@playwright/test';
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
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly dateOfBirthError: Locator;
  readonly calendar: Locator;
  readonly calendarPrevButton: Locator;
  readonly calendarNextButton: Locator;
  readonly calendarYearDropdown: Locator;
  readonly calendarMonthDropdown: Locator;
  readonly calendarDayButton: Locator;

  constructor(page: Page) {
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
    this.firstNameError = page.locator('//label[input[@name="firstName"]]/following-sibling::div[1]/span');
    this.lastNameError = page.locator('//label[input[@name="lastName"]]/following-sibling::div[1]/span');
    this.dateOfBirthError = page.locator('//label[input[@name="dateOfBirth"]]/following-sibling::div[1]/span');
    this.calendar = page.locator('.react-datepicker');
    this.calendarPrevButton = this.calendar.locator('button').first();
    this.calendarNextButton = this.calendar.locator('button').last();
    this.calendarYearDropdown = this.calendar.locator('select').first();
    this.calendarMonthDropdown = this.calendar.locator('select').last();
    this.calendarDayButton = this.calendar.locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)').first();
  }

  async openRegistrationPage(): Promise<void> {
    await this.goto('/registration');
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
    await this.submitButton.click();
  }

  async areFieldsEmpty(): Promise<void> {
    await this.expectInputToBeEmpty(this.firstNameInput);
    await this.expectInputToBeEmpty(this.lastNameInput);
    await this.expectInputToBeEmpty(this.dateOfBirthInput);
    await this.expectInputToBeEmpty(this.emailInput);
    await this.expectInputToBeEmpty(this.passwordInput);
    await this.expectInputToBeEmpty(this.confirmPasswordInput);
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

  async openCalendar(): Promise<void> {
    await this.dateOfBirthInput.click();
    await expect(this.calendar).toBeVisible();
  }

  async navigateCalendarPrev(): Promise<void> {
    await this.calendarPrevButton.click();
  }

  async navigateCalendarNext(): Promise<void> {
    await this.calendarNextButton.click();
  }

  async selectYear(year: string): Promise<void> {
    await expect(this.calendarYearDropdown).toBeVisible();
    await this.calendarYearDropdown.selectOption(year);
  }

  async selectMonth(month: string): Promise<void> {
    await expect(this.calendarMonthDropdown).toBeVisible();
    await this.calendarMonthDropdown.selectOption(month);
  }
  async selectDay(): Promise<void> {
    await expect(this.calendarDayButton).toBeVisible();
    await this.calendarDayButton.click();
  }

  async getSelectedYear(): Promise<string> {
    return await this.calendarYearDropdown.inputValue();
  }

  async getSelectedMonth(): Promise<string> {
    return await this.calendarMonthDropdown.locator('option:checked').textContent() || '';
  }

  async validateYearDropdownScrollable(): Promise<void> {
    const options = await this.calendarYearDropdown.locator('option').count();
    expect(options).toBeGreaterThan(1);
  }

  async validateMonthDropdownScrollable(): Promise<void> {
    const options = await this.calendarMonthDropdown.locator('option').count();
    expect(options).toBeGreaterThan(1);
  }

  async closeCalendar(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }
}
