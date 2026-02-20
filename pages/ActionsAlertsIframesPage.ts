import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ACTIONS_ALERTS_IFRAMES_PAGE_LABELS } from '../data/constants/actionsAlertsIframesPageTestData';

export class ActionsAlertsIframesPage extends BasePage {
  private readonly actionsFrame = this.page.frameLocator(
    'iframe[title="Finish your registration"]',
  );

  readonly title: Locator = this.page.getByRole('heading', {
    name: ACTIONS_ALERTS_IFRAMES_PAGE_LABELS.Title,
  });
  readonly subtitle: Locator = this.actionsFrame.getByText(
    ACTIONS_ALERTS_IFRAMES_PAGE_LABELS.Subtitle,
  );
  readonly confirmButton: Locator = this.actionsFrame.getByRole('button', {
    name: ACTIONS_ALERTS_IFRAMES_PAGE_LABELS.Confirm,
  });
  readonly getDiscountButton: Locator = this.actionsFrame.getByRole('button', {
    name: ACTIONS_ALERTS_IFRAMES_PAGE_LABELS.GetDiscount,
  });
  readonly cancelCourseButton: Locator =
    this.actionsFrame.getByRole('button', {
      name: ACTIONS_ALERTS_IFRAMES_PAGE_LABELS.CancelCourse,
    });
  readonly resultsField: Locator = this.actionsFrame.getByText(
    ACTIONS_ALERTS_IFRAMES_PAGE_LABELS.Results,
  );
  readonly finishButton: Locator = this.actionsFrame.getByRole('button', {
    name: ACTIONS_ALERTS_IFRAMES_PAGE_LABELS.Finish,
  });

  getHintIconForButton(button: Locator): Locator {
    return button.locator('xpath=following-sibling::*[1]');
  }

  getTextInFrame(text: string | RegExp): Locator {
    return this.actionsFrame.getByText(text);
  }
}
