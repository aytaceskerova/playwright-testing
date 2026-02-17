import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SelectPage extends BasePage {
  readonly backToProfileLink: Locator = this.page
    .locator('[data-ol="BackToProfile"]')
    .or(this.page.getByRole('link', { name: /back to profile/i }));
  readonly chooseYourCourseTitle: Locator = this.page.getByRole('heading', { name: 'Choose your course' });
  readonly defineStudyPreferencesSection: Locator = this.page.getByRole('heading', {
    name: 'Define your study preferences',
  });
  readonly selectCountryField: Locator = this.page
    .locator('[data-ol="SelectCountry"]')
    .or(this.page.getByRole('combobox', { name: 'Select country' }));
  readonly selectLanguageField: Locator = this.page
    .locator('[data-ol="SelectLanguage"]')
    .or(this.page.getByRole('combobox', { name: 'Select language' }));
  readonly selectTypeField: Locator = this.page
    .locator('[data-ol="SelectType"]')
    .or(this.page.getByRole('combobox', { name: 'Select type' }));
  readonly dateFromField: Locator = this.page
    .locator('[data-calendar="1"]')
    .or(this.page.locator('[data-ol="StartDate"]'))
    .or(this.page.getByRole('textbox', { name: 'Start date' }))
    .or(this.page.getByLabel('Start date'));
  readonly dateToField: Locator = this.page
    .locator('[data-calendar="2"]')
    .or(this.page.locator('[data-ol="EndDate"]'))
    .or(this.page.getByRole('textbox', { name: 'End date' }))
    .or(this.page.getByLabel('End date'));
  readonly selectCoursesSection: Locator = this.page.getByRole('heading', { name: 'Select courses' });
  readonly searchButton: Locator = this.page
    .locator('[data-ol="Search"]')
    .or(this.page.getByRole('button', { name: /search/i }));
  readonly noCoursesMessage: Locator = this.page.getByText(
    'Unfortunately, we did not find any courses matching your chosen criteria.',
  );
  readonly coursesListbox: Locator = this.page.getByRole('listbox');
  readonly coursesList: Locator = this.page.getByRole('listbox').getByRole('option');

  async waitForSelectPageReady(): Promise<void> {
    await this.waiters.waitForPageReady('networkidle');
    await this.assertions.verifyElementToBeVisible(this.chooseYourCourseTitle);
  }

  async selectDropdownOption(dropdown: Locator, optionText: string): Promise<void> {
    await this.actions.selectOption(dropdown, { label: optionText });
  }

  getDropdownOption(optionText: string): Locator {
    return this.page.getByRole('option', { name: optionText });
  }
}
