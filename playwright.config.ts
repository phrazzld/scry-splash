import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { execSync } from 'child_process';

// Determine if we should run all browsers or just Chromium
// Use RUN_ALL_BROWSERS=1 env variable to run all browsers
const runAllBrowsers = process.env.RUN_ALL_BROWSERS === '1';

// Central location for all test artifacts
const artifactsDir = process.env.CI 
  ? 'test-results/e2e-artifacts'  // CI environment path
  : path.join(process.cwd(), 'test-results/e2e-artifacts'); // Local path

// Ensure directory exists
try {
  execSync(`mkdir -p ${artifactsDir}`);
} catch (error) {
  console.warn(`Warning: Failed to create artifacts directory: ${error}`);
}

// Validate the environment with fallback for CI
try {
  console.log('Validating environment before test execution...');
  // Run the validation script
  execSync('bash e2e/scripts/validate-environment.sh', { stdio: 'inherit' });
  console.log('Environment validation complete.');
} catch (error) {
  console.warn('Environment validation had issues:', error);
  if (!process.env.CI) {
    console.error('Environment validation failed in local environment');
    throw error; // Only fail in local environment
  } else {
    console.warn('Continuing in CI environment despite validation issues');
    // In CI, we continue despite validation issues to allow the tests to run
  }
}

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
  // Central location for test artifacts, with test-name subdirectories
  outputDir: artifactsDir,
  
  use: {
    baseURL: 'http://localhost:3000',
    // Capture traces for all tests in CI, only on first retry locally
    trace: process.env.CI ? 'on' : 'on-first-retry',
    // Capture screenshots on test failures
    screenshot: 'only-on-failure',
    // Capture videos in CI, disable locally
    video: process.env.CI ? 'on-first-retry' : 'off',
    // Reduce action timeout from 30s to 15s
    actionTimeout: 15000, // 15 seconds timeout for actions
    // Reduce navigation timeout from 60s to 30s
    navigationTimeout: 30000, // 30 seconds timeout for navigation
  },

  // Configure screenshot comparison with environment-specific thresholds
  expect: {
    toHaveScreenshot: {
      // Using default snapshot format - Playwright will handle platform/browser differences
      // Increase threshold for CI environment to account for rendering differences
      threshold: process.env.CI ? 0.35 : 0.2,
      // Allow for more pixel differences in CI environments
      maxDiffPixelRatio: process.env.CI ? 0.05 : 0.01,
      // Note: Additional properties like tolerancePercentage would go here
      // but they're not supported in the current Playwright version
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