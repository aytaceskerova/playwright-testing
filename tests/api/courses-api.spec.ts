import { expect } from '@playwright/test';
import { apiTestWithAuth } from '../fixtures/apiFixtures';

apiTestWithAuth.describe('Courses API (AQAPRACT-601 to 605)', () => {
  apiTestWithAuth('601 - filter courses returns 200', async ({ courseApi }) => {
    const res = await courseApi.filterCourses({
      language: 'English',
      type: 'Programming',
    });
    expect(res.ok()).toBeTruthy();
  });

  apiTestWithAuth('602 - get courses returns 200', async ({ courseApi }) => {
    const res = await courseApi.getCourses();
    expect(res.ok()).toBeTruthy();
  });

  apiTestWithAuth('603 - get course types returns 200', async ({ courseApi }) => {
    const res = await courseApi.getCourseTypes();
    expect(res.ok()).toBeTruthy();
  });

  apiTestWithAuth('604 - get course languages returns 200', async ({ courseApi }) => {
    const res = await courseApi.getCourseLanguages();
    expect(res.ok()).toBeTruthy();
  });

  apiTestWithAuth('605 - get course countries returns 200', async ({ courseApi }) => {
    const res = await courseApi.getCourseCountries();
    expect(res.ok()).toBeTruthy();
  });
});
