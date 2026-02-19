import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { DRAG_DROP_PAGE_LABELS, CONGRATULATIONS_MESSAGE } from '../data/constants/dragDropPageTestData';

export class DragDropPage extends BasePage {
  readonly backToProfileLink: Locator = this.page
    .locator('[data-ol="BackToProfile"]')
    .or(this.page.getByRole('link', { name: /back to profile/i }));
  readonly sortYourResponsibilitiesTitle: Locator = this.page.getByRole('heading', {
    name: DRAG_DROP_PAGE_LABELS.SortYourResponsibilities,
  });
  readonly placeTheBlocksSubtitle: Locator = this.page.getByText(
    DRAG_DROP_PAGE_LABELS.PlaceTheBlocksSubtitle,
    { exact: true },
  );

  readonly manual1: Locator = this.page.locator('#manual1');
  readonly manual2: Locator = this.page.locator('#manual2');
  readonly auto1: Locator = this.page.locator('#auto1');
  readonly auto2: Locator = this.page.locator('#auto2');

  readonly manualWorkSection: Locator = this.page.getByRole('heading', {
    name: DRAG_DROP_PAGE_LABELS.ManualWork,
  });
  readonly automationWorkSection: Locator = this.page.getByRole('heading', {
    name: DRAG_DROP_PAGE_LABELS.AutomationWork,
  });
  readonly finishButton: Locator = this.page.locator('#DragNDropPageFinishButton');
  readonly congratulationsPopUp: Locator = this.page.getByText(
    CONGRATULATIONS_MESSAGE,
    { exact: true },
  );

  readonly manualWorkColumn1: Locator = this.page.locator('#target-manual1');
  readonly manualWorkColumn2: Locator = this.page.locator('#target-manual2');
  readonly automationWorkColumn1: Locator = this.page.locator('#target-auto1');
  readonly automationWorkColumn2: Locator = this.page.locator('#target-auto2');

  async moveAllChipsToCorrectFields(): Promise<void> {
    await this.actions.dragTo(this.manual1, this.manualWorkColumn1);
    await this.actions.dragTo(this.manual2, this.manualWorkColumn2);
    await this.actions.dragTo(this.auto1, this.automationWorkColumn1);
    await this.actions.dragTo(this.auto2, this.automationWorkColumn2);
  }

  isChipInColumn(chipText: string, column: Locator): Locator {
    return column.getByText(chipText, { exact: true });
  }
}
