import { Locator, SelectOption } from '@playwright/test';
import { BaseHelp } from './base.help';
export class Actions extends BaseHelp {
  async goto(url: string, waitUntil: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' = 'domcontentloaded'): Promise<void> {
    await this.page.goto(url, { waitUntil });
  }

  async click(element: Locator): Promise<void> {
    await element.click();
  }

  async fill(element: Locator, value: string): Promise<void> {
    await element.fill(value);
  }

  async hover(element: Locator): Promise<void> {
    await element.hover();
  }

  async focus(element: Locator): Promise<void> {
    await element.focus();
  }

  async blur(element: Locator): Promise<void> {
    await element.blur();
  }

  async selectOption(element: Locator, value: SelectOption): Promise<void> {
    await element.selectOption(value);
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async moveMouse(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y);
  }

  async reload(waitUntil: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' = 'domcontentloaded'): Promise<void> {
    await this.page.reload({ waitUntil });
  }
}