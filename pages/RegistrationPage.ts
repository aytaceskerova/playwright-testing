import { Locator } from '@playwright/test';
import { KeyboardKey } from '../data/enums/keyboardKeys';
import { BasePage } from './BasePage';
import { RegistrationData } from '../types/registration';

export class RegistrationPage extends BasePage {
  readonly signInLink: Locator = this.page.locator('a', { hasText: 'Sing in' });
  readonly registrationLink: Locator = this.page.locator('a', { hasText: 'Registration' });
  readonly firstNameInput: Locator = this.page.locator('input[name="firstName"]');
  readonly lastNameInput: Locator = this.page.locator('input[name="lastName"]');
  readonly dateOfBirthInput: Locator = this.page.locator('input[name="dateOfBirth"]');
  readonly emailInput: Locator = this.page.locator('input[name="email"]');
  readonly passwordInput: Locator = this.page.locator('input[name="password"]');
  readonly confirmPasswordInput: Locator = this.page.getByLabel(/confirm password/i).or(this.page.locator('input[name="confirmPassword"]')).first();
  readonly submitButton: Locator = this.page.locator('button[type="submit"]');
  readonly signInButton: Locator = this.page.locator('button', { hasText: 'Sing in' });
  readonly firstNameError: Locator = this.page.locator('//label[input[@name="firstName"]]/following-sibling::div[1]/span');
  readonly lastNameError: Locator = this.page.locator('//label[input[@name="lastName"]]/following-sibling::div[1]/span');
  readonly dateOfBirthError: Locator = this.page.locator('//label[input[@name="dateOfBirth"]]/following-sibling::div[1]/span');
  readonly emailError: Locator = this.page.locator('//label[input[@name="email"]]/following-sibling::div[1]/span');
  readonly passwordError: Locator = this.page.locator('//label[input[@name="password"]]/following-sibling::div[1]/span');
  readonly confirmPasswordError: Locator = this.page.locator('//label[input[@name="passwordConfirmation"]]/following-sibling::div[1]/span');
  readonly calendar: Locator = this.page.locator('.react-datepicker');
  readonly calendarPrevButton: Locator = this.calendar.locator('button').first();
  readonly calendarNextButton: Locator = this.calendar.locator('button').last();
  readonly calendarYearDropdown: Locator = this.calendar.locator('select').first();
  readonly calendarMonthDropdown: Locator = this.calendar.locator('select').last();
  readonly calendarDayButton: Locator = this.calendar.locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)').first();

  async openRegistrationPage(): Promise<void> {
    await this.actions.goto('/registration');
  }

  async fillDateOfBirth(dateOfBirth: string): Promise<void> {
    await this.actions.click(this.dateOfBirthInput);
    await this.actions.fill(this.dateOfBirthInput, dateOfBirth);
    await this.actions.pressKey(KeyboardKey.Escape);
  }

  async fillAllFields(data: RegistrationData): Promise<void> {
    await this.actions.fill(this.firstNameInput, data.firstName);
    await this.actions.fill(this.lastNameInput, data.lastName);
    await this.fillDateOfBirth(data.dateOfBirth);
    await this.actions.fill(this.emailInput, data.email);
    await this.actions.fill(this.passwordInput, data.password);
    await this.actions.fill(this.confirmPasswordInput, data.confirmPassword);
  }

  async areFieldsEmpty(): Promise<void> {
    await this.assertions.verifyElementInputIsEmpty(this.firstNameInput);
    await this.assertions.verifyElementInputIsEmpty(this.lastNameInput);
    await this.assertions.verifyElementInputIsEmpty(this.dateOfBirthInput);
    await this.assertions.verifyElementInputIsEmpty(this.emailInput);
    await this.assertions.verifyElementInputIsEmpty(this.passwordInput);
    await this.assertions.verifyElementInputIsEmpty(this.confirmPasswordInput);
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
    await this.assertions.verifyNumberToBeGreaterThan(options, 1);
  }

  async validateMonthDropdownScrollable(): Promise<void> {
    const options = await this.calendarMonthDropdown.locator('option').count();
    await this.assertions.verifyNumberToBeGreaterThan(options, 1);
  }

}
