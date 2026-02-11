import { Page } from '@playwright/test';

export class BaseHelp {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
 