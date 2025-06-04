/**
 * Test Segmentation Utility
 *
 * Provides functionality to segment tests based on:
 * 1. Stability characteristics - to apply different retry strategies for potentially flaky tests
 * 2. Test type (visual, functional) - to selectively run or skip groups of tests
 * 3. Test mode - adjusts test behavior based on the current test mode
 */

import { test, TestInfo } from "@playwright/test";
import { validateTestEnvironment } from "./environment-validator";
import { debugLog } from "./core";
import { getCurrentTestMode, getTestModeConfig } from "./test-modes";
import { shouldSkipTestCategory } from "../config/ci-config";

/**
 * Configuration for different test stability segments
 */
export enum TestStability {
  // Stable tests rarely fail except for real issues
  Stable = "stable",
  // Tests that occasionally fail due to timing or resource issues
  ModeratelyFlaky = "moderately-flaky",
  // Tests known to be particularly flaky, especially in CI
  HighlyFlaky = "highly-flaky",
}

/**
 * Test type tags for categorizing tests
 */
export enum TestTag {
  // Tests that perform visual regression checks
  Visual = "@visual",
  // Tests that check functional behavior (default if not tagged)
  Functional = "@functional",
  // Performance tests that measure loading times, etc.
  Performance = "@performance",
  // Accessibility tests
  Accessibility = "@a11y",
  // Tests that might be flaky in CI environments
  Flaky = "@flaky",
  // Tests that are particularly slow
  Slow = "@slow",
  // Tests for critical business flows
  Critical = "@critical",
}

// Create a wrapper for all tests that runs environment validation
const baseTest = test.extend({
  // Add custom fixture to validate environment
  page: async ({ page }, use, testInfo) => {
    try {
      // Run environment validation
      await validateTestEnvironment(testInfo);

      // Apply test mode-specific setup
      await applyTestModeSetup(page, testInfo);
    } catch (error) {
      console.warn("Environment validation warning:", error);
    }
    // Continue with the test
    await use(page);
  },
});

/**
 * Apply test mode-specific setup to a test
 * This function is called before each test to apply any mode-specific configuration
 */
async function applyTestModeSetup(_page: any, testInfo: TestInfo) {
  const testMode = getCurrentTestMode();
  const config = getTestModeConfig();

  // Attach test mode info to the test for reporting
  await testInfo.attach("test-mode.json", {
    body: JSON.stringify({
      mode: testMode,
      description: config.description,
      browsers: config.browsers,
      visualTestingEnabled: config.visualTestingEnabled,
    }),
    contentType: "application/json",
  });

  // Log test mode info - useful for debugging
  debugLog(`Running test "${testInfo.title}" in ${testMode} mode`, "info");

  // Check if test should be skipped based on current mode and test tags
  if (shouldSkipTest(testInfo)) {
    debugLog(`Skipping test "${testInfo.title}" in ${testMode} mode`, "info");
    test.skip();
  }
}

/**
 * Determine if a test should be skipped based on the current test mode and test tags
 */
function shouldSkipTest(testInfo: TestInfo): boolean {
  // Check for explicit includes/excludes based on test mode
  const config = getTestModeConfig();

  // Check for visual tests
  if (hasTestTag(testInfo, TestTag.Visual)) {
    if (!config.visualTestingEnabled || shouldSkipTestCategory("visual")) {
      return true;
    }
  }

  // Check for performance tests
  if (
    hasTestTag(testInfo, TestTag.Performance) &&
    shouldSkipTestCategory("performance")
  ) {
    return true;
  }

  // Check for flaky tests
  if (hasTestTag(testInfo, TestTag.Flaky) && shouldSkipTestCategory("flaky")) {
    return true;
  }

  // Check for explicit include tags (if specified)
  if (config.includeTags.length > 0) {
    const hasIncludeTag = config.includeTags.some((tag) =>
      hasTestTag(testInfo, tag),
    );
    if (!hasIncludeTag) {
      return true;
    }
  }

  // Check for explicit exclude tags
  if (config.excludeTags.some((tag) => hasTestTag(testInfo, tag))) {
    return true;
  }

  return false;
}

/**
 * Adds test tags to a test or test group for categorization
 *
 * @param testFunction The test function to tag
 * @param tags Array of tags to apply to the test
 * @returns Tagged test function with extend method
 */
export function tagTest(testFunction: any, tags: TestTag[]) {
  const wrappedTest = (title: string, testFn: any, ...rest: any[]) => {
    // Create a string of tags to prepend to the test title
    const tagString = tags.join(" ");
    const taggedTitle = `${tagString} ${title}`;

    debugLog(`Creating tagged test: ${taggedTitle}`, "debug");

    // Call the original test function with the tagged title
    return testFunction(taggedTitle, testFn, ...rest);
  };

  // Copy over all properties from the original test function
  Object.assign(wrappedTest, testFunction);

  // Add describe/it functions that add tags
  if (testFunction.describe) {
    wrappedTest.describe = (title: string, suiteFn: () => void) => {
      const tagString = tags.join(" ");
      const taggedTitle = `${tagString} ${title}`;
      return testFunction.describe(taggedTitle, suiteFn);
    };
  }

  // Add extend method to allow composition with other test fixtures
  wrappedTest.extend = function (fixture: any) {
    // Create a new wrapped test that combines both fixtures
    return tagTest(fixture, tags);
  };

  return wrappedTest;
}

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
export const enhancedModeratelyFlakyTest = tagTest(baseTest, [TestTag.Flaky]);

/**
 * Enhanced test fixture specifically for visual tests.
 * These tests will be tagged with @visual so they can be easily
 * filtered, run, or skipped as a group.
 */
export const visualTest = tagTest(baseTest, [TestTag.Visual]);

/**
 * Enhanced test fixture for performance tests
 */
export const performanceTest = tagTest(baseTest, [TestTag.Performance]);

/**
 * Enhanced test fixture for critical business flow tests
 */
export const criticalTest = tagTest(baseTest, [TestTag.Critical]);

/**
 * Helper function to check if a test has a specific tag
 *
 * @param testInfo Playwright TestInfo object
 * @param tag Tag to check for
 * @returns Boolean indicating if the test has the specified tag
 */
export function hasTestTag(testInfo: { title: string }, tag: TestTag): boolean {
  return testInfo.title.includes(tag);
}

/**
 * Helper function to check if a test is a visual test
 *
 * @param testInfo Playwright TestInfo object
 * @returns Boolean indicating if the test is a visual test
 */
export function isVisualTest(testInfo: { title: string }): boolean {
  return hasTestTag(testInfo, TestTag.Visual);
}

/**
 * Helper function to check if a test should use adjusted timeouts
 * based on the current test mode
 *
 * @param testInfo Playwright TestInfo object
 * @returns Object with adjusted timeouts
 */
export function getAdjustedTimeouts(testInfo: TestInfo) {
  const config = getTestModeConfig();
  const timeouts = {
    test: config.testTimeout,
    action: config.actionTimeout,
    navigation: config.navigationTimeout,
  };

  // Adjust timeouts for slow tests
  if (hasTestTag(testInfo, TestTag.Slow)) {
    return {
      test: timeouts.test * 1.5,
      action: timeouts.action * 1.5,
      navigation: timeouts.navigation * 1.5,
    };
  }

  // Adjust timeouts for critical tests (give them a bit more time)
  if (hasTestTag(testInfo, TestTag.Critical)) {
    return {
      test: timeouts.test * 1.2,
      action: timeouts.action * 1.2,
      navigation: timeouts.navigation * 1.2,
    };
  }

  return timeouts;
}

/**
 * Helper function to check if the current test mode skips
 * a particular test category
 *
 * @param testInfo Playwright TestInfo object
 * @param category Test category to check
 * @returns Boolean indicating if the test category should be skipped
 */
export function shouldSkipCategory(
  _testInfo: TestInfo,
  category: "visual" | "performance" | "flaky",
): boolean {
  return shouldSkipTestCategory(category);
}
