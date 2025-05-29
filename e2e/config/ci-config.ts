/**
 * CI Configuration
 * 
 * Centralized configuration for CI environments. This module exports configuration
 * settings and utilities specifically for CI testing scenarios.
 * 
 * This file serves as the single source of truth for CI-specific settings that
 * need to be consistent across the testing infrastructure.
 */

import { BrowserType } from '../utils/environment-detector';
import { TestMode, getCurrentTestMode, isInCIMode } from '../utils/test-modes';

/**
 * CI-specific constants
 */
export const CI_CONSTANTS = {
  // Artifact paths
  ARTIFACTS_DIR: 'test-results/e2e-artifacts',
  SCREENSHOTS_DIR: 'test-results/e2e-artifacts/screenshots',
  VIDEOS_DIR: 'test-results/e2e-artifacts/videos',
  TRACES_DIR: 'test-results/e2e-artifacts/traces',
  LOGS_DIR: 'test-results/e2e-artifacts/logs',
  
  // Timeouts (ms)
  DEFAULT_TEST_TIMEOUT: 60000,
  DEFAULT_ACTION_TIMEOUT: 30000,
  DEFAULT_NAVIGATION_TIMEOUT: 60000,
  BROWSER_LAUNCH_TIMEOUT: 90000,
  
  // Retry configuration
  DEFAULT_RETRIES: 1,
  MAX_RETRIES: 3,
  
  // Resource configuration
  DEFAULT_WORKERS: 2,
  MAX_WORKERS: 4,
  
  // Browser configuration
  DEFAULT_BROWSER: BrowserType.Chromium
};

/**
 * Default testing browsers based on current mode
 */
export function getDefaultBrowsers(): BrowserType[] {
  const mode = getCurrentTestMode();
  
  switch (mode) {
    case TestMode.CIFull:
      return [BrowserType.Chromium, BrowserType.Firefox, BrowserType.WebKit];
    
    case TestMode.CILightweight:
    case TestMode.CIFunctional:
    case TestMode.CIVisual:
      return [BrowserType.Chromium];
    
    case TestMode.LocalDevelopment:
    default:
      return [BrowserType.Chromium];
  }
}

/**
 * Get resource allocation based on the current mode
 */
export function getResourceAllocation() {
  const mode = getCurrentTestMode();
  
  switch (mode) {
    case TestMode.CIFull:
      return {
        workers: CI_CONSTANTS.DEFAULT_WORKERS,
        retries: 2
      };
    
    case TestMode.CILightweight:
      return {
        workers: CI_CONSTANTS.MAX_WORKERS, // Use more workers for faster execution
        retries: 1
      };
    
    case TestMode.CIFunctional:
    case TestMode.CIVisual:
      return {
        workers: CI_CONSTANTS.DEFAULT_WORKERS,
        retries: CI_CONSTANTS.DEFAULT_RETRIES
      };
    
    case TestMode.LocalDevelopment:
    default:
      return {
        workers: undefined, // Let Playwright determine based on machine
        retries: 0
      };
  }
}

/**
 * Determine whether to skip certain test categories based on mode
 */
export function shouldSkipTestCategory(category: 'visual' | 'performance' | 'flaky'): boolean {
  const mode = getCurrentTestMode();
  
  switch (category) {
    case 'visual':
      return mode === TestMode.CIFunctional || mode === TestMode.CILightweight;
    
    case 'performance':
      return mode === TestMode.CILightweight;
    
    case 'flaky':
      return mode === TestMode.CILightweight;
    
    default:
      return false;
  }
}

/**
 * Get appropriate timeouts based on the current mode
 * Now integrates with the timeout-config module for consistency
 */
