import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  protected async expectInputToBeEmpty(input: Locator): Promise<void> {
    expect(await input.inputValue()).toBe('');
  }
}

