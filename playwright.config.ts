import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  // UI tests now use dynamically created isolated users per test suite
  // so they can safely run in parallel.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,

  expect: {
    timeout: 10_000,
  },

  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // --- UI Tests (Chromium) ---
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: '**/ui/**/*.spec.ts',
    },

    // --- UI Tests (Firefox) ---
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      testMatch: '**/ui/**/*.spec.ts',
    },

    // --- API Tests (no browser needed) ---
    {
      name: 'api',
      use: {
        baseURL: process.env.API_BASE_URL,
      },
      testMatch: '**/api/**/*.spec.ts',
    },
  ],

  outputDir: 'test-results/',
});
