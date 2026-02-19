import { expect, Locator } from '@playwright/test';
import { SelectOption } from '../types/selectOption';
import { WaitUntil } from '../types/waitUntil';
import { BaseHelp } from './base.help';

export class Actions extends BaseHelp {
  async goto(url: string, waitUntil: WaitUntil = 'domcontentloaded'): Promise<void> {
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

  async dragTo(source: Locator, target: Locator): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataTransfer = await this.page.evaluateHandle(() => new (globalThis as any).DataTransfer());
    await source.dispatchEvent('dragstart', { dataTransfer });
    await target.dispatchEvent('dragover', { dataTransfer });
    await target.dispatchEvent('drop', { dataTransfer });
    await source.dispatchEvent('dragend', { dataTransfer });
  }  

  async focus(element: Locator): Promise<void> {
    await element.focus();
  }

  async blur(element: Locator): Promise<void> {
    await element.blur();
  }

  async selectOption(element: Locator, value: SelectOption): Promise<void> {
    await expect(element).toBeVisible();
    await expect(element.locator('option')).not.toHaveCount(0);
    await element.selectOption(value);
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async moveMouse(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y);
  }

  async reload(waitUntil: WaitUntil = 'domcontentloaded'): Promise<void> {
    await this.page.reload({ waitUntil });
  }

  async retrieveElementTextContent(element: Locator): Promise<string> {
    return (await element.textContent()) || '';
  }

  async setInputFiles(element: Locator, filePaths: string | string[]): Promise<void> {
    await element.setInputFiles(filePaths);
  }
}