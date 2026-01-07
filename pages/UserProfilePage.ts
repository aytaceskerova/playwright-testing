import { Page, Locator } from '@playwright/test';

export class UserProfilePage {
  readonly page: Page;
  readonly signOut: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signOut = page.getByText(/sign out/i).first();
  }

  async isOnProfilePage(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    return await this.signOut.isVisible().catch(() => false);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.signOut.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }
}

