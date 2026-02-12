import { test } from '../fixtures/base';
import { RegistrationData } from '../../types/registration';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import {
  AQA_PRACTICE_OPTIONS,
  USER_PROFILE_LABELS,
  USER_PROFILE_VALUES,
} from '../../data/constants/userProfileTestData';
import { RegistrationTestData } from '../../data/pojos/registrationData';

test.describe('User profile page', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage, signInPage, userProfilePage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.actions.goto(URL_PATHS.Registration);
    await registrationPage.fillAllFields(registeredUser);
    await Promise.all([
      registrationPage.waiters.waitForUrl(URL_PATTERNS.Login),
      registrationPage.actions.click(registrationPage.submitButton),
    ]);
    await signInPage.signIn(registeredUser.email, registeredUser.password);
    await userProfilePage.waitForUserProfileReady();
  });

  test('[AQAPRACT-545] "User profile" page layout', async ({ userProfilePage }) => {
    await test.step('Verify header', async () => {
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.headerLogo);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.headerBrand);
    });
    await test.step('Verify main profile elements', async () => {
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.profileAvatar);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.userName);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editButton);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.aqaPracticeButton);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.aqaPracticeExpandIcon);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.signOut);
    });
    await test.step('Verify profile information', async () => {
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.getProfileValue(USER_PROFILE_LABELS.Position),
        USER_PROFILE_VALUES.Position,
      );
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.getProfileValue(USER_PROFILE_LABELS.Technologies),
        USER_PROFILE_VALUES.Technologies,
      );
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.getProfileValue(USER_PROFILE_LABELS.Email),
        registeredUser.email,
      );
      const [year, month, day] = registeredUser.dateOfBirth.split('-');
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.getProfileValue(USER_PROFILE_LABELS.DateOfBirth),
        `${day}/${month}/${year}`,
      );
    });
    await test.step('Verify footer', async () => {
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.footerLogo);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.footerContactUs);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.footerPhone);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.footerEmail);
    });
  });

  test('[AQAPRACT-546] Successful Sign Out', async ({ userProfilePage, signInPage }) => {
    await userProfilePage.actions.click(userProfilePage.signOut);
    await userProfilePage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
    await signInPage.assertions.verifyElementToBeVisible(signInPage.signInButton);
  });

  test('[AQAPRACT-547] "AQA Practice" dropdown options validation', async ({ userProfilePage }) => {
    await test.step('Open the dropdown by hover', async () => {
      await userProfilePage.actions.hover(userProfilePage.aqaPracticeButton);
    });
    await test.step('Validate available options', async () => {
      for (const option of AQA_PRACTICE_OPTIONS) {
        await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.getAqaPracticeOption(option));
      }
    });
    await test.step('Dropdown is not static', async () => {
      await userProfilePage.actions.moveMouse(0, 0);
      await userProfilePage.assertions.verifyElementToBeHidden(
        userProfilePage.getAqaPracticeOption(AQA_PRACTICE_OPTIONS[0]),
      );
    });
  });
});
