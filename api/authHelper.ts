import type { APIRequestContext } from '@playwright/test';
import { API_CONFIG, API_ENDPOINTS } from '../data/constants/apiConfig';

type PlaywrightInstance = { request: { newContext: (opts: object) => Promise<APIRequestContext> } };

export async function getAuthenticatedRequest(
  playwright: PlaywrightInstance,
): Promise<APIRequestContext> {
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
      const errorText = await loginRes.text();
      await loginContext.dispose();
      throw new Error(
        `Login API failed. Set AUTH_TOKEN env or fix endpoint. ${loginRes.status()} ${errorText}`,
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

  return playwright.request.newContext({
    baseURL: API_CONFIG.BaseUrl,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}
