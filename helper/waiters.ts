import { BaseHelp } from './base.help';

type PageLoadState = 'load' | 'domcontentloaded' | 'networkidle';
export class Waiters extends BaseHelp {
  async waitForPageReady(state: PageLoadState = 'domcontentloaded'): Promise<void> {
    await this.page.waitForLoadState(state);
}
}