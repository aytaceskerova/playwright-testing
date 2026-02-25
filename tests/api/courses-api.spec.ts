import { expect } from '@playwright/test';
import { test } from '../fixtures/apiFixtures';

test.describe('Courses API', () => {
  test('AQAPRACT-601: filter courses returns 200', async ({ courseApi }) => {
    const res = await courseApi.filterCourses({
      language: 'English',
      type: 'Programming',
    });
    expect(res.ok()).toBeTruthy();
  });

  test('AQAPRACT-602: get courses returns 200', async ({ courseApi }) => {
    const res = await courseApi.getCourses();
    expect(res.ok()).toBeTruthy();
  });

  test('AQAPRACT-603: get course types returns 200', async ({ courseApi }) => {
    const res = await courseApi.getCourseTypes();
    expect(res.ok()).toBeTruthy();
  });

  test('AQAPRACT-604: get course languages returns 200', async ({ courseApi }) => {
    const res = await courseApi.getCourseLanguages();
    expect(res.ok()).toBeTruthy();
  });

  test('AQAPRACT-605: get course countries returns 200', async ({ courseApi }) => {
    const res = await courseApi.getCourseCountries();
    expect(res.ok()).toBeTruthy();
  });
});
