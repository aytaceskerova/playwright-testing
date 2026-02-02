import { test, expect } from './fixtures/base';
import { RegistrationData } from '../types/registration';
import { RegistrationTestData } from '../data/registrationData';
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
      await expect(userProfilePage.editFlyoutTitle).toBeVisible();
      await expect(userProfilePage.editFlyoutSubtitle).toBeVisible();
      await expect(userProfilePage.editFlyoutCloseButton).toBeVisible();
      await expect(userProfilePage.editFirstNameInput).toBeVisible();
      await expect(userProfilePage.editLastNameInput).toBeVisible();
      await expect(userProfilePage.editEmailInput).toBeVisible();
      await expect(userProfilePage.editDateOfBirthInput).toBeVisible();
      await expect(userProfilePage.editCancelButton).toBeVisible();
      await expect(userProfilePage.editSaveButton).toBeVisible();
    });
    await test.step('Verify pre-filled values', async () => {
      const [year, month, day] = registeredUser.dateOfBirth.split('-');
      await expect(userProfilePage.editFirstNameInput).toHaveValue(registeredUser.firstName);
      await expect(userProfilePage.editLastNameInput).toHaveValue(registeredUser.lastName);
      await expect(userProfilePage.editEmailInput).toHaveValue(registeredUser.email);
      await expect(userProfilePage.editDateOfBirthInput).toHaveValue(`${day}/${month}/${year}`);
    });
  });
  test('[AQAPRACT-549] Edit "First name" on User profile flyout', async ({ userProfilePage }) => {
    const updatedFirstName = 'Aida';
    await test.step('Update the First name', async () => {
      await userProfilePage.editFirstNameInput.fill(updatedFirstName);
      await expect(userProfilePage.editFirstNameInput).toHaveValue(updatedFirstName);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.editSaveButton.click();
      await expect(userProfilePage.editFlyoutTitle).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${updatedFirstName} ${registeredUser.lastName}`);
    });
  });
  test('[AQAPRACT-550] Edit "Last name" on User profile flyout', async ({ userProfilePage }) => {
    const updatedLastName = 'Stone';
    await test.step('Update the Last name', async () => {
      await userProfilePage.editLastNameInput.fill(updatedLastName);
      await expect(userProfilePage.editLastNameInput).toHaveValue(updatedLastName);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.editSaveButton.click();
      await expect(userProfilePage.editFlyoutTitle).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${registeredUser.firstName} ${updatedLastName}`);
    });
  });
  test('[AQAPRACT-551] Edit "Email" on User profile flyout', async ({ page, userProfilePage, signInPage }) => {
    const updatedEmail = `updated-${Date.now()}@example.com`;
    await test.step('Update the email address', async () => {
      await userProfilePage.editEmailInput.fill(updatedEmail);
      await expect(userProfilePage.editEmailInput).toHaveValue(updatedEmail);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.editSaveButton.click();
      await expect(userProfilePage.editFlyoutTitle).toBeHidden();
      await page.reload();
      await userProfilePage.waitForPageLoad();
      await expect(userProfilePage.getProfileValue('E-mail')).toHaveText(updatedEmail);
    });
  });

  test('[AQAPRACT-552] Edit "Date of Birth" on User profile flyout', async ({ userProfilePage }) => {
    const updatedDate = '30/12/1999';
    await test.step('Update the Date of birth', async () => {
      await userProfilePage.editDateOfBirthInput.fill(updatedDate);
      await expect(userProfilePage.editDateOfBirthInput).toHaveValue(updatedDate);
    });
    await test.step('Save changes', async () => {
      await userProfilePage.editSaveButton.click();
      await expect(userProfilePage.editFlyoutTitle).toBeHidden();
      await expect(userProfilePage.getProfileValue('Date of birth')).toHaveText(updatedDate);
    });
  });
  test('[AQAPRACT-553] Cancel editing the data on the flyout (after the data is edited)', async ({ userProfilePage }) => {
    await test.step('Update any field', async () => {
      await userProfilePage.editFirstNameInput.fill('Temp');
      await expect(userProfilePage.editFirstNameInput).toHaveValue('Temp');
    });
    await test.step('Click the "Cancel" button', async () => {
      await userProfilePage.editCancelButton.click();
      await expect(userProfilePage.editFlyoutTitle).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${registeredUser.firstName} ${registeredUser.lastName}`);
    });
  });
  test('[AQAPRACT-554] Cancel editing the data on the flyout (without editing)', async ({ userProfilePage }) => {
    await userProfilePage.editCancelButton.click();
    await expect(userProfilePage.editFlyoutTitle).toBeHidden();
    await expect(userProfilePage.userName).toHaveText(`${registeredUser.firstName} ${registeredUser.lastName}`);
  });
  test('[AQAPRACT-555] Close "Edit personal information" flyout by "X" button', async ({ userProfilePage }) => {
    await test.step('Change any field', async () => {
      await userProfilePage.editLastNameInput.fill('Temp');
      await expect(userProfilePage.editLastNameInput).toHaveValue('Temp');
    });
    await test.step('Click the "X" button', async () => {
      await userProfilePage.editFlyoutCloseButton.click();
      await expect(userProfilePage.editFlyoutTitle).toBeHidden();
      await expect(userProfilePage.userName).toHaveText(`${registeredUser.firstName} ${registeredUser.lastName}`);
    });
  });
});
