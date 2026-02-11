import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditPersonalInfoFlyout extends BasePage {
  readonly root: Locator = this.page.locator('form').first();
  readonly title: Locator = this.page.getByRole('heading', { name: 'Edit personal information' }).first();
  readonly subtitle: Locator = this.page.getByText('Please, provide your personal information in English.').first();
  readonly closeButton: Locator = this.page.locator('img[alt="Close"]').first();
  readonly firstNameInput: Locator = this.root.locator('input[name="firstName"]').first();
  readonly lastNameInput: Locator = this.root.locator('input[name="lastName"]').first();
  readonly emailInput: Locator = this.root.locator('input[name="email"]').first();
  readonly dateOfBirthInput: Locator = this.root.locator('input[name="dateOfBirth"]').first();
  readonly cancelButton: Locator = this.page.getByRole('button', { name: 'Cancel' }).first();
  readonly saveButton: Locator = this.page.getByRole('button', { name: 'Save' }).first();
  readonly editFirstNameError: Locator = this.page.locator('//label[input[@name="firstName"]]/following-sibling::div[1]/span');
  readonly editLastNameError: Locator = this.page.locator('//label[input[@name="lastName"]]/following-sibling::div[1]/span');
  readonly editEmailError: Locator = this.page.locator('//label[input[@name="email"]]/following-sibling::div[1]/span');
  readonly editDateOfBirthError: Locator = this.page.locator('//label[input[@name="dateOfBirth"]]/following-sibling::div[1]/span');
  readonly editCalendar: Locator = this.page.locator('div.fixed.inline-block.border.shadow-lg.rounded-md.bg-white');
  readonly editCalendarPrevButton: Locator = this.editCalendar.locator('img[alt="arrow_left"]');
  readonly editCalendarNextButton: Locator = this.editCalendar.locator('img[alt="arrow_right"]');
  readonly editCalendarHeader: Locator = this.editCalendar.locator('div').filter({ hasText: /^[A-Za-z]+\s+\d{4}$/ }).first();
  readonly editCalendarDayButton: Locator = this.editCalendar.locator('div.cursor-pointer').filter({ hasText: /^\d{1,2}$/ });

  async openEditDatePicker(): Promise<void> {
    await this.actions.click(this.dateOfBirthInput);
    await this.assertions.verifyElementToBeVisible(this.editCalendar);
  }

  async selectEditCalendarDay(): Promise<void> {
    const day = this.editCalendarDayButton.first();
    await this.assertions.verifyElementToBeVisible(day);
    await this.actions.click(day);
  }

}
