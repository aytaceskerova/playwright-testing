import { Locator, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class UserProfilePage extends BasePage {
  readonly signOut: Locator;
  readonly userName: Locator;
  readonly editButton: Locator;
  readonly profileAvatar: Locator;
  readonly aqaPracticeButton: Locator;
  readonly aqaPracticeExpandIcon: Locator;
  readonly headerLogo: Locator;
  readonly headerBrand: Locator;
  readonly footerLogo: Locator;
  readonly footerContactUs: Locator;
  readonly footerPhone: Locator;
  readonly footerEmail: Locator;
  readonly editFlyout: Locator;
  readonly editFlyoutTitle: Locator;
  readonly editFlyoutSubtitle: Locator;
  readonly editFlyoutCloseButton: Locator;
  readonly editFirstNameInput: Locator;
  readonly editLastNameInput: Locator;
  readonly editEmailInput: Locator;
  readonly editDateOfBirthInput: Locator;
  readonly editCancelButton: Locator;
  readonly editSaveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.signOut = page.getByText(/sign out/i).first();
    this.userName = page.locator('h1').first();
    this.editButton = page.locator('img[alt="Edit"]').first();
    this.profileAvatar = page.locator('section img[alt=""]').first();
    this.aqaPracticeButton = page.getByText('AQA Practice', { exact: true });
    this.aqaPracticeExpandIcon = page.locator('img[alt="Expand"]').first();
    this.headerLogo = page.locator('img[alt="Logo"]').first();
    this.headerBrand = page.getByText('ANDERSEN', { exact: true }).first();
    this.footerLogo = page.locator('img[alt="Company Logo"]').first();
    this.footerContactUs = page.getByText('Contact us', { exact: true }).first();
    this.footerPhone = page.getByText('+49 22 198 253 169', { exact: true }).first();
    this.footerEmail = page.getByText('vn@andersenlab.com', { exact: true }).first();
    this.editFlyout = page.locator('form').first();
    this.editFlyoutTitle = page.getByRole('heading', { name: 'Edit personal information' }).first();
    this.editFlyoutSubtitle = page.getByText('Please, provide your personal information in English.').first();
    this.editFlyoutCloseButton = page.locator('img[alt="Close"]').first();
    this.editFirstNameInput = page.locator('form input[name="firstName"]').first();
    this.editLastNameInput = page.locator('form input[name="lastName"]').first();
    this.editEmailInput = page.locator('form input[name="email"]').first();
    this.editDateOfBirthInput = page.locator('form input[name="dateOfBirth"]').first();
    this.editCancelButton = page.getByRole('button', { name: 'Cancel' }).first();
    this.editSaveButton = page.getByRole('button', { name: 'Save' }).first();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.signOut).toBeVisible();
  }

  getProfileValue(labelText: string): Locator {
    return this.page.getByText(labelText, { exact: true }).locator('xpath=following-sibling::div[1]');
  }

  getAqaPracticeOption(optionText: string): Locator {
    return this.page.getByText(optionText, { exact: true });
  }

  async openAqaPracticeDropdown(): Promise<void> {
    await this.aqaPracticeButton.click();
  }

  async openEditFlyout(): Promise<void> {
    await this.editButton.click();
    await expect(this.editFlyoutTitle).toBeVisible();
  }
}
