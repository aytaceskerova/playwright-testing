import { Locator, Page } from '@playwright/test';
import { Actions } from '../helper/actions';
import { Assertions } from '../helper/assertions';

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
  private readonly actions: Actions;
  private readonly assertions: Assertions;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.actions = new Actions(page);
    this.assertions = new Assertions(page);
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
    await this.actions.click(this.dateOfBirthInput);
    await this.assertions.verifyElementToBeVisible(this.editCalendar);
  }

  async navigateEditCalendarPrev(): Promise<void> {
    await this.actions.click(this.editCalendarPrevButton);
  }

  async navigateEditCalendarNext(): Promise<void> {
    await this.actions.click(this.editCalendarNextButton);
  }

  async selectEditCalendarDay(): Promise<void> {
    const day = this.editCalendarDayButton.first();
    await this.assertions.verifyElementToBeVisible(day);
    await this.actions.click(day);
  }

  async getEditCalendarHeaderText(): Promise<string> {
    return (await this.editCalendarHeader.textContent()) || '';
  }

  async closeEditCalendar(): Promise<void> {
    await this.actions.pressKey('Escape');
  }
}
