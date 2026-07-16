import { defineConfig, devices } from '@playwright/test';
import env from './env/env';

export default defineConfig({
  
  globalSetup: './env/global-setup.ts',
  testDir: './tests',
  fullyParallel: true,
  timeout: 20_000,             //timeout for each test. default is 30 secs
  expect: {timeout: 3_000},  //expect timeout for each assertion. default is 5 secs
  globalTimeout: 3_600_000,    //timeout for the whole test run. no default values here.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 2,      //retries failed test x times. currently  CI = 3 and non-CI = 2
  workers: process.env.CI ? 2 : 2,
  reporter: [
    ['line'], // Terminal progress logger
    ['monocart-reporter', { name: 'Playwright Test Report', outputFile: 'monocart-report/index.html'}],   //Monocart report
    ['html', { outputFolder: 'playwright-report', open: 'never' }]    // Playwright's built-in HTML report
  ],
  
  use: {
    baseURL: env.BASE_URL || 'https://spanish-cards.netlify.appsssfasdasddfasfd',           //sets the base URL for all tests.
    headless: process.env.CI ? true : process.env.HEADLESS !== 'false',             //by default, Playwright runs tests in headless mode even when this is not explicitly set.
    launchOptions: {
      args: ['--start-maximized', '--disable-gpu', '--window-size=1920,1080']
    },
    actionTimeout: 2_000,       //timeout for each action(click, etc), 0 by default

    //for reporting purposes
    screenshot: 'on',
    video: 'retain-on-first-failure',
    trace: 'retain-on-first-failure'
    
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
