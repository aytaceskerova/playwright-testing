import { Page, Locator, expect } from '@playwright/test';
import { Actions } from '../helper/actions';
import { Assertions } from '../helper/assertions';
import { Waiters } from '../helper/waiters';
export class BasePage {
  readonly page: Page;
  readonly actions: Actions;
  readonly assertions: Assertions;
  readonly waiters: Waiters;
  constructor(page: Page) {
    this.page = page;
    this.actions = new Actions(page);
    this.assertions = new Assertions(page);
    this.waiters = new Waiters(page);
  }
  async goto(url: string): Promise<void> {
    await this.actions.goto(url);
  }
  protected async expectInputToBeEmpty(input: Locator): Promise<void> {
    expect(await input.inputValue()).toBe('');
  }
}

