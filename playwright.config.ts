import { defineConfig, devices } from '@playwright/test';

// Determine if we should run all browsers or just Chromium
// Use RUN_ALL_BROWSERS=1 env variable to run all browsers
const runAllBrowsers = process.env.RUN_ALL_BROWSERS === '1';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Reduce retry attempts from 2 to 1 in CI to speed up test execution
  retries: process.env.CI ? 1 : 0,
  // Increase worker count to 2 in CI to enable parallel test execution
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html']],
  // Reduce test timeout from 60s to 30s
  timeout: 30000, // 30 seconds per test timeout
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: process.env.CI ? 'on' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'on' : 'off',
    // Reduce action timeout from 30s to 15s
    actionTimeout: 15000, // 15 seconds timeout for actions
    // Reduce navigation timeout from 60s to 30s
    navigationTimeout: 30000, // 30 seconds timeout for navigation
  },

  // Configure screenshot comparison to use existing file format
  expect: {
    toHaveScreenshot: {
      // Using default snapshot format - Playwright will handle platform/browser differences
      threshold: 0.2, // Allow slight differences due to rendering
      maxDiffPixelRatio: 0.01, // Allow for minor differences
    },
  },

  // Define projects based on runAllBrowsers flag
  // In CI, we only run Chromium by default, but can run all browsers if specified
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox and WebKit tests only run when explicitly requested
    ...(runAllBrowsers ? [
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      }
    ] : []),
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});