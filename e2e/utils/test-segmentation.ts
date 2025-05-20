/**
 * Test Segmentation Utility
 * 
 * Provides functionality to segment tests based on stability characteristics
 * and apply different retry strategies for potentially flaky tests.
 */

import { test } from '@playwright/test';
import { validateTestEnvironment } from './environment-validator';

/**
 * Configuration for different test stability segments
 */
export enum TestStability {
  // Stable tests rarely fail except for real issues
  Stable = 'stable',
  // Tests that occasionally fail due to timing or resource issues
  ModeratelyFlaky = 'moderately-flaky',
  // Tests known to be particularly flaky, especially in CI
  HighlyFlaky = 'highly-flaky',
}

// Create a wrapper for all tests that runs environment validation
const baseTest = test.extend({
  // Add custom fixture to validate environment
  page: async ({ page }, use, testInfo) => {
    try {
      // Run environment validation
      await validateTestEnvironment(testInfo);
    } catch (error) {
      console.warn('Environment validation warning:', error);
    }
    // Continue with the test
    await use(page);
  }
});

/**
 * Base enhanced test with environment validation and stable settings
 * 
 * - Local: 0 retries
 * - CI: 1 retry (configured in playwright.config.ts)
 */
export const enhancedTest = baseTest;

/**
 * Enhanced test fixture for moderately flaky tests.
 * These tests have higher retry counts set in the workflow.
 * 
 * - Local: 1 retry
 * - CI: 2 retries
 */
export const enhancedModeratelyFlakyTest = baseTest;

/**
 * Enhanced test fixture for highly flaky tests.
 * These tests have higher retry counts set in the workflow.
 * 
 * - Local: 2 retries
 * - CI: 3 retries
 */
export const enhancedHighlyFlakyTest = baseTest;