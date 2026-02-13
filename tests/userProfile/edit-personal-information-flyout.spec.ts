import { test } from '../fixtures/base';
import { BLANK } from '../../data/constants/commonValues';
import { RegistrationData } from '../../types/registration';
import { ERROR_BORDER_COLOR } from '../../data/constants/cssPatterns';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../../data/constants/emailConstants';
import { FIELD_LENGTHS } from '../../data/constants/fieldLengths';
import { REGEX_PATTERNS } from '../../data/constants/regexPatterns';
import { URL_PATHS } from '../../data/constants/urlPaths';
import { URL_PATTERNS } from '../../data/constants/urlPatterns';
import {
  USER_PROFILE_EDIT_DATA,
  USER_PROFILE_LABELS,
} from '../../data/constants/userProfileTestData';
import { VALIDATION_MESSAGES } from '../../data/constants/validationMessages';
import { InvalidEmailTestData } from '../../data/enums/emailTestData';
import { KeyboardKey } from '../../data/enums/keyboardKeys';
import { RegistrationTestData } from '../../data/pojos/registrationData';

test.describe('Edit personal information flyout', () => {
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
    await userProfilePage.openEditFlyout();
  });

  test('[AQAPRACT-548] "Edit personal information" flyout available', async ({ userProfilePage }) => {
    await test.step('Verify flyout elements', async () => {
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.subtitle);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.closeButton);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.firstNameInput);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.lastNameInput);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.emailInput);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.dateOfBirthInput);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.cancelButton);
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.saveButton);
    });
    await test.step('Verify pre-filled values', async () => {
      const [year, month, day] = registeredUser.dateOfBirth.split('-');
      await userProfilePage.assertions.verifyElementToHaveValue(
        userProfilePage.editFlyout.firstNameInput,
        registeredUser.firstName,
      );
      await userProfilePage.assertions.verifyElementToHaveValue(
        userProfilePage.editFlyout.lastNameInput,
        registeredUser.lastName,
      );
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.emailInput, registeredUser.email);
      await userProfilePage.assertions.verifyElementToHaveValue(
        userProfilePage.editFlyout.dateOfBirthInput,
        `${day}/${month}/${year}`,
      );
    });
  });

  test('[AQAPRACT-549] Edit "First name" on User profile flyout', async ({ userProfilePage }) => {
    const updatedFirstName = USER_PROFILE_EDIT_DATA.UpdatedFirstName;
    await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.userName,
      `${updatedFirstName} ${registeredUser.lastName}`,
    );
  });

  test('[AQAPRACT-550] Edit "Last name" on User profile flyout', async ({ userProfilePage }) => {
    const updatedLastName = USER_PROFILE_EDIT_DATA.UpdatedLastName;
    await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.userName,
      `${registeredUser.firstName} ${updatedLastName}`,
    );
  });

  test.fail('[AQAPRACT-551] Edit "Email" on User profile flyout', async ({ userProfilePage }) => {
    const updatedEmail = `${EMAIL_PREFIXES.Updated}${Date.now()}@${EMAIL_DOMAIN}`;
    await userProfilePage.actions.fill(userProfilePage.editFlyout.emailInput, updatedEmail);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.emailInput, updatedEmail);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.actions.reload();
    await userProfilePage.waitForUserProfileReady();
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.getProfileValue(USER_PROFILE_LABELS.Email),
      updatedEmail,
    );
  });

  test('[AQAPRACT-552] Edit "Date of Birth" on User profile flyout', async ({ userProfilePage }) => {
    const updatedDate = USER_PROFILE_EDIT_DATA.UpdatedDateOfBirth;
    await userProfilePage.actions.fill(userProfilePage.editFlyout.dateOfBirthInput, updatedDate);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.dateOfBirthInput, updatedDate);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.getProfileValue(USER_PROFILE_LABELS.DateOfBirth),
      updatedDate,
    );
  });

  test('[AQAPRACT-553] Cancel editing the data on the flyout (after the data is edited)', async ({ userProfilePage }) => {
    await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, USER_PROFILE_EDIT_DATA.TempValue);
    await userProfilePage.assertions.verifyElementToHaveValue(
      userProfilePage.editFlyout.firstNameInput,
      USER_PROFILE_EDIT_DATA.TempValue,
    );
    await userProfilePage.actions.click(userProfilePage.editFlyout.cancelButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.userName,
      `${registeredUser.firstName} ${registeredUser.lastName}`,
    );
  });

  test('[AQAPRACT-554] Cancel editing the data on the flyout (without editing)', async ({ userProfilePage }) => {
    await userProfilePage.actions.click(userProfilePage.editFlyout.cancelButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.userName,
      `${registeredUser.firstName} ${registeredUser.lastName}`,
    );
  });

  test('[AQAPRACT-555] Close "Edit personal information" flyout by "X" button', async ({ userProfilePage }) => {
    await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, USER_PROFILE_EDIT_DATA.TempValue);
    await userProfilePage.assertions.verifyElementToHaveValue(
      userProfilePage.editFlyout.lastNameInput,
      USER_PROFILE_EDIT_DATA.TempValue,
    );
    await userProfilePage.actions.click(userProfilePage.editFlyout.closeButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.userName,
      `${registeredUser.firstName} ${registeredUser.lastName}`,
    );
  });

  test('[AQAPRACT-556] Leave "First name" field empty on "Edit personal information" flyout', async ({ userProfilePage }) => {
    await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, BLANK);
    await userProfilePage.actions.blur(userProfilePage.editFlyout.firstNameInput);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.firstNameInput, BLANK);
    await userProfilePage.assertions.verifyElementToHaveCss(
      userProfilePage.editFlyout.firstNameInput,
      'border-color',
      ERROR_BORDER_COLOR,
    );
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.editFirstNameError);
    await userProfilePage.assertions.verifyElementToContainText(
      userProfilePage.editFlyout.editFirstNameError,
      VALIDATION_MESSAGES.Required,
    );
    await userProfilePage.assertions.verifyElementToBeDisabled(userProfilePage.editFlyout.saveButton);
  });

  test('[AQAPRACT-557] Edit the "First name" with 1 character length', async ({ userProfilePage }) => {
    const updatedFirstName = USER_PROFILE_EDIT_DATA.FirstNameSingleChar;
    await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.userName,
      `${updatedFirstName} ${registeredUser.lastName}`,
    );
  });

  test('[AQAPRACT-558] Edit the "First name" with 255 character length', async ({ userProfilePage }) => {
    const updatedFirstName = USER_PROFILE_EDIT_DATA.FirstNameRepeatChar.repeat(FIELD_LENGTHS.NameMax);
    await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.userName,
      `${updatedFirstName} ${registeredUser.lastName}`,
    );
  });

  test.fail('[AQAPRACT-559] Edit the "First name" with 256 character length', async ({ userProfilePage }) => {
    const updatedFirstName = USER_PROFILE_EDIT_DATA.FirstNameRepeatChar.repeat(FIELD_LENGTHS.NameMaxPlus);
    await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    await userProfilePage.assertions.verifyElementToBeEnabled(userProfilePage.editFlyout.saveButton);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.editFirstNameError);
    await userProfilePage.assertions.verifyElementToContainText(
      userProfilePage.editFlyout.editFirstNameError,
      VALIDATION_MESSAGES.MaxNameLength,
    );
    await userProfilePage.assertions.verifyElementToHaveCss(
      userProfilePage.editFlyout.firstNameInput,
      'border-color',
      ERROR_BORDER_COLOR,
    );
  });

  test.fail('[AQAPRACT-560] Edit the "First name" field with spaces', async ({ userProfilePage }) => {
    await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, USER_PROFILE_EDIT_DATA.SpacesValue);
    await userProfilePage.assertions.verifyElementToBeEnabled(userProfilePage.editFlyout.saveButton);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.editFirstNameError);
    await userProfilePage.assertions.verifyElementToContainText(
      userProfilePage.editFlyout.editFirstNameError,
      VALIDATION_MESSAGES.Required,
    );
    await userProfilePage.assertions.verifyElementToHaveCss(
      userProfilePage.editFlyout.firstNameInput,
      'border-color',
      ERROR_BORDER_COLOR,
    );
  });

  test('[AQAPRACT-561] Leave "Last name" field empty on "Edit personal information" flyout', async ({ userProfilePage }) => {
    await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, BLANK);
    await userProfilePage.actions.blur(userProfilePage.editFlyout.lastNameInput);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.lastNameInput, BLANK);
    await userProfilePage.assertions.verifyElementToHaveCss(
      userProfilePage.editFlyout.lastNameInput,
      'border-color',
      ERROR_BORDER_COLOR,
    );
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.editLastNameError);
    await userProfilePage.assertions.verifyElementToContainText(
      userProfilePage.editFlyout.editLastNameError,
      VALIDATION_MESSAGES.Required,
    );
    await userProfilePage.assertions.verifyElementToBeDisabled(userProfilePage.editFlyout.saveButton);
  });

  test('[AQAPRACT-562] Edit the "Last name" with 1 character length', async ({ userProfilePage }) => {
    const updatedLastName = USER_PROFILE_EDIT_DATA.LastNameSingleChar;
    await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.userName,
      `${registeredUser.firstName} ${updatedLastName}`,
    );
  });

  test('[AQAPRACT-563] Edit the "Last name" with 255 character length', async ({ userProfilePage }) => {
    const updatedLastName = USER_PROFILE_EDIT_DATA.LastNameRepeatChar.repeat(FIELD_LENGTHS.NameMax);
    await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.userName,
      `${registeredUser.firstName} ${updatedLastName}`,
    );
  });

  test.fail('[AQAPRACT-564] Edit the "Last name" with 256 character length', async ({ userProfilePage }) => {
    const updatedLastName = USER_PROFILE_EDIT_DATA.LastNameRepeatChar.repeat(FIELD_LENGTHS.NameMaxPlus);
    await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    await userProfilePage.assertions.verifyElementToBeEnabled(userProfilePage.editFlyout.saveButton);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.editLastNameError);
    await userProfilePage.assertions.verifyElementToContainText(
      userProfilePage.editFlyout.editLastNameError,
      VALIDATION_MESSAGES.MaxNameLength,
    );
    await userProfilePage.assertions.verifyElementToHaveCss(
      userProfilePage.editFlyout.lastNameInput,
      'border-color',
      ERROR_BORDER_COLOR,
    );
  });

  test.fail('[AQAPRACT-565] Edit the "Last name" field with spaces', async ({ userProfilePage }) => {
    await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, USER_PROFILE_EDIT_DATA.SpacesValue);
    await userProfilePage.assertions.verifyElementToBeEnabled(userProfilePage.editFlyout.saveButton);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.editLastNameError);
    await userProfilePage.assertions.verifyElementToContainText(
      userProfilePage.editFlyout.editLastNameError,
      VALIDATION_MESSAGES.Required,
    );
    await userProfilePage.assertions.verifyElementToHaveCss(
      userProfilePage.editFlyout.lastNameInput,
      'border-color',
      ERROR_BORDER_COLOR,
    );
  });

  test('[AQAPRACT-566] Edit the date with empty "Date of birth" field', async ({ userProfilePage }) => {
    await userProfilePage.actions.fill(userProfilePage.editFlyout.dateOfBirthInput, BLANK);
    await userProfilePage.actions.blur(userProfilePage.editFlyout.dateOfBirthInput);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.dateOfBirthInput, BLANK);
    await userProfilePage.assertions.verifyElementToBeDisabled(userProfilePage.editFlyout.saveButton);
  });

  test('[AQAPRACT-567] The elements on the calendar picker are available', async ({ userProfilePage }) => {
    await userProfilePage.editFlyout.openEditDatePicker();
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.editCalendar);
    const startHeader = await userProfilePage.actions.retrieveElementTextContent(
      userProfilePage.editFlyout.editCalendarHeader,
    );
    await userProfilePage.actions.click(userProfilePage.editFlyout.editCalendarNextButton);
    const nextHeader = await userProfilePage.actions.retrieveElementTextContent(
      userProfilePage.editFlyout.editCalendarHeader,
    );
    await userProfilePage.assertions.verifyValueNotToBe(nextHeader, startHeader);
    await userProfilePage.actions.click(userProfilePage.editFlyout.editCalendarPrevButton);
    await userProfilePage.editFlyout.selectEditCalendarDay();
    await userProfilePage.assertions.verifyElementToHaveValue(
      userProfilePage.editFlyout.dateOfBirthInput,
      REGEX_PATTERNS.NonEmpty,
    );
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.editCalendar);
  });

  test('[AQAPRACT-568] The date is filled in manually in the "Date of birth" field', async ({ userProfilePage }) => {
    const manualDate = USER_PROFILE_EDIT_DATA.ManualDateOfBirth;
    await userProfilePage.editFlyout.openEditDatePicker();
    await userProfilePage.assertions.verifyElementToHaveAttribute(
      userProfilePage.editFlyout.dateOfBirthInput,
      'placeholder',
      REGEX_PATTERNS.DatePlaceholder,
    );
    await userProfilePage.actions.fill(userProfilePage.editFlyout.dateOfBirthInput, manualDate);
    await userProfilePage.actions.pressKey(KeyboardKey.Escape);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.dateOfBirthInput, manualDate);
    await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
    await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
    await userProfilePage.assertions.verifyElementToHaveText(
      userProfilePage.getProfileValue(USER_PROFILE_LABELS.DateOfBirth),
      manualDate,
    );
  });

  test('[AQAPRACT-569] Edit the date with empty "Email" field', async ({ userProfilePage }) => {
    await userProfilePage.actions.fill(userProfilePage.editFlyout.emailInput, BLANK);
    await userProfilePage.actions.blur(userProfilePage.editFlyout.emailInput);
    await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.emailInput, BLANK);
    await userProfilePage.assertions.verifyElementToHaveCss(
      userProfilePage.editFlyout.emailInput,
      'border-color',
      ERROR_BORDER_COLOR,
    );
    await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.editEmailError);
    await userProfilePage.assertions.verifyElementToContainText(
      userProfilePage.editFlyout.editEmailError,
      VALIDATION_MESSAGES.Required,
    );
  });

  test('[AQAPRACT-570] Edit with invalid email format in the "Email" field', async ({ userProfilePage }) => {
    for (const invalidEmail of InvalidEmailTestData) {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.emailInput, invalidEmail);
      await userProfilePage.actions.blur(userProfilePage.editFlyout.emailInput);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.emailInput, invalidEmail);
      await userProfilePage.assertions.verifyElementToHaveCss(
        userProfilePage.editFlyout.emailInput,
        'border-color',
        ERROR_BORDER_COLOR,
      );
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.editEmailError);
      await userProfilePage.assertions.verifyElementToContainText(
        userProfilePage.editFlyout.editEmailError,
        VALIDATION_MESSAGES.InvalidEmail,
      );
      await userProfilePage.assertions.verifyElementToBeDisabled(userProfilePage.editFlyout.saveButton);
    }
  });
});
