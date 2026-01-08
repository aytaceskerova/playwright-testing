import { Locator, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class UserProfilePage extends BasePage {
  readonly signOut: Locator;

  constructor(page: Page) {
    super(page);
    this.signOut = page.getByText(/sign out/i).first();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.signOut).toBeVisible();
  }
}
