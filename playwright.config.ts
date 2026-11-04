import { defineConfig, devices } from '@playwright/test';

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
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'], browserName: 'chromium', channel: 'chrome' },
    },



    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], browserName: 'chromium', channel: 'chrome' },
    },
  ],

});
