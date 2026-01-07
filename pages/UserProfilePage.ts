import { Page, Locator } from '@playwright/test';

export class UserProfilePage {
  readonly page: Page;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1, h2, [class*="profile"], [class*="user"]').first();
  }

  async isOnProfilePage(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    const url = this.page.url();
    // Check for various possible profile page URLs
    // Also check if we're not on registration or login pages anymore
    const isNotOnAuthPages = !url.includes('/registration') && !url.includes('/login');
    return (
      (url.includes('/profile') ||
        url.includes('/user') ||
        url.includes('/dashboard') ||
        url.includes('/account') ||
        isNotOnAuthPages) &&
      isNotOnAuthPages
    );
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}

