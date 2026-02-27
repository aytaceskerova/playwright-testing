import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 3,
  reporter: 'html',
  use: {
    baseURL: 'https://qa-course-01.andersenlab.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: '**/api/**',
    },
    {
      name: 'chromium-headed-slow',
      use: {
        ...devices['Desktop Chrome'],
        headless: !!process.env.CI,
        launchOptions: { slowMo: 500 },
      },
      testIgnore: '**/api/**',
    },
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        baseURL: 'https://qa-course-01-api.andersenlab.com',
      },
    },
  ],
});

