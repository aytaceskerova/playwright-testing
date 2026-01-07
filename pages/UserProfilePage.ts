import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class UserProfilePage extends BasePage {
  readonly signOut: Locator;

  constructor(page: BasePage['page']) {
    super(page);
    this.signOut = page.getByText(/sign out/i).first();
  }

  async isOnProfilePage(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    return await this.signOut.isVisible().catch(() => false);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.signOut.waitFor({ state: 'visible' }).catch(() => {});
  }
}
