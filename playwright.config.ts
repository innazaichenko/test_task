import { defineConfig, devices } from '@playwright/test';
import { guestStorageState } from './support/storageState';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    baseURL: 'https://makeup.com.ua/',
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
      use: { ...devices['Desktop Chrome'], browserName: 'chromium', channel: 'chrome' },
    },


    {
      name: 'Mobile Chrome',
      dependencies: ['setup'],
      grep: /@mobile/,
      use: { ...devices['Pixel 7'], browserName: 'chromium', channel: 'chrome', storageState: guestStorageState },
    },



    {
      name: 'Google Chrome',
      dependencies: ['setup'],
      grep: /@desktop/,
      use: { ...devices['Desktop Chrome'], browserName: 'chromium', channel: 'chrome', storageState: guestStorageState },
    },
  ],

});
