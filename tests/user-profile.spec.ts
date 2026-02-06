import { test, expect } from './fixtures/base';
import { RegistrationData } from '../types/registration';
import { RegistrationTestData } from '../data/registrationData';
import { ERROR_BORDER_COLOR } from '../enums/cssPatterns';
import { InvalidEmailTestData } from '../enums/emailTestData';

test.describe('User profile page', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ page, registrationPage, signInPage, userProfilePage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.openRegistrationPage();
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.clickSubmitButton();
    await expect(page).toHaveURL(/.*login/);
    await signInPage.signIn(registeredUser.email, registeredUser.password);
    await userProfilePage.waitForPageLoad();
  });
  test('[AQAPRACT-545] "User profile" page layout', async ({ userProfilePage }) => {
    await test.step('Verify header', async () => {
      await expect(userProfilePage.headerLogo).toBeVisible();
      await expect(userProfilePage.headerBrand).toBeVisible();
    });
    await test.step('Verify main profile elements', async () => {
      await expect(userProfilePage.profileAvatar).toBeVisible();
      await expect(userProfilePage.userName).toBeVisible();
      await expect(userProfilePage.editButton).toBeVisible();
      await expect(userProfilePage.aqaPracticeButton).toBeVisible();
      await expect(userProfilePage.aqaPracticeExpandIcon).toBeVisible();
      await expect(userProfilePage.signOut).toBeVisible();
    });
    await test.step('Verify profile information', async () => {
      await expect(userProfilePage.getProfileValue('Position')).toHaveText('QA Engineer');
      await expect(userProfilePage.getProfileValue('Technologies')).toHaveText('QA Manual');
      await expect(userProfilePage.getProfileValue('E-mail')).toHaveText(registeredUser.email);
      const [year, month, day] = registeredUser.dateOfBirth.split('-');
      await expect(userProfilePage.getProfileValue('Date of birth')).toHaveText(`${day}/${month}/${year}`);
    });
    await test.step('Verify footer', async () => {
      await expect(userProfilePage.footerLogo).toBeVisible();
      await expect(userProfilePage.footerContactUs).toBeVisible();
      await expect(userProfilePage.footerPhone).toBeVisible();
      await expect(userProfilePage.footerEmail).toBeVisible();
    });
  });
  test('[AQAPRACT-546] Successful Sign Out', async ({ page, userProfilePage, signInPage }) => {
    await userProfilePage.signOut.click();
    await expect(page).toHaveURL(/.*login/);
    await expect(signInPage.signInButton).toBeVisible();
  });
  test('[AQAPRACT-547] "AQA Practice" dropdown options validation', async ({ page, userProfilePage }) => {
    await test.step('Open the dropdown by hover', async () => {
      await userProfilePage.aqaPracticeButton.hover();
    });
    await test.step('Validate available options', async () => {
      await expect(userProfilePage.getAqaPracticeOption('Select')).toBeVisible();
      await expect(userProfilePage.getAqaPracticeOption('Drag & Drop')).toBeVisible();
      await expect(userProfilePage.getAqaPracticeOption('Actions, Alerts & Iframes')).toBeVisible();
    });
    await test.step('Dropdown is not static', async () => {
      await page.mouse.move(0, 0);
      await expect(userProfilePage.getAqaPracticeOption('Select')).toBeHidden();
    });
  });
});
test.describe('Edit personal information flyout', () => {
  let registeredUser: RegistrationData;
  test.beforeEach(async ({ page, registrationPage, signInPage, userProfilePage }) => {
    registeredUser = new RegistrationTestData();
    await registrationPage.openRegistrationPage();
    await registrationPage.fillAllFields(registeredUser);
    await registrationPage.clickSubmitButton();
    await expect(page).toHaveURL(/.*login/);
    await signInPage.signIn(registeredUser.email, registeredUser.password);
    await userProfilePage.waitForPageLoad();
    await userProfilePage.openEditFlyout();
  });
  test('[AQAPRACT-548] "Edit personal information" flyout available', async ({ userProfilePage }) => {
    await test.step('Verify flyout elements', async () => {
      await expect(userProfilePage.editFlyout.title).toBeVisible();
      await expect(userProfilePage.editFlyout.subtitle).toBeVisible();
      await expect(userProfilePage.editFlyout.closeButton).toBeVisible();
      await expect(userProfilePage.editFlyout.firstNameInput).toBeVisible();
      await expect(userProfilePage.editFlyout.lastNameInput).toBeVisible();
      await expect(userProfilePage.editFlyout.emailInput).toBeVisible();
      await expect(userProfilePage.editFlyout.dateOfBirthInput).toBeVisible();
      await expect(userProfilePage.editFlyout.cancelButton).toBeVisible();
      await expect(userProfilePage.editFlyout.saveButton).toBeVisible();
    });
    await test.step('Verify pre-filled values', async () => {
      const [year, month, day] = registeredUser.dateOfBirth.split('-');
      await expect(userProfilePage.editFlyout.firstNameInput).toHaveValue(registeredUser.firstName);
      await expect(userProfilePage.editFlyout.lastNameInput).toHaveValue(registeredUser.lastName);
      await expect(userProfilePage.editFlyout.emailInput).toHaveValue(registeredUser.email);
      await expect(userProfilePage.editFlyout.dateOfBirthInput).toHaveValue(`${day}/${month}/${year}`);
    });
  });
  test('[AQAPRACT-549] Edit "First name" on User profile flyout', async ({ userProfilePage }) => {
    const updatedFirstName = 'Aida';
    await test.step('Update the First name', async () => {
      await userProfilePage.editFlyout.firstNameInput.fill(updatedFirstName);
      await expect(userProfilePage.editFlyout.firstNameInput).toHaveValue(updatedFirstName);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${updatedFirstName} ${registeredUser.lastName}`);
    });
  });
  test('[AQAPRACT-550] Edit "Last name" on User profile flyout', async ({ userProfilePage }) => {
    const updatedLastName = 'Stone';
    await test.step('Update the Last name', async () => {
      await userProfilePage.editFlyout.lastNameInput.fill(updatedLastName);
      await expect(userProfilePage.editFlyout.lastNameInput).toHaveValue(updatedLastName);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${registeredUser.firstName} ${updatedLastName}`);
    });
  });
  test('[AQAPRACT-551] Edit "Email" on User profile flyout', async ({ page, userProfilePage, signInPage }) => {
    const updatedEmail = `updated-${Date.now()}@example.com`;
    await test.step('Update the email address', async () => {
      await userProfilePage.editFlyout.emailInput.fill(updatedEmail);
      await expect(userProfilePage.editFlyout.emailInput).toHaveValue(updatedEmail);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await page.reload();
      await userProfilePage.waitForPageLoad();
      await expect(userProfilePage.getProfileValue('E-mail')).toHaveText(updatedEmail);
    });
  });

  test('[AQAPRACT-552] Edit "Date of Birth" on User profile flyout', async ({ userProfilePage }) => {
    const updatedDate = '30/12/1999';
    await test.step('Update the Date of birth', async () => {
      await userProfilePage.editFlyout.dateOfBirthInput.fill(updatedDate);
      await expect(userProfilePage.editFlyout.dateOfBirthInput).toHaveValue(updatedDate);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await expect(userProfilePage.getProfileValue('Date of birth')).toHaveText(updatedDate);
    });
  });
  test('[AQAPRACT-553] Cancel editing the data on the flyout (after the data is edited)', async ({ userProfilePage }) => {
    await test.step('Update any field', async () => {
      await userProfilePage.editFlyout.firstNameInput.fill('Temp');
      await expect(userProfilePage.editFlyout.firstNameInput).toHaveValue('Temp');
    });
    await test.step('Click the "Cancel" button', async () => {
      await userProfilePage.editFlyout.cancelButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${registeredUser.firstName} ${registeredUser.lastName}`);
    });
  });
  test('[AQAPRACT-554] Cancel editing the data on the flyout (without editing)', async ({ userProfilePage }) => {
    await userProfilePage.editFlyout.cancelButton.click();
    await expect(userProfilePage.editFlyout.title).toBeHidden();
    await expect(userProfilePage.userName).toHaveText(`${registeredUser.firstName} ${registeredUser.lastName}`);
  });
  test('[AQAPRACT-555] Close "Edit personal information" flyout by "X" button', async ({ userProfilePage }) => {
    await test.step('Change any field', async () => {
      await userProfilePage.editFlyout.lastNameInput.fill('Temp');
      await expect(userProfilePage.editFlyout.lastNameInput).toHaveValue('Temp');
    });
    await test.step('Click the "X" button', async () => {
      await userProfilePage.editFlyout.closeButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${registeredUser.firstName} ${registeredUser.lastName}`);
    });
  });

  test('[AQAPRACT-556] Leave "First name" field empty on "Edit personal information" flyout', async ({ userProfilePage }) => {
    await test.step('Delete value from the "First name" field', async () => {
      await userProfilePage.editFlyout.firstNameInput.fill('');
      await userProfilePage.editFlyout.firstNameInput.blur();
      await expect(userProfilePage.editFlyout.firstNameInput).toHaveValue('');
      await expect(userProfilePage.editFlyout.firstNameInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
      await expect(userProfilePage.editFlyout.editFirstNameError).toBeVisible();
      await expect(userProfilePage.editFlyout.editFirstNameError).toContainText('Required');
      await expect(userProfilePage.editFlyout.saveButton).toBeDisabled();
    });
  });

  test('[AQAPRACT-557] Edit the "First name" with 1 character length', async ({ userProfilePage }) => {
    const updatedFirstName = 'A';
    await test.step('Enter 1 character to the "First name" field', async () => {
      await userProfilePage.editFlyout.firstNameInput.fill(updatedFirstName);
      await expect(userProfilePage.editFlyout.firstNameInput).toHaveValue(updatedFirstName);
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${updatedFirstName} ${registeredUser.lastName}`);
    });
  });

  test('[AQAPRACT-558] Edit the "First name" with 255 character length', async ({ userProfilePage }) => {
    const updatedFirstName = 'A'.repeat(255);
    await test.step('Enter 255 characters to the "First name" field', async () => {
      await userProfilePage.editFlyout.firstNameInput.fill(updatedFirstName);
      await expect(userProfilePage.editFlyout.firstNameInput).toHaveValue(updatedFirstName);
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${updatedFirstName} ${registeredUser.lastName}`);
    });
  });

  test('[AQAPRACT-559] Edit the "First name" with 256 character length', async ({ userProfilePage }) => {
    const updatedFirstName = 'A'.repeat(256);
    await test.step('Enter 256 characters to the "First name" field', async () => {
      await userProfilePage.editFlyout.firstNameInput.fill(updatedFirstName);
      await expect(userProfilePage.editFlyout.firstNameInput).toHaveValue(updatedFirstName);
      await expect(userProfilePage.editFlyout.saveButton).toBeEnabled();
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.editFirstNameError).toBeVisible();
      await expect(userProfilePage.editFlyout.editFirstNameError).toContainText("The value length shouldn't exceed 255 symbols.");
      await expect(userProfilePage.editFlyout.firstNameInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
    });
  });

  test('[AQAPRACT-560] Edit the "First name" field with spaces', async ({ userProfilePage }) => {
    await test.step('Enter spaces to the "First name" field', async () => {
      await userProfilePage.editFlyout.firstNameInput.fill('   ');
      await expect(userProfilePage.editFlyout.saveButton).toBeEnabled();
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.editFirstNameError).toBeVisible();
      await expect(userProfilePage.editFlyout.editFirstNameError).toContainText('Required');
      await expect(userProfilePage.editFlyout.firstNameInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
    });
  });

  test('[AQAPRACT-561] Leave "Last name" field empty on "Edit personal information" flyout', async ({ userProfilePage }) => {
    await test.step('Delete value from the "Last name" field', async () => {
      await userProfilePage.editFlyout.lastNameInput.fill('');
      await userProfilePage.editFlyout.lastNameInput.blur();
      await expect(userProfilePage.editFlyout.lastNameInput).toHaveValue('');
      await expect(userProfilePage.editFlyout.lastNameInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
      await expect(userProfilePage.editFlyout.editLastNameError).toBeVisible();
      await expect(userProfilePage.editFlyout.editLastNameError).toContainText('Required');
      await expect(userProfilePage.editFlyout.saveButton).toBeDisabled();
    });
  });

  test('[AQAPRACT-562] Edit the "Last name" with 1 character length', async ({ userProfilePage }) => {
    const updatedLastName = 'B';
    await test.step('Enter 1 character to the "Last name" field', async () => {
      await userProfilePage.editFlyout.lastNameInput.fill(updatedLastName);
      await expect(userProfilePage.editFlyout.lastNameInput).toHaveValue(updatedLastName);
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${registeredUser.firstName} ${updatedLastName}`);
    });
  });

  test('[AQAPRACT-563] Edit the "Last name" with 255 character length', async ({ userProfilePage }) => {
    const updatedLastName = 'B'.repeat(255);
    await test.step('Enter 255 characters to the "Last name" field', async () => {
      await userProfilePage.editFlyout.lastNameInput.fill(updatedLastName);
      await expect(userProfilePage.editFlyout.lastNameInput).toHaveValue(updatedLastName);
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${registeredUser.firstName} ${updatedLastName}`);
    });
  });

  test('[AQAPRACT-564] Edit the "Last name" with 256 character length', async ({ userProfilePage }) => {
    const updatedLastName = 'B'.repeat(256);
    await test.step('Enter 256 characters to the "Last name" field', async () => {
      await userProfilePage.editFlyout.lastNameInput.fill(updatedLastName);
      await expect(userProfilePage.editFlyout.lastNameInput).toHaveValue(updatedLastName);
      await expect(userProfilePage.editFlyout.saveButton).toBeEnabled();
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.editLastNameError).toBeVisible();
      await expect(userProfilePage.editFlyout.editLastNameError).toContainText("The value length shouldn't exceed 255 symbols.");
      await expect(userProfilePage.editFlyout.lastNameInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
    });
  });

  test('[AQAPRACT-565] Edit the "Last name" field with spaces', async ({ userProfilePage }) => {
    await test.step('Enter spaces to the "Last name" field', async () => {
      await userProfilePage.editFlyout.lastNameInput.fill('   ');
      await expect(userProfilePage.editFlyout.saveButton).toBeEnabled();
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.editLastNameError).toBeVisible();
      await expect(userProfilePage.editFlyout.editLastNameError).toContainText('Required');
      await expect(userProfilePage.editFlyout.lastNameInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
    });
  });

  test('[AQAPRACT-566] Edit the date with empty "Date of birth" field', async ({ userProfilePage }) => {
    await test.step('Leave the "Date of birth" field empty', async () => {
      await userProfilePage.editFlyout.dateOfBirthInput.fill('');
      await userProfilePage.editFlyout.dateOfBirthInput.blur();
      await expect(userProfilePage.editFlyout.dateOfBirthInput).toHaveValue('');
      await expect(userProfilePage.editFlyout.saveButton).toBeDisabled();
    });
  });

  test('[AQAPRACT-567] The elements on the calendar picker are available', async ({ userProfilePage }) => {
    await test.step('Open the "Date of birth" calendar', async () => {
      await userProfilePage.editFlyout.openEditDatePicker();
      await expect(userProfilePage.editFlyout.editCalendar).toBeVisible();
    });
    await test.step('Navigate through months and years', async () => {
      const startHeader = await userProfilePage.editFlyout.getEditCalendarHeaderText();
      await userProfilePage.editFlyout.navigateEditCalendarNext();
      const nextHeader = await userProfilePage.editFlyout.getEditCalendarHeaderText();
      expect(nextHeader).not.toBe(startHeader);
      await userProfilePage.editFlyout.navigateEditCalendarPrev();
    });
    await test.step('Select any available day', async () => {
      await userProfilePage.editFlyout.selectEditCalendarDay();
      await expect(userProfilePage.editFlyout.dateOfBirthInput).not.toHaveValue('');
      await expect(userProfilePage.editFlyout.editCalendar).toBeHidden();
    });
  });

  test('[AQAPRACT-568] The date is filled in manually in the "Date of birth" field', async ({ userProfilePage }) => {
    const manualDate = '15/06/1998';
    await test.step('Open the "Date of birth" field', async () => {
      await userProfilePage.editFlyout.openEditDatePicker();
      await expect(userProfilePage.editFlyout.dateOfBirthInput).toHaveAttribute('placeholder', /dd\/mm\/yyyy/i);
    });
    await test.step('Enter the "Date of birth" value manually', async () => {
      await userProfilePage.editFlyout.dateOfBirthInput.fill(manualDate);
      await userProfilePage.editFlyout.closeEditCalendar();
      await expect(userProfilePage.editFlyout.dateOfBirthInput).toHaveValue(manualDate);
    });
    await test.step('Click the "Save" button', async () => {
      await userProfilePage.editFlyout.saveButton.click();
      await expect(userProfilePage.editFlyout.title).toBeHidden();
      await expect(userProfilePage.getProfileValue('Date of birth')).toHaveText(manualDate);
    });
  });

  test('[AQAPRACT-569] Edit the date with empty "Email" field', async ({ userProfilePage }) => {
    await test.step('Delete value from the "Email" field', async () => {
      await userProfilePage.editFlyout.emailInput.fill('');
      await userProfilePage.editFlyout.emailInput.blur();
      await expect(userProfilePage.editFlyout.emailInput).toHaveValue('');
      await expect(userProfilePage.editFlyout.emailInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
      await expect(userProfilePage.editFlyout.editEmailError).toBeVisible();
      await expect(userProfilePage.editFlyout.editEmailError).toContainText('Required');
    });
  });

  test('[AQAPRACT-570] Edit with invalid email format in the "Email" field', async ({ userProfilePage }) => {
    for (const invalidEmail of InvalidEmailTestData) {
      await test.step(`Enter invalid email: ${invalidEmail}`, async () => {
        await userProfilePage.editFlyout.emailInput.fill(invalidEmail);
        await userProfilePage.editFlyout.emailInput.blur();
        await expect(userProfilePage.editFlyout.emailInput).toHaveValue(invalidEmail);
        await expect(userProfilePage.editFlyout.emailInput).toHaveCSS('border-color', ERROR_BORDER_COLOR);
        await expect(userProfilePage.editFlyout.editEmailError).toBeVisible();
        await expect(userProfilePage.editFlyout.editEmailError).toContainText('Invalid email address');
        await expect(userProfilePage.editFlyout.saveButton).toBeDisabled();
      });
    }
  });

});