export function getTimeouts() {
  // Import here to avoid circular dependencies
  const { getEnvironmentTimeouts } = require('./timeout-config');
  const environmentTimeouts = getEnvironmentTimeouts();
  
  const mode = getCurrentTestMode();
  
  switch (mode) {
    case TestMode.CIFull:
      return {
        testTimeout: environmentTimeouts.navigation * 2, // Extra long for full suite
        actionTimeout: environmentTimeouts.elementWait,
        navigationTimeout: environmentTimeouts.navigation
      };
    
    case TestMode.CILightweight:
      return {
        testTimeout: environmentTimeouts.navigation * 0.75, // Shorter for fast feedback
        actionTimeout: environmentTimeouts.elementWait * 0.75,
        navigationTimeout: environmentTimeouts.navigation * 0.75
      };
    
    case TestMode.CIFunctional:
    case TestMode.CIVisual:
      return {
        testTimeout: environmentTimeouts.navigation,
        actionTimeout: environmentTimeouts.elementWait,
        navigationTimeout: environmentTimeouts.navigation
      };
    
    case TestMode.LocalDevelopment:
    default:
      return {
        testTimeout: environmentTimeouts.navigation,
        actionTimeout: environmentTimeouts.elementWait,
        navigationTimeout: environmentTimeouts.navigation
      };
  }
}

/**
 * Determine what artifacts to capture based on current mode
 */
export function getArtifactSettings() {
  if (!isInCIMode()) {
    // Local development - minimal artifacts
    return {
      screenshot: 'only-on-failure' as const,
      video: 'off' as const,
      trace: 'on-first-retry' as const
    };
  }
  
  const mode = getCurrentTestMode();
  
  switch (mode) {
    case TestMode.CIFull:
      // Comprehensive artifact collection for full test suite
      return {
        screenshot: 'on' as const,
        video: 'on' as const,
        trace: 'on' as const
      };
    
    case TestMode.CILightweight:
      // Minimal artifacts for fast execution
      return {
        screenshot: 'only-on-failure' as const,
        video: 'on-first-retry' as const,
        trace: 'on-first-retry' as const
      };
    
    case TestMode.CIVisual:
      // Focus on image-related artifacts for visual testing
      return {
        screenshot: 'on' as const,
        video: 'on' as const,
        trace: 'on-first-retry' as const
      };
    
    case TestMode.CIFunctional:
    default:
      // Standard CI artifact collection
      return {
        screenshot: 'only-on-failure' as const,
        video: 'on-first-retry' as const,
        trace: 'on-first-retry' as const
      };
  }
}

/**
 * Gets the appropriate Playwright configuration based on the current test mode
 * This can be imported directly into playwright.config.ts
 */
export function getPlaywrightConfig() {
  const config = {
    // Testing behavior
    testDir: './e2e/tests',
    fullyParallel: true,
    forbidOnly: isInCIMode(), // Prevent only in CI
    
    // Resources
    ...getResourceAllocation(),
    
    // Reporting
    reporter: [['list', {}], ['html', {}]] as Array<[string, any]>,
    
    // Timeout
    testTimeout: getTimeouts().testTimeout,
    
    // Artifacts
    outputDir: CI_CONSTANTS.ARTIFACTS_DIR,
    
    // Test behavior
    use: {
      baseURL: 'http://localhost:3000',
      ...getArtifactSettings(),
      actionTimeout: getTimeouts().actionTimeout,
      navigationTimeout: getTimeouts().navigationTimeout
    },
    
    // Screenshot comparison
    expect: {
      toHaveScreenshot: {
        threshold: isInCIMode() ? 0.35 : 0.2,
        maxDiffPixelRatio: isInCIMode() ? 0.05 : 0.01,
      },
    },
    
    // Project configuration to be extended in playwright.config.ts
    projects: getDefaultBrowsers().map(browser => ({
      name: browser,
      use: {},
    })),
    
    // Web server configuration
    webServer: {
      command: 'pnpm dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !isInCIMode(),
      stdout: 'pipe' as const,
      stderr: 'pipe' as const,
    },
  };
  
  return config;
}