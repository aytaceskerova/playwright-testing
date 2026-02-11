import { expect, Locator } from '@playwright/test';
import { DEFAULT_ASSERTION_TIMEOUT } from '../data/constants/timeouts';
import { BaseHelp } from './base.help';

export class Assertions extends BaseHelp {
  async verifyElementToBeVisible(element: Locator, timeout: number = DEFAULT_ASSERTION_TIMEOUT): Promise<void> {
    await expect(element).toBeVisible({ timeout });
  }

  async verifyElementToBeHidden(element: Locator, timeout: number = DEFAULT_ASSERTION_TIMEOUT): Promise<void> {
    await expect(element).toBeHidden({ timeout });
  }

  async verifyElementNotVisible(element: Locator, timeout: number = DEFAULT_ASSERTION_TIMEOUT): Promise<void> {
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

  async verifyElementInputIsEmpty(element: Locator): Promise<void> {
    await this.verifyElementToHaveValue(element, '');
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

  async verifyPageToHaveUrl(url: string | RegExp, timeout: number = DEFAULT_ASSERTION_TIMEOUT): Promise<void> {
    await expect(this.page).toHaveURL(url, { timeout });
  }

  async verifyValueToBe<T>(actual: T, expected: T): Promise<void> {
    expect(actual).toBe(expected);
  }

  async verifyValueNotToBe<T>(actual: T, expected: T): Promise<void> {
    expect(actual).not.toBe(expected);
  }

  async verifyValueToContain(actual: string, expected: string): Promise<void> {
    expect(actual).toContain(expected);
  }

  async verifyValueToMatch(actual: string, expected: RegExp): Promise<void> {
    expect(actual).toMatch(expected);
  }

  async verifyNumberToBeGreaterThan(actual: number, expected: number): Promise<void> {
    expect(actual).toBeGreaterThan(expected);
  }
}