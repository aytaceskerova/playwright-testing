import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { EditPersonalInfoFlyout } from './EditPersonalInfoFlyout';

export class UserProfilePage extends BasePage {
  readonly signOut: Locator = this.page.getByText(/sign out/i).first();
  readonly userName: Locator = this.page.locator('h1').first();
  readonly editButton: Locator = this.page.locator('img[alt="Edit"]').first();
  readonly profileAvatar: Locator = this.page.locator('section img[alt=""]').first();
  readonly aqaPracticeButton: Locator = this.page.getByText('AQA Practice', { exact: true });
  readonly aqaPracticeExpandIcon: Locator = this.page.locator('img[alt="Expand"]').first();
  readonly headerLogo: Locator = this.page.locator('img[alt="Logo"]').first();
  readonly headerBrand: Locator = this.page.getByText('ANDERSEN', { exact: true }).first();
  readonly footerLogo: Locator = this.page.locator('img[alt="Company Logo"]').first();
  readonly footerContactUs: Locator = this.page.getByText('Contact us', { exact: true }).first();
  readonly footerPhone: Locator = this.page.getByText('+49 22 198 253 169', { exact: true }).first();
  readonly footerEmail: Locator = this.page.getByText('vn@andersenlab.com', { exact: true }).first();
  readonly editFlyout: EditPersonalInfoFlyout = new EditPersonalInfoFlyout(this.page);

  async waitForUserProfileReady(): Promise<void> {
    await this.waiters.waitForPageReady('networkidle');
    await this.assertions.verifyElementToBeVisible(this.signOut);
  }

  getProfileValue(labelText: string): Locator {
    return this.page.getByText(labelText, { exact: true }).locator('xpath=following-sibling::div[1]');
  }

  getAqaPracticeOption(optionText: string): Locator {
    return this.page.getByText(optionText, { exact: true });
  }

  async openEditFlyout(): Promise<void> {
    await this.actions.click(this.editButton);
    await this.assertions.verifyElementToBeVisible(this.editFlyout.title);
  }
}
