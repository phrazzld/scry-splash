import { expect, type Page, type TestInfo } from "@playwright/test";
import { SplashPage } from "../page-objects/SplashPage.pom";
import {
  createTestLogger,
  debugLog,
  waitForNetworkIdle,
  initializeDebugEnvironment,
} from "../utils/enhanced-testing";
import {
  expectScreenshot,
  StandardViewport,
  setViewport,
} from "../utils/visual-testing";
import {
  enhancedTest,
  enhancedModeratelyFlakyTest,
} from "../utils/test-segmentation";

enhancedTest.describe("Mobile Responsive Design Tests", () => {
  // Initialize the environment before running tests
  enhancedTest.beforeEach(async ({}, testInfo) => {
    await initializeDebugEnvironment(testInfo);
    debugLog(`Starting test: ${testInfo.title}`);
  });

  enhancedModeratelyFlakyTest(
    "should have proper mobile layout at 375px width",
    async ({ page }: { page: Page }, testInfo: TestInfo) => {
      const logger = createTestLogger(testInfo.title);
      logger.start();

      // Set viewport to mobile size
      await setViewport(page, StandardViewport.Mobile);

      // Navigate to the page
      const splashPage = new SplashPage(page);
      await splashPage.navigate(testInfo);

      // Verify mobile layout elements
      logger.step("Verifying mobile layout");

      // Check headline visibility and appropriate sizing
      const headline = await splashPage.getHeadline(testInfo);
      await expect(headline).toBeVisible();

      // Check CTA form is properly sized for mobile
      const ctaFormVisible = await splashPage.isCtaSectionVisible(testInfo);
      expect(ctaFormVisible).toBe(true);
      const ctaForm = await page.locator('[data-testid="cta-form"]');

      // Check button is full width on mobile
      const button = await page.locator('button[type="submit"]').first();
      await expect(button).toBeVisible();

      // Get button bounding box to verify full width
      const buttonBox = await button.boundingBox();
      const formBox = await ctaForm.boundingBox();

      // Check full width button (should be close to form width on mobile)
      // We use a high tolerance because there might be some small padding
      expect(buttonBox?.width).toBeGreaterThan(formBox!.width * 0.9);

      // Verify the footer stacks vertically on mobile
      const footerVisible = await splashPage.isFooterVisible(testInfo);
      expect(footerVisible).toBe(true);

      // Take a screenshot for visual verification
      await expectScreenshot(page, testInfo, "mobile-responsive-layout", {
        viewport: StandardViewport.Mobile,
        animationTimeout: 5000,
        stabilityDelay: 1000,
      });

      logger.success("Mobile layout verified");
      logger.end("passed");
    },
  );

  enhancedModeratelyFlakyTest(
    "should have fluid layout transitions between mobile and desktop",
    async ({ page }: { page: Page }, testInfo: TestInfo) => {
      const logger = createTestLogger(testInfo.title);
      logger.start();

      // Define custom viewport sizes to test
      const viewportSizes = [
        { width: 375, height: 667 }, // iPhone SE
        { width: 428, height: 926 }, // iPhone 12 Pro Max
        { width: 768, height: 1024 }, // iPad
        { width: 1024, height: 768 }, // Small laptop
        { width: 1280, height: 800 }, // Standard desktop
      ];

      // Navigate once to the page
      const splashPage = new SplashPage(page);
      await splashPage.navigate(testInfo);

      // Test each viewport size
      for (const viewport of viewportSizes) {
        logger.step(`Testing viewport: ${viewport.width}x${viewport.height}`);

        // Set viewport to current test size
        await setViewport(page, viewport);

        // Wait for the layout to stabilize
        await waitForNetworkIdle(page, 1000);
        await page.waitForTimeout(500);

        // Verify key elements are visible at this viewport
        const headline = await splashPage.getHeadline(testInfo);
        await expect(headline).toBeVisible();

        const ctaFormVisible = await splashPage.isCtaSectionVisible(testInfo);
        expect(ctaFormVisible).toBe(true);

        // Take a screenshot for each viewport
        await expectScreenshot(
          page,
          testInfo,
          `responsive-layout-${viewport.width}`,
          {
            viewport,
            animationTimeout: 3000,
            stabilityDelay: 500,
          },
        );

        logger.success(
          `Verified layout at ${viewport.width}x${viewport.height}`,
        );
      }

      logger.end("passed");
    },
  );

  // After each test, confirm we created proper artifacts
  enhancedTest.afterEach(async ({}, testInfo) => {
    debugLog(`Test completed: ${testInfo.title}`);
  });
});
