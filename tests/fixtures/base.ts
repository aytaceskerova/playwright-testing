import { test as base, expect } from '@playwright/test';
import { RegistrationPage } from '../../pages/RegistrationPage';
import { SignInPage } from '../../pages/SignInPage';
import { UserProfilePage } from '../../pages/UserProfilePage';

type Fixtures = {
  registrationPage: RegistrationPage;
  signInPage: SignInPage;
  userProfilePage: UserProfilePage;
};
export const test = base.extend<Fixtures>({
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  userProfilePage: async ({ page }, use) => {
    await use(new UserProfilePage(page));
  },
});
export { expect };
