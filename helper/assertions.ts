import { expect, Locator } from '@playwright/test';
import { BaseHelp } from './base.help';

export class Assertions extends BaseHelp {
  async verifyElementToBeVisible(element: Locator, timeout: number = 6000): Promise<void> {
    await expect(element).toBeVisible({ timeout });
  }

  async verifyElementToBeHidden(element: Locator, timeout: number = 6000): Promise<void> {
    await expect(element).toBeHidden({ timeout });
  }

  async verifyElementNotVisible(element: Locator, timeout: number = 6000): Promise<void> {
    await expect(element).not.toBeVisible({ timeout });
  }

  async verifyElementToBeEnabled(element: Locator): Promise<void> {
    await expect(element).toBeEnabled();
  }

  async verifyElementToBeDisabled(element: Locator): Promise<void> {
    await expect(element).toBeDisabled();
  }

  async verifyElementToHaveText(element: Locator, text: string | RegExp): Promise<void> {
    await expect(element).toHaveText(text);
  }

  async verifyElementToHaveValue(element: Locator, value: string | RegExp): Promise<void> {
    await expect(element).toHaveValue(value);
  }

  async verifyElementToContainText(element: Locator, text: string | RegExp): Promise<void> {
    await expect(element).toContainText(text);
  }

  async verifyElementToHaveCount(element: Locator, count: number): Promise<void> {
    await expect(element).toHaveCount(count);
  }

  async verifyElementToHaveAttribute(element: Locator, attribute: string, value: string | RegExp): Promise<void> {
    await expect(element).toHaveAttribute(attribute, value);
  }

  async verifyElementToHaveCss(element: Locator, property: string, value: string | RegExp): Promise<void> {
    await expect(element).toHaveCSS(property, value);
  }

  async verifyPageToHaveUrl(url: string | RegExp, timeout: number = 6000): Promise<void> {
    await expect(this.page).toHaveURL(url, { timeout });
  }
}