import { PageLoadState } from '../types/pageLoadState';
import { BaseHelp } from './base.help';

export class Waiters extends BaseHelp {
  async waitForPageReady(state: PageLoadState = 'domcontentloaded'): Promise<void> {
    await this.page.waitForLoadState(state);
  }
}