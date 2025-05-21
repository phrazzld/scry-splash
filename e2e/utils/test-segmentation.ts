/**
 * Test Segmentation Utility
 * 
 * Provides functionality to segment tests based on:
 * 1. Stability characteristics - to apply different retry strategies for potentially flaky tests
 * 2. Test type (visual, functional) - to selectively run or skip groups of tests
 */

import { test } from '@playwright/test';
import { validateTestEnvironment } from './environment-validator';
import { debugLog } from './core';

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

/**
 * Test type tags for categorizing tests
 */
export enum TestTag {
  // Tests that perform visual regression checks
  Visual = '@visual',
  // Tests that check functional behavior (default if not tagged)
  Functional = '@functional',
  // Performance tests that measure loading times, etc.
  Performance = '@performance',
  // Accessibility tests
  Accessibility = '@a11y',
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
 * Adds test tags to a test or test group for categorization
 * 
 * @param testFunction The test function to tag
 * @param tags Array of tags to apply to the test
 * @returns Tagged test function with extend method
 */
export function tagTest(testFunction: any, tags: TestTag[]) {
  const wrappedTest = (title: string, testFn: any, ...rest: any[]) => {
    // Create a string of tags to prepend to the test title
    const tagString = tags.join(' ');
    const taggedTitle = `${tagString} ${title}`;
    
    debugLog(`Creating tagged test: ${taggedTitle}`, 'debug');
    
    // Call the original test function with the tagged title
    return testFunction(taggedTitle, testFn, ...rest);
  };
  
  // Copy over all properties from the original test function
  Object.assign(wrappedTest, testFunction);
  
  // Add describe/it functions that add tags
  if (testFunction.describe) {
    wrappedTest.describe = (title: string, suiteFn: () => void) => {
      const tagString = tags.join(' ');
      const taggedTitle = `${tagString} ${title}`;
      return testFunction.describe(taggedTitle, suiteFn);
    };
  }
  
  // Add extend method to allow composition with other test fixtures
  wrappedTest.extend = function(fixture: any) {
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
export const enhancedModeratelyFlakyTest = baseTest;

/**
 * Enhanced test fixture for highly flaky tests.
 * These tests have higher retry counts set in the workflow.
 * 
 * - Local: 2 retries
 * - CI: 3 retries
 */
export const enhancedHighlyFlakyTest = baseTest;

/**
 * Enhanced test fixture specifically for visual tests.
 * These tests will be tagged with @visual so they can be easily
 * filtered, run, or skipped as a group.
 */
export const visualTest = tagTest(baseTest, [TestTag.Visual]);

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