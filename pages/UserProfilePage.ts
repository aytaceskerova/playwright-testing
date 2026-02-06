import { Locator, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { EditPersonalInfoFlyout } from './EditPersonalInfoFlyout';

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
  readonly editFlyout: EditPersonalInfoFlyout;

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
    this.editFlyout = new EditPersonalInfoFlyout(page, page.locator('form').first());
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
    await expect(this.editFlyout.title).toBeVisible();
  }
}
