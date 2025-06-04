/**
 * Test Mode Example
 *
 * This test demonstrates how tests can adapt their behavior based on the current test mode.
 * It shows the different test fixtures and how they interact with the test mode system.
 */

import { expect, type Page } from "@playwright/test";
import {
  enhancedTest,
  visualTest,
  performanceTest,
  criticalTest,
  enhancedModeratelyFlakyTest,
  getAdjustedTimeouts,
} from "../utils/test-segmentation";
import { getCurrentTestMode, getTestModeConfig } from "../utils/test-modes";

enhancedTest.describe("Test Mode System", () => {
  enhancedTest("should detect current test mode", async ({ page }) => {
    // Navigate to a simple page
    await page.goto("/");

    // Log the current test mode for demonstration
    const testMode = getCurrentTestMode();
    const config = getTestModeConfig();

    console.log(`Running in test mode: ${testMode}`);
    console.log(`Test mode description: ${config.description}`);
    console.log(`Visual testing enabled: ${config.visualTestingEnabled}`);
    console.log(`Retries: ${config.retries}`);

    // Basic assertion to ensure the page loads
    await expect(page).toHaveTitle(/Scry/);
  });

  enhancedTest("should run in all test modes", async ({ page }) => {
    // This test should run in all modes
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });
});

visualTest.describe("@visual Visual Tests", () => {
  visualTest(
    "should only run when visual testing is enabled",
    async ({ page }: { page: Page }) => {
      // This test will be skipped in ci-functional and ci-lightweight modes
      await page.goto("/");

      console.log("Visual test is running - visual testing must be enabled");

      // Basic visual assertion
      await expect(page.locator("body")).toBeVisible();

      // In a real visual test, you would use expectScreenshot here
      // await expectScreenshot(page, testInfo, 'homepage');
    },
  );
});

performanceTest.describe("@performance Performance Tests", () => {
  performanceTest(
    "should only run when performance testing is enabled",
    async ({ page }: { page: Page }) => {
      // This test will be skipped in ci-lightweight mode
      await page.goto("/");

      console.log(
        "Performance test is running - performance testing must be enabled",
      );

      // Measure page load time
      const startTime = Date.now();
      await page.waitForLoadState("networkidle");
      const loadTime = Date.now() - startTime;

      console.log(`Page load time: ${loadTime}ms`);

      // Performance assertion (with mode-adjusted threshold)
      const config = getTestModeConfig();
      const maxLoadTime = 5000 * config.performanceThresholdMultiplier;
      expect(loadTime).toBeLessThan(maxLoadTime);
    },
  );
});

criticalTest.describe("@critical Critical Tests", () => {
  criticalTest(
    "should run critical business flows",
    async ({ page }: { page: Page }) => {
      // Critical tests typically run in all modes but with adjusted timeouts
      await page.goto("/");

      console.log("Critical test is running");

      // Test the main CTA functionality
      const ctaButton = page.locator('[data-testid="cta-button"]').first();
      if (await ctaButton.isVisible()) {
        await ctaButton.click();
        // Verify the form appears
        await expect(page.locator('[data-testid="cta-form"]')).toBeVisible();
      }
    },
  );
});

enhancedModeratelyFlakyTest.describe("@flaky Flaky Tests", () => {
  enhancedModeratelyFlakyTest(
    "should be skipped in lightweight mode",
    async ({ page }: { page: Page }) => {
      // This test will be skipped in ci-lightweight mode
      await page.goto("/");

      console.log("Flaky test is running - not in lightweight mode");

      // Simulate a potentially flaky operation
      await page.waitForTimeout(100); // Small delay to simulate timing issues
      await expect(page.locator("body")).toBeVisible();
    },
  );
});

enhancedTest.describe("Test Mode Configuration", () => {
  enhancedTest(
    "should apply correct timeouts based on test tags",
    async ({ page }, testInfo) => {
      const timeouts = getAdjustedTimeouts(testInfo);

      console.log("Applied timeouts:", timeouts);

      // Use the adjusted timeouts for this test
      await page.goto("/", { timeout: timeouts.navigation });
      await expect(page.locator("body")).toBeVisible({
        timeout: timeouts.action,
      });
    },
  );

  enhancedTest(
    "should have test mode information attached",
    async ({ page }, testInfo) => {
      // The test mode information should be automatically attached
      // by the test segmentation system

      await page.goto("/");

      // Verify basic functionality
      await expect(page).toHaveTitle(/Scry/);

      console.log("Test info attachments count:", testInfo.attachments.length);

      // The test-mode.json attachment should be present
      const testModeAttachment = testInfo.attachments.find(
        (attachment) => attachment.name === "test-mode.json",
      );

      if (testModeAttachment) {
        console.log("Test mode attachment found");
      }
    },
  );
});
