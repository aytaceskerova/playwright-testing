import { test } from '../fixtures/base';
import { RegistrationData } from '../../types/registration';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import {
  FINISH_BUTTON_ENABLED_CLASS,
  DRAG_DROP_CHIPS,
} from '../../data/constants/dragDropPageTestData';
import { AQA_PRACTICE_OPTIONS } from '../../data/constants/userProfileTestData';
import { RegistrationTestData } from '../../data/pojos/registrationData';

test.describe('Drag & Drop page', () => {
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
      userProfilePage.getAqaPracticeOption(AQA_PRACTICE_OPTIONS[1]),
    );
    await userProfilePage.waiters.waitForPageReady('networkidle');
  });

  test('[AQAPRACT-583] "Drag & Drop" page elements validation', async ({
    dragDropPage,
  }) => {
    await dragDropPage.assertions.verifyMultipleElementsToBeVisible(
      dragDropPage.backToProfileLink,
      dragDropPage.sortYourResponsibilitiesTitle,
      dragDropPage.placeTheBlocksSubtitle,
      dragDropPage.manual1,
      dragDropPage.manual2,
      dragDropPage.auto1,
      dragDropPage.auto2,
      dragDropPage.manualWorkSection,
      dragDropPage.automationWorkSection,
      dragDropPage.finishButton,
    );
    await dragDropPage.assertions.verifyElementNotToHaveClass(
      dragDropPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );
  });

  test('[AQAPRACT-584] Redirection to the user profile after finishing course', async ({
    dragDropPage,
    userProfilePage,
  }) => {
    await dragDropPage.moveAllChipsToCorrectFields();
    await dragDropPage.assertions.verifyElementToHaveClass(
      dragDropPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );
    await dragDropPage.assertions.verifyElementToBeVisible(
      dragDropPage.congratulationsPopUp,
    );
    await dragDropPage.actions.click(dragDropPage.finishButton);
    await userProfilePage.waiters.waitForUrl(URL_PATTERNS.UserProfile);
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
  });

  test('[AQAPRACT-585] Moving "Write test cases" chip to the first column of "Manual Work" section', async ({
    dragDropPage,
  }) => {
    await dragDropPage.actions.dragTo(
      dragDropPage.manual1,
      dragDropPage.manualWorkColumn1,
    );
    await dragDropPage.assertions.verifyElementToBeVisible(
      dragDropPage.isChipInColumn(DRAG_DROP_CHIPS[0], dragDropPage.manualWorkColumn1),
    );
    await dragDropPage.assertions.verifyElementNotToHaveClass(
      dragDropPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );
  });

  test('[AQAPRACT-586] Moving "Testing requirements" chip to the second column of "Manual Work"', async ({
    dragDropPage,
  }) => {
    await dragDropPage.actions.dragTo(
      dragDropPage.manual2,
      dragDropPage.manualWorkColumn2,
    );
    await dragDropPage.assertions.verifyElementToBeVisible(
      dragDropPage.isChipInColumn(DRAG_DROP_CHIPS[1], dragDropPage.manualWorkColumn2),
    );
    await dragDropPage.assertions.verifyElementNotToHaveClass(
      dragDropPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );
  });

  test('[AQAPRACT-587] Moving "Write automation scripts" chip to the first column of "Automation Work"', async ({
    dragDropPage,
  }) => {
    await dragDropPage.actions.dragTo(
      dragDropPage.auto1,
      dragDropPage.automationWorkColumn1,
    );
    await dragDropPage.assertions.verifyElementToBeVisible(
      dragDropPage.isChipInColumn(DRAG_DROP_CHIPS[2], dragDropPage.automationWorkColumn1),
    );
    await dragDropPage.assertions.verifyElementNotToHaveClass(
      dragDropPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );
  });

  test('[AQAPRACT-588] Moving "Framework set up" chip to the second column of "Automation Work"', async ({
    dragDropPage,
  }) => {
    await dragDropPage.actions.dragTo(
      dragDropPage.auto2,
      dragDropPage.automationWorkColumn2,
    );
    await dragDropPage.assertions.verifyElementToBeVisible(
      dragDropPage.isChipInColumn(DRAG_DROP_CHIPS[3], dragDropPage.automationWorkColumn2),
    );
    await dragDropPage.assertions.verifyElementNotToHaveClass(
      dragDropPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );
  });

  test('[AQAPRACT-589] Availability of "Finish" button after transferring all chips', async ({
    dragDropPage,
  }) => {
    await dragDropPage.assertions.verifyElementNotToHaveClass(
      dragDropPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );
    await dragDropPage.moveAllChipsToCorrectFields();
    await dragDropPage.assertions.verifyElementToHaveClass(
      dragDropPage.finishButton,
      FINISH_BUTTON_ENABLED_CLASS,
    );
    await dragDropPage.assertions.verifyElementToBeVisible(
      dragDropPage.congratulationsPopUp,
    );
  });

  test('[AQAPRACT-590] Moving chips to the wrong column', async ({ dragDropPage }) => {
    await dragDropPage.actions.dragTo(
      dragDropPage.manual1,
      dragDropPage.automationWorkColumn1,
    );
    await dragDropPage.assertions.verifyElementToHaveCount(
      dragDropPage.automationWorkColumn1.getByText(DRAG_DROP_CHIPS[0]),
      0,
    );

    await dragDropPage.actions.dragTo(
      dragDropPage.manual2,
      dragDropPage.automationWorkColumn2,
    );
    await dragDropPage.assertions.verifyElementToHaveCount(
      dragDropPage.automationWorkColumn2.getByText(DRAG_DROP_CHIPS[1]),
      0,
    );

    await dragDropPage.actions.dragTo(
      dragDropPage.auto1,
      dragDropPage.manualWorkColumn1,
    );
    await dragDropPage.assertions.verifyElementToHaveCount(
      dragDropPage.manualWorkColumn1.getByText(DRAG_DROP_CHIPS[2]),
      0,
    );

    await dragDropPage.actions.dragTo(
      dragDropPage.auto2,
      dragDropPage.manualWorkColumn2,
    );
    await dragDropPage.assertions.verifyElementToHaveCount(
      dragDropPage.manualWorkColumn2.getByText(DRAG_DROP_CHIPS[3]),
      0,
    );
  });
});
