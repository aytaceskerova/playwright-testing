import { test as base } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { CourseApi } from '../../api/CourseApi';
import { API_CONFIG, API_ENDPOINTS } from '../../data/constants/apiConfig';

export type ApiWithAuthFixtures = {
  apiRequest: APIRequestContext;
  courseApi: CourseApi;
};

export const apiTestWithAuth = base.extend<ApiWithAuthFixtures>({
  apiRequest: async ({ playwright }, use) => {
    let token: string | null = process.env.AUTH_TOKEN ?? null;

    if (!token) {
      const loginContext = await playwright.request.newContext({
        baseURL: API_CONFIG.BaseUrl,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const loginRes = await loginContext.post(API_ENDPOINTS.PublicLogin, {
        data: {
          email: API_CONFIG.Login.Email,
          password: API_CONFIG.Login.Password,
        },
      });

      if (!loginRes.ok()) {
        const errorText = loginRes ? await loginRes.text() : 'No response';
        await loginContext.dispose();
        throw new Error(
          `Login API failed. Set AUTH_TOKEN env or fix endpoint. ${loginRes?.status() ?? 'N/A'} ${errorText}`,
        );
      }

      const body = await loginRes.json();
      await loginContext.dispose();
      token =
        body.token ??
        body['jwt-token'] ??
        body.accessToken ??
        body.access_token ??
        body.jwt ??
        null;

      if (!token || typeof token !== 'string') {
        throw new Error('Token not found in login response');
      }
    }

    const context = await playwright.request.newContext({
      baseURL: API_CONFIG.BaseUrl,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    await use(context);
    await context.dispose();
  },
  courseApi: async ({ apiRequest }, use) => {
    await use(new CourseApi(apiRequest));
  },
});
