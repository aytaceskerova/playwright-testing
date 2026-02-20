import { test } from '../fixtures/base';
import { RegistrationData } from '../../types/registration';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import {
  FINISH_BUTTON_ENABLED_CLASS,
  BUTTON_HINTS,
  ALERT_MESSAGES,
  RESULT_MESSAGES,
  CANCEL_REASON,
} from '../../data/constants/actionsAlertsIframesPageTestData';
import { AQA_PRACTICE_OPTIONS } from '../../data/constants/userProfileTestData';
import { RegistrationTestData } from '../../data/pojos/registrationData';

test.describe('Actions, Alerts & Iframes page', () => {
  let registeredUser: RegistrationData;

  test.beforeEach(async ({ registrationPage, signInPage, userProfilePage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.waiters.waitForUrl(URL_PATTERNS.Login);
    await signInPage.signIn(registeredUser.email, registeredUser.password);
    await userProfilePage.waitForUserProfileReady();
    await userProfilePage.actions.hover(userProfilePage.aqaPracticeButton);
    await userProfilePage.actions.click(
      userProfilePage.getAqaPracticeOption(AQA_PRACTICE_OPTIONS[2]),
    );
    await userProfilePage.waiters.waitForPageReady('load');
  });

  test('[AQAPRACT-591] "Actions, Alerts & Iframes" form elements validation', async ({
    actionsAlertsIframesPage,
  }) => {
    await actionsAlertsIframesPage.assertions.verifyMultipleElementsToBeVisible(
      actionsAlertsIframesPage.title,
      actionsAlertsIframesPage.confirmButton,
      actionsAlertsIframesPage.getDiscountButton,
      actionsAlertsIframesPage.cancelCourseButton,
      actionsAlertsIframesPage.resultsField,
      actionsAlertsIframesPage.finishButton,
    );
    await actionsAlertsIframesPage.assertions.verifyElementNotToHaveClass(
      actionsAlertsIframesPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );
  });

  test('[AQAPRACT-592] Showing hint for "Confirm" button', async ({
    actionsAlertsIframesPage,
  }) => {
    const hintIcon = actionsAlertsIframesPage.getHintIconForButton(
      actionsAlertsIframesPage.confirmButton,
    );
    await actionsAlertsIframesPage.actions.hover(hintIcon);
    await actionsAlertsIframesPage.assertions.verifyElementToBeVisible(
      actionsAlertsIframesPage.getTextInFrame(BUTTON_HINTS.Confirm),
    );
  });

  test('[AQAPRACT-593] Showing hint for "Get Discount" button', async ({
    actionsAlertsIframesPage,
  }) => {
    const hintIcon = actionsAlertsIframesPage.getHintIconForButton(
      actionsAlertsIframesPage.getDiscountButton,
    );
    await actionsAlertsIframesPage.actions.hover(hintIcon);
    await actionsAlertsIframesPage.assertions.verifyElementToBeVisible(
      actionsAlertsIframesPage.getTextInFrame(BUTTON_HINTS.GetDiscount),
    );
  });

  test('[AQAPRACT-594] Showing hint for "Cancel course" button', async ({
    actionsAlertsIframesPage,
  }) => {
    const hintIcon = actionsAlertsIframesPage.getHintIconForButton(
      actionsAlertsIframesPage.cancelCourseButton,
    );
    await actionsAlertsIframesPage.actions.hover(hintIcon);
    await actionsAlertsIframesPage.assertions.verifyElementToBeVisible(
      actionsAlertsIframesPage.getTextInFrame(BUTTON_HINTS.CancelCourse),
    );
  });

  test('[AQAPRACT-595] Click on the "Confirm" button', async ({
    page,
    actionsAlertsIframesPage,
    userProfilePage,
  }) => {
    await actionsAlertsIframesPage.actions.hover(
      actionsAlertsIframesPage.confirmButton,
    );

    page.on('dialog', async (dialog) => {
      await actionsAlertsIframesPage.assertions.verifyValueToMatch(
        dialog.message(),
        new RegExp(ALERT_MESSAGES.ConfirmAlert),
      );
      await dialog.accept();
    });

    await actionsAlertsIframesPage.actions.click(
      actionsAlertsIframesPage.confirmButton,
    );

    await actionsAlertsIframesPage.assertions.verifyElementToBeVisible(
      actionsAlertsIframesPage.getTextInFrame(RESULT_MESSAGES.Enrolled),
    );
    await actionsAlertsIframesPage.assertions.verifyElementToHaveClass(
      actionsAlertsIframesPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );

    await actionsAlertsIframesPage.actions.click(
      actionsAlertsIframesPage.finishButton,
    );
    await userProfilePage.waiters.waitForUrl(URL_PATTERNS.UserProfile);
    await userProfilePage.assertions.verifyElementToBeVisible(
      userProfilePage.signOut,
    );
  });

  test('[AQAPRACT-596] Confirmation of "Get discount" operation', async ({
    page,
    actionsAlertsIframesPage,
    userProfilePage,
  }) => {
    await actionsAlertsIframesPage.actions.hover(
      actionsAlertsIframesPage.getDiscountButton,
    );

    page.on('dialog', async (dialog) => {
      await actionsAlertsIframesPage.assertions.verifyValueToMatch(
        dialog.message(),
        new RegExp(ALERT_MESSAGES.GetDiscountConfirm),
      );
      await dialog.accept();
    });

    await actionsAlertsIframesPage.actions.doubleClick(
      actionsAlertsIframesPage.getDiscountButton,
    );

    await actionsAlertsIframesPage.assertions.verifyElementToBeVisible(
      actionsAlertsIframesPage.getTextInFrame(RESULT_MESSAGES.DiscountApplied),
    );
    await actionsAlertsIframesPage.assertions.verifyElementToHaveClass(
      actionsAlertsIframesPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );

    await actionsAlertsIframesPage.actions.click(
      actionsAlertsIframesPage.finishButton,
    );
    await userProfilePage.waiters.waitForUrl(URL_PATTERNS.UserProfile);
  });

  test('[AQAPRACT-597] Cancellation of "Get discount" operation', async ({
    page,
    actionsAlertsIframesPage,
  }) => {
    await actionsAlertsIframesPage.actions.hover(
      actionsAlertsIframesPage.getDiscountButton,
    );

    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await actionsAlertsIframesPage.actions.doubleClick(
      actionsAlertsIframesPage.getDiscountButton,
    );

    await actionsAlertsIframesPage.assertions.verifyElementToHaveCount(
      actionsAlertsIframesPage.getTextInFrame(RESULT_MESSAGES.DiscountApplied),
      0,
    );
    await actionsAlertsIframesPage.assertions.verifyElementNotToHaveClass(
      actionsAlertsIframesPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );
  });

  test('[AQAPRACT-598] Right click on "Cancel course" and confirming with a reason', async ({
    page,
    actionsAlertsIframesPage,
    userProfilePage,
  }) => {
    await actionsAlertsIframesPage.actions.hover(
      actionsAlertsIframesPage.cancelCourseButton,
    );

    page.on('dialog', async (dialog) => {
      await dialog.accept(CANCEL_REASON);
    });

    await actionsAlertsIframesPage.actions.rightClick(
      actionsAlertsIframesPage.cancelCourseButton,
    );

    await actionsAlertsIframesPage.assertions.verifyElementToBeVisible(
      actionsAlertsIframesPage.getTextInFrame(`Reason: ${CANCEL_REASON}`),
    );
    await actionsAlertsIframesPage.assertions.verifyElementToHaveClass(
      actionsAlertsIframesPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );

    await actionsAlertsIframesPage.actions.click(
      actionsAlertsIframesPage.finishButton,
    );
    await userProfilePage.waiters.waitForUrl(URL_PATTERNS.UserProfile);
  });

  test('[AQAPRACT-599] Canceling a course without filling in the reason field', async ({
    page,
    actionsAlertsIframesPage,
    userProfilePage,
  }) => {
    await actionsAlertsIframesPage.actions.hover(
      actionsAlertsIframesPage.cancelCourseButton,
    );

    page.on('dialog', async (dialog) => {
      await dialog.accept('');
    });

    await actionsAlertsIframesPage.actions.rightClick(
      actionsAlertsIframesPage.cancelCourseButton,
    );

    await actionsAlertsIframesPage.assertions.verifyElementToBeVisible(
      actionsAlertsIframesPage.getTextInFrame(RESULT_MESSAGES.CancelledDefaultReason),
    );
    await actionsAlertsIframesPage.assertions.verifyElementToHaveClass(
      actionsAlertsIframesPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );

    await actionsAlertsIframesPage.actions.click(
      actionsAlertsIframesPage.finishButton,
    );
    await userProfilePage.waiters.waitForUrl(URL_PATTERNS.UserProfile);
  });

  test('[AQAPRACT-600] Canceling a course', async ({
    page,
    actionsAlertsIframesPage,
    userProfilePage,
  }) => {
    await actionsAlertsIframesPage.actions.hover(
      actionsAlertsIframesPage.cancelCourseButton,
    );

    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await actionsAlertsIframesPage.actions.rightClick(
      actionsAlertsIframesPage.cancelCourseButton,
    );

    await actionsAlertsIframesPage.assertions.verifyElementToBeVisible(
      actionsAlertsIframesPage.getTextInFrame(RESULT_MESSAGES.CancelledDefaultReason),
    );
    await actionsAlertsIframesPage.assertions.verifyElementToHaveClass(
      actionsAlertsIframesPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );

    await actionsAlertsIframesPage.actions.click(
      actionsAlertsIframesPage.finishButton,
    );
    await userProfilePage.waiters.waitForUrl(URL_PATTERNS.UserProfile);
  });
});
