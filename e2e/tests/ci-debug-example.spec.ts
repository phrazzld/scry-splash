/**
 * CI Debug Example Test
 *
 * This test demonstrates the enhanced CI debugging capabilities.
 * It's not meant to be run regularly as part of the test suite but serves
 * as an example of how to use the new CI debugging features.
 */

import { expect, test } from "@playwright/test";
import {
  debugLog,
  getEnvironmentInfo,
  setupPerformanceMetrics,
} from "../utils/enhanced-testing";
import { SplashPage } from "../page-objects/SplashPage.pom";

// Note: This file demonstrates how the CI debugging utilities could be used,
// but it's not integrated with the actual test fixtures due to TypeScript limitations.
// In a real implementation, these would be properly integrated and type-safe.

// Mark this with test.skip() to prevent it from running in the regular test suite
test.describe.skip("CI Debug Example", () => {
  // Set up before each test
  test.beforeEach(async ({}, testInfo) => {
    debugLog(`Setting up test: ${testInfo.title}`);

    // Print environment information
    const envInfo = getEnvironmentInfo();
    debugLog(`Running in CI: ${envInfo.isCI ? "Yes" : "No"}`);
    debugLog(`CI Provider: ${envInfo.ciProvider}`);
    debugLog(`Operating System: ${envInfo.os}`);
    debugLog(`Node Version: ${envInfo.nodeVersion}`);
  });

  // Example test that demonstrates CI debugging concepts
  test("should capture comprehensive debugging information", async ({
    page,
  }, testInfo) => {
    // Initialize page objects
    const splashPage = new SplashPage(page);

    // Example of how you would use the CI debugger
    debugLog("Starting test with comprehensive debugging");

    // Navigate to splash page
    await splashPage.navigate(testInfo);
    debugLog("Navigation complete");

    // Set up performance metrics collection
    const metricsCollector = await setupPerformanceMetrics(page, testInfo);

    // Verify main headline
    const headline = await splashPage.getHeadline(testInfo);
    await expect(headline).toBeVisible();
    await expect(headline).toContainText("Remember");
    debugLog("Headline verification complete");

    // Example of collecting performance metrics at a specific point
    const metrics = await metricsCollector.getLatestMetrics();
    debugLog(
      `Current page has ${metrics?.resourceMetrics?.resourceCount || 0} resources`,
    );

    // Verify CTA form
    const ctaVisible = await splashPage.isCtaSectionVisible(testInfo);
    expect(ctaVisible).toBe(true);
    debugLog("CTA form verification complete");

    // Log final test status
    debugLog("Test completed successfully");
  });

  // After each test, confirm proper artifact collection
  test.afterEach(async ({}, testInfo) => {
    debugLog(`Test completed: ${testInfo.title}`);
    debugLog(`Test status: ${testInfo.status}`);
  });
});
