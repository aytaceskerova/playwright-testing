import { expect, Locator, Page } from '@playwright/test';

export class EditPersonalInfoFlyout {
  readonly root: Locator;
  readonly title: Locator;
  readonly subtitle: Locator;
  readonly closeButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;
  readonly editFirstNameError: Locator;
  readonly editLastNameError: Locator;
  readonly editEmailError: Locator;
  readonly editDateOfBirthError: Locator;
  readonly editCalendar: Locator;
  readonly editCalendarPrevButton: Locator;
  readonly editCalendarNextButton: Locator;
  readonly editCalendarHeader: Locator;
  readonly editCalendarDayButton: Locator;
  private readonly page: Page;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
    this.title = page.getByRole('heading', { name: 'Edit personal information' }).first();
    this.subtitle = page.getByText('Please, provide your personal information in English.').first();
    this.closeButton = page.locator('img[alt="Close"]').first();
    this.firstNameInput = root.locator('input[name="firstName"]').first();
    this.lastNameInput = root.locator('input[name="lastName"]').first();
    this.emailInput = root.locator('input[name="email"]').first();
    this.dateOfBirthInput = root.locator('input[name="dateOfBirth"]').first();
    this.cancelButton = page.getByRole('button', { name: 'Cancel' }).first();
    this.saveButton = page.getByRole('button', { name: 'Save' }).first();
    this.editFirstNameError = page.locator('//label[input[@name="firstName"]]/following-sibling::div[1]/span');
    this.editLastNameError = page.locator('//label[input[@name="lastName"]]/following-sibling::div[1]/span');
    this.editEmailError = page.locator('//label[input[@name="email"]]/following-sibling::div[1]/span');
    this.editDateOfBirthError = page.locator('//label[input[@name="dateOfBirth"]]/following-sibling::div[1]/span');
    this.editCalendar = page.locator('div.fixed.inline-block.border.shadow-lg.rounded-md.bg-white');
    this.editCalendarPrevButton = this.editCalendar.locator('img[alt="arrow_left"]');
    this.editCalendarNextButton = this.editCalendar.locator('img[alt="arrow_right"]');
    this.editCalendarHeader = this.editCalendar.locator('div').filter({ hasText: /^[A-Za-z]+\s+\d{4}$/ }).first();
    this.editCalendarDayButton = this.editCalendar.locator('div.cursor-pointer').filter({ hasText: /^\d{1,2}$/ });
  }

  async openEditDatePicker(): Promise<void> {
    await this.dateOfBirthInput.click();
    await expect(this.editCalendar).toBeVisible();
  }

  async navigateEditCalendarPrev(): Promise<void> {
    await this.editCalendarPrevButton.click();
  }

  async navigateEditCalendarNext(): Promise<void> {
    await this.editCalendarNextButton.click();
  }

  async selectEditCalendarDay(): Promise<void> {
    const day = this.editCalendarDayButton.first();
    await expect(day).toBeVisible();
    await day.click();
  }

  async getEditCalendarHeaderText(): Promise<string> {
    return (await this.editCalendarHeader.textContent()) || '';
  }

  async closeEditCalendar(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }
}
