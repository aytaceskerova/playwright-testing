import { test } from './fixtures/base';
import { RegistrationData } from '../types/registration';
import { ERROR_BORDER_COLOR } from '../data/constants/cssPatterns';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../data/constants/emailConstants';
import { FIELD_LENGTHS } from '../data/constants/fieldLengths';
import { REGEX_PATTERNS } from '../data/constants/regexPatterns';
import { URL_PATTERNS } from '../data/constants/urlPatterns';
import {
  AQA_PRACTICE_OPTIONS,
  USER_PROFILE_EDIT_DATA,
  USER_PROFILE_LABELS,
  USER_PROFILE_VALUES,
} from '../data/constants/userProfileTestData';
import { VALIDATION_MESSAGES } from '../data/constants/validationMessages';
import { InvalidEmailTestData } from '../data/enums/emailTestData';
import { RegistrationTestData } from '../data/pojos/registrationData';

test.describe('User profile page', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage, signInPage, userProfilePage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.openRegistrationPage();
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
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
test.describe('Edit personal information flyout', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ registrationPage, signInPage, userProfilePage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.openRegistrationPage();
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.actions.click(registrationPage.submitButton);
    await registrationPage.assertions.verifyPageToHaveUrl(URL_PATTERNS.Login);
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
    await test.step('Update the First name', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.userName,
        `${updatedFirstName} ${registeredUser.lastName}`,
      );
    });
  });
  test('[AQAPRACT-550] Edit "Last name" on User profile flyout', async ({ userProfilePage }) => {
    const updatedLastName = USER_PROFILE_EDIT_DATA.UpdatedLastName;
    await test.step('Update the Last name', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, updatedLastName);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.userName,
        `${registeredUser.firstName} ${updatedLastName}`,
      );
    });
  });
  test('[AQAPRACT-551] Edit "Email" on User profile flyout', async ({ userProfilePage }) => {
    const updatedEmail = `${EMAIL_PREFIXES.Updated}${Date.now()}@${EMAIL_DOMAIN}`;
    await test.step('Update the email address', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.emailInput, updatedEmail);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.emailInput, updatedEmail);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.actions.reload();
      await userProfilePage.waitForUserProfileReady();
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.getProfileValue(USER_PROFILE_LABELS.Email),
        updatedEmail,
      );
    });
  });

  test('[AQAPRACT-552] Edit "Date of Birth" on User profile flyout', async ({ userProfilePage }) => {
    const updatedDate = USER_PROFILE_EDIT_DATA.UpdatedDateOfBirth;
    await test.step('Update the Date of birth', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.dateOfBirthInput, updatedDate);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.dateOfBirthInput, updatedDate);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.getProfileValue(USER_PROFILE_LABELS.DateOfBirth),
        updatedDate,
      );
    });
  });
  test('[AQAPRACT-553] Cancel editing the data on the flyout (after the data is edited)', async ({ userProfilePage }) => {
    await test.step('Update any field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, USER_PROFILE_EDIT_DATA.TempValue);
      await userProfilePage.assertions.verifyElementToHaveValue(
        userProfilePage.editFlyout.firstNameInput,
        USER_PROFILE_EDIT_DATA.TempValue,
      );
    });
    await test.step('Click the "Cancel" button', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.cancelButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.userName,
        `${registeredUser.firstName} ${registeredUser.lastName}`,
      );
    });
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
    await test.step('Change any field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, USER_PROFILE_EDIT_DATA.TempValue);
      await userProfilePage.assertions.verifyElementToHaveValue(
        userProfilePage.editFlyout.lastNameInput,
        USER_PROFILE_EDIT_DATA.TempValue,
      );
    });
    await test.step('Click the "X" button', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.closeButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.userName,
        `${registeredUser.firstName} ${registeredUser.lastName}`,
      );
    });
  });

  test('[AQAPRACT-556] Leave "First name" field empty on "Edit personal information" flyout', async ({ userProfilePage }) => {
    await test.step('Delete value from the "First name" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, '');
      await userProfilePage.actions.blur(userProfilePage.editFlyout.firstNameInput);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.firstNameInput, '');
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
  });

  test('[AQAPRACT-557] Edit the "First name" with 1 character length', async ({ userProfilePage }) => {
    const updatedFirstName = USER_PROFILE_EDIT_DATA.FirstNameSingleChar;
    await test.step('Enter 1 character to the "First name" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.userName,
        `${updatedFirstName} ${registeredUser.lastName}`,
      );
    });
  });

  test('[AQAPRACT-558] Edit the "First name" with 255 character length', async ({ userProfilePage }) => {
    const updatedFirstName = USER_PROFILE_EDIT_DATA.FirstNameRepeatChar.repeat(FIELD_LENGTHS.NameMax);
    await test.step('Enter 255 characters to the "First name" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.userName,
        `${updatedFirstName} ${registeredUser.lastName}`,
      );
    });
  });

  test('[AQAPRACT-559] Edit the "First name" with 256 character length', async ({ userProfilePage }) => {
    const updatedFirstName = USER_PROFILE_EDIT_DATA.FirstNameRepeatChar.repeat(FIELD_LENGTHS.NameMaxPlus);
    await test.step('Enter 256 characters to the "First name" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.firstNameInput, updatedFirstName);
      await userProfilePage.assertions.verifyElementToBeEnabled(userProfilePage.editFlyout.saveButton);
    });
    await test.step('Click the "Save" button', async () => {
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
  });

  test('[AQAPRACT-560] Edit the "First name" field with spaces', async ({ userProfilePage }) => {
    await test.step('Enter spaces to the "First name" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.firstNameInput, USER_PROFILE_EDIT_DATA.SpacesValue);
      await userProfilePage.assertions.verifyElementToBeEnabled(userProfilePage.editFlyout.saveButton);
    });
    await test.step('Click the "Save" button', async () => {
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
  });

  test('[AQAPRACT-561] Leave "Last name" field empty on "Edit personal information" flyout', async ({ userProfilePage }) => {
    await test.step('Delete value from the "Last name" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, '');
      await userProfilePage.actions.blur(userProfilePage.editFlyout.lastNameInput);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.lastNameInput, '');
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
  });

  test('[AQAPRACT-562] Edit the "Last name" with 1 character length', async ({ userProfilePage }) => {
    const updatedLastName = USER_PROFILE_EDIT_DATA.LastNameSingleChar;
    await test.step('Enter 1 character to the "Last name" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, updatedLastName);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.userName,
        `${registeredUser.firstName} ${updatedLastName}`,
      );
    });
  });

  test('[AQAPRACT-563] Edit the "Last name" with 255 character length', async ({ userProfilePage }) => {
    const updatedLastName = USER_PROFILE_EDIT_DATA.LastNameRepeatChar.repeat(FIELD_LENGTHS.NameMax);
    await test.step('Enter 255 characters to the "Last name" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, updatedLastName);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.lastNameInput, updatedLastName);
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.userName,
        `${registeredUser.firstName} ${updatedLastName}`,
      );
    });
  });

  test('[AQAPRACT-564] Edit the "Last name" with 256 character length', async ({ userProfilePage }) => {
    const updatedLastName = USER_PROFILE_EDIT_DATA.LastNameRepeatChar.repeat(FIELD_LENGTHS.NameMaxPlus);
    await test.step('Enter 256 characters to the "Last name" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, updatedLastName);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.lastNameInput, updatedLastName);
      await userProfilePage.assertions.verifyElementToBeEnabled(userProfilePage.editFlyout.saveButton);
    });
    await test.step('Click the "Save" button', async () => {
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
  });

  test('[AQAPRACT-565] Edit the "Last name" field with spaces', async ({ userProfilePage }) => {
    await test.step('Enter spaces to the "Last name" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.lastNameInput, USER_PROFILE_EDIT_DATA.SpacesValue);
      await userProfilePage.assertions.verifyElementToBeEnabled(userProfilePage.editFlyout.saveButton);
    });
    await test.step('Click the "Save" button', async () => {
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
  });

  test('[AQAPRACT-566] Edit the date with empty "Date of birth" field', async ({ userProfilePage }) => {
    await test.step('Leave the "Date of birth" field empty', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.dateOfBirthInput, '');
      await userProfilePage.actions.blur(userProfilePage.editFlyout.dateOfBirthInput);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.dateOfBirthInput, '');
      await userProfilePage.assertions.verifyElementToBeDisabled(userProfilePage.editFlyout.saveButton);
    });
  });

  test('[AQAPRACT-567] The elements on the calendar picker are available', async ({ userProfilePage }) => {
    await test.step('Open the "Date of birth" calendar', async () => {
      await userProfilePage.editFlyout.openEditDatePicker();
      await userProfilePage.assertions.verifyElementToBeVisible(userProfilePage.editFlyout.editCalendar);
    });
    await test.step('Navigate through months and years', async () => {
      const startHeader = await userProfilePage.actions.retrieveElementTextContent(
        userProfilePage.editFlyout.editCalendarHeader,
      );
      await userProfilePage.actions.click(userProfilePage.editFlyout.editCalendarNextButton);
      const nextHeader = await userProfilePage.actions.retrieveElementTextContent(
        userProfilePage.editFlyout.editCalendarHeader,
      );
      await userProfilePage.assertions.verifyValueNotToBe(nextHeader, startHeader);
      await userProfilePage.actions.click(userProfilePage.editFlyout.editCalendarPrevButton);
    });
    await test.step('Select any available day', async () => {
      await userProfilePage.editFlyout.selectEditCalendarDay();
      await userProfilePage.assertions.verifyElementToHaveValue(
        userProfilePage.editFlyout.dateOfBirthInput,
        REGEX_PATTERNS.NonEmpty,
      );
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.editCalendar);
    });
  });

  test('[AQAPRACT-568] The date is filled in manually in the "Date of birth" field', async ({ userProfilePage }) => {
    const manualDate = USER_PROFILE_EDIT_DATA.ManualDateOfBirth;
    await test.step('Open the "Date of birth" field', async () => {
      await userProfilePage.editFlyout.openEditDatePicker();
      await userProfilePage.assertions.verifyElementToHaveAttribute(
        userProfilePage.editFlyout.dateOfBirthInput,
        'placeholder',
        REGEX_PATTERNS.DatePlaceholder,
      );
    });
    await test.step('Enter the "Date of birth" value manually', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.dateOfBirthInput, manualDate);
      await userProfilePage.editFlyout.closeEditCalendar();
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.dateOfBirthInput, manualDate);
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.actions.click(userProfilePage.editFlyout.saveButton);
      await userProfilePage.assertions.verifyElementToBeHidden(userProfilePage.editFlyout.title);
      await userProfilePage.assertions.verifyElementToHaveText(
        userProfilePage.getProfileValue(USER_PROFILE_LABELS.DateOfBirth),
        manualDate,
      );
    });
  });

  test('[AQAPRACT-569] Edit the date with empty "Email" field', async ({ userProfilePage }) => {
    await test.step('Delete value from the "Email" field', async () => {
      await userProfilePage.actions.fill(userProfilePage.editFlyout.emailInput, '');
      await userProfilePage.actions.blur(userProfilePage.editFlyout.emailInput);
      await userProfilePage.assertions.verifyElementToHaveValue(userProfilePage.editFlyout.emailInput, '');
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
  });

  test('[AQAPRACT-570] Edit with invalid email format in the "Email" field', async ({ userProfilePage }) => {
    for (const invalidEmail of InvalidEmailTestData) {
      await test.step(`Enter invalid email: ${invalidEmail}`, async () => {
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
      });
    }
  });

});

