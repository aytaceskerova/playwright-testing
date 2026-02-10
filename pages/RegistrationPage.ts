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
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;
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
    this.emailError = page.locator('//label[input[@name="email"]]/following-sibling::div[1]/span');
    this.passwordError = page.locator('//label[input[@name="password"]]/following-sibling::div[1]/span');
    this.confirmPasswordError = page.locator('//label[input[@name="passwordConfirmation"]]/following-sibling::div[1]/span');
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
    await this.actions.fill(this.firstNameInput, firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.actions.fill(this.lastNameInput, lastName);
  }

  async fillDateOfBirth(dateOfBirth: string): Promise<void> {
    await this.actions.click(this.dateOfBirthInput);
    await this.actions.fill(this.dateOfBirthInput, dateOfBirth);
    await this.actions.pressKey('Escape');
  }

  async fillEmail(email: string): Promise<void> {
    await this.actions.fill(this.emailInput, email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.actions.fill(this.passwordInput, password);
  }

  async fillConfirmPassword(confirmPassword: string): Promise<void> {
    await this.actions.fill(this.confirmPasswordInput, confirmPassword);
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
    await this.actions.click(this.submitButton);
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
    await this.actions.click(this.dateOfBirthInput);
    await this.assertions.verifyElementToBeVisible(this.calendar);
  }

  async navigateCalendarPrev(): Promise<void> {
    await this.actions.click(this.calendarPrevButton);
  }

  async navigateCalendarNext(): Promise<void> {
    await this.actions.click(this.calendarNextButton);
  }

  async selectYear(year: string): Promise<void> {
    await this.assertions.verifyElementToBeVisible(this.calendarYearDropdown);
    await this.actions.selectOption(this.calendarYearDropdown, year);
  }

  async selectMonth(month: string): Promise<void> {
    await this.assertions.verifyElementToBeVisible(this.calendarMonthDropdown);
    await this.actions.selectOption(this.calendarMonthDropdown, month);
  }
  async selectDay(): Promise<void> {
    await this.assertions.verifyElementToBeVisible(this.calendarDayButton);
    await this.actions.click(this.calendarDayButton);
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
    await this.actions.pressKey('Escape');
  }
}
