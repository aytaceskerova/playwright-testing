import { test as base } from '@playwright/test';
import { CourseApi } from '../../api/CourseApi';
import { getAuthenticatedRequest } from '../../api/authHelper';

export type ApiFixtures = {
  courseApi: CourseApi;
};

export const test = base.extend<ApiFixtures>({
  courseApi: async ({ playwright }, use) => {
    const request = await getAuthenticatedRequest(playwright);
    const courseApi = new CourseApi(request);
    await use(courseApi);
    await request.dispose();
  },
});
