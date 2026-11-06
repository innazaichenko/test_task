import { defineConfig, devices } from '@playwright/test';
import { guestStorageState } from './support/storageState';

const desktopViewport = { width: 1920, height: 1080 };

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report/desktop', open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    baseURL: 'https://makeup.com.ua/',
    headless: true,
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.spec.ts',
      use: { ...devices['Desktop Chrome'], browserName: 'chromium', channel: 'chrome', viewport: desktopViewport },
    },


    {
      name: 'filtering',
      testMatch: '**/filtering/**/*.spec.ts',
      dependencies: ['setup'],
      grep: /@desktop/,
      use: { ...devices['Desktop Chrome'], browserName: 'chromium', channel: 'chrome', viewport: desktopViewport, storageState: guestStorageState },
    },
  ],

});
