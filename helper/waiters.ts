import { PageLoadState } from '../types/pageLoadState';
import { TIMEOUT } from '../data/constants/timeouts';
import { BaseHelp } from './base.help';

export class Waiters extends BaseHelp {
  async waitForPageReady(state: PageLoadState = 'domcontentloaded'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async waitForUrl(url: string | RegExp, timeout: number = TIMEOUT.Navigation): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }
}