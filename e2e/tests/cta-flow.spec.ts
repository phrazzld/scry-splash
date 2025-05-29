import { expect } from "@playwright/test";
import { SplashPage } from "../page-objects/SplashPage.pom";
import { CtaForm } from "../page-objects/CtaForm.pom";
import { 
  withErrorReporting, 
  createTestLogger, 
  addTestAttachments,
  waitForNetworkIdle,
  debugLog,
  initializeDebugEnvironment,
  setupNetworkLogging,
  waitForAnimationsComplete
} from "../utils/enhanced-testing";
import {
  expectScreenshot,
  StandardViewport
} from "../utils/visual-testing";
import {
  mockFormSparkAPI,
  createMockVerificationReport,
  getFormSparkSubmitURL
} from "../utils/api-mocking";

// Use the enhanced test fixture for better error reporting
const enhancedTest = withErrorReporting;

enhancedTest.describe("CTA Flow @stable", () => {
  // Initialize the environment before running tests
  enhancedTest.beforeEach(async ({}, testInfo) => {
    await initializeDebugEnvironment(testInfo);
    debugLog(`Starting test: ${testInfo.title}`);
  });

  enhancedTest("happy path - successful email submission", async ({ page }, testInfo) => {
    const logger = createTestLogger("CTA Flow - Happy Path");
    logger.start();
    
    // Set up detailed network logging for better diagnostics
    const networkLogger = setupNetworkLogging(page, testInfo);
    
    // Mock the Formspark API to return a successful response
    logger.step("Setting up API mock");
    logger.info(`FormSpark URL: ${getFormSparkSubmitURL()}`);
    await mockFormSparkAPI(page, { 
      success: true,
      enableLogging: true 
    });
    logger.success("FormSpark API mock configured for success");

    // Initialize page objects
    const splashPage = new SplashPage(page);
    const ctaForm = new CtaForm(page);

    // Navigate to the splash page with improved reliability
    logger.step("Navigating to splash page");
    await splashPage.navigate(testInfo);
    logger.success("Navigation completed");

    // Fill in a valid email with retry logic
    logger.step("Filling email field");
    await ctaForm.fillEmail("test@example.com", testInfo, { 
      timeout: 30000,
      retries: 2
    });
    logger.success("Email field filled");

    // Submit the form with enhanced reliability
    logger.step("Submitting form");
    await ctaForm.submit(testInfo, { 
      timeout: 30000,
      retries: 2
    });
    
    // Wait for network activity with improved error handling
    logger.step("Waiting for network activity to complete");
    await waitForNetworkIdle(page, 15000);
    logger.info("Network activity completed");
    
    // Save network logs
    await networkLogger.save();
    
    // Verify API mock was called and generate report
    logger.step("Verifying API mock usage");
    const mockReport = await createMockVerificationReport(page);
    logger.info(`Mock verification: ${JSON.stringify(mockReport, null, 2)}`);
    
    // Assert that mock was called
    expect(mockReport.mockVerification.wasCalled).toBe(true);
    expect(mockReport.noRealCalls).toBe(true);
    logger.success("API mock verification passed");
    
    // Wait for and verify the success message appears with improved reliability
    logger.step("Waiting for success message");
    const successMessage = await ctaForm.waitForSuccessMessage(testInfo, 30000);
    
    // Verify the message with better logging
    logger.step("Verifying success message");
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText("submitted successfully");
    logger.success("Success message verified");
    
    // Take a screenshot of the success state
    logger.step("Taking screenshot of success state");
    await waitForAnimationsComplete(page);
    await expectScreenshot(page, testInfo, "cta-flow-success", {
      viewport: StandardViewport.Desktop,
      thresholdPreset: "strict",
      // Focus on the success message by masking other elements
      mask: [
        page.locator("body > *:not(:has(.success-message))"),
      ]
    });
    logger.success("Success state screenshot captured");
    
    // Add rich test attachments for better debugging
    await addTestAttachments(page, testInfo);
    
    logger.end("passed");
  });

  enhancedTest("client-side invalid email validation", async ({ page }, testInfo) => {
    const logger = createTestLogger("CTA Flow - Invalid Email Validation");
    logger.start();
    
    // Initialize page objects
    const splashPage = new SplashPage(page);
    const ctaForm = new CtaForm(page);

    // Navigate to the splash page with improved reliability
    logger.step("Navigating to splash page");
    await splashPage.navigate(testInfo);
    logger.success("Navigation completed");

    // Fill in an invalid email with retry logic
    logger.step("Filling invalid email");
    await ctaForm.fillEmail("invalid-email", testInfo, {
      timeout: 30000,
      retries: 2
    });
    logger.success("Invalid email filled");

    // Try to submit the form with enhanced reliability
    logger.step("Attempting to submit form with invalid email");
    await ctaForm.submit(testInfo, {
      timeout: 30000,
      retries: 2
    });
    logger.info("Form submission attempted with invalid email");

    // Check that the email input has validation error
    logger.step("Verifying form validation");
    const emailInput = page.locator('input[type="email"]');

    // Check if input is invalid with better error handling
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    ).catch(e => {
      logger.error("Failed to evaluate input validity", e);
      return false;
    });
    
    expect(isInvalid).toBeTruthy();
    logger.success("Form validation confirmed invalid email");

    // Verify that we remain on the same page
    logger.step("Verifying no navigation occurred");
    await expect(page).toHaveURL(/\/$/);
    logger.success("Verified no navigation occurred");

    // Check that messages are not visible with better error handling
    logger.step("Verifying no success or error messages appeared");
    
    const successMessage = ctaForm.getSuccessMessage();
    const errorMessage = ctaForm.getErrorMessage();
    
    // Add explicit waiting with timeouts
    const successVisible = await successMessage.isVisible()
      .catch(() => false);
    const errorVisible = await errorMessage.isVisible()
      .catch(() => false);
    
    expect(successVisible).toBeFalsy();
    expect(errorVisible).toBeFalsy();
    logger.success("Verified no messages were displayed");
    
    // Take a screenshot of the form validation state
    logger.step("Taking screenshot of form validation state");
    await waitForAnimationsComplete(page);
    await expectScreenshot(page, testInfo, "cta-flow-invalid-email", {
      viewport: StandardViewport.Desktop,
      thresholdPreset: "strict",
      // Focus on the form by masking other elements
      mask: [
        page.locator("body > *:not(form)"),
      ]
    });
    logger.success("Form validation state screenshot captured");
    
    // Add rich test attachments for better debugging
    await addTestAttachments(page, testInfo);
    
    logger.end("passed");
  });

  enhancedTest("mocked server error - displays error message", async ({ page }, testInfo) => {
    const logger = createTestLogger("CTA Flow - Server Error");
    logger.start();
    
    // Set up detailed network logging for better diagnostics
    const networkLogger = setupNetworkLogging(page, testInfo);
    
    // Mock the Formspark API to return a server error response
    logger.step("Setting up API error mock");
    logger.info(`FormSpark URL: ${getFormSparkSubmitURL()}`);
    await mockFormSparkAPI(page, { 
      success: false,
      errorMessage: "Submission failed",
      statusCode: 400,
      enableLogging: true 
    });
    logger.success("FormSpark API mock configured for error");

    // Initialize page objects
    const splashPage = new SplashPage(page);
    const ctaForm = new CtaForm(page);

    // Navigate to the splash page with improved reliability
    logger.step("Navigating to splash page");
    await splashPage.navigate(testInfo);
    logger.success("Navigation completed");

    // Fill in a valid email with retry logic
    logger.step("Filling email field");
    await ctaForm.fillEmail("test@example.com", testInfo, {
      timeout: 30000,
      retries: 2
    });
    logger.success("Email field filled");

    // Submit the form with enhanced reliability
    logger.step("Submitting form (expecting error)");
    await ctaForm.submit(testInfo, {
      timeout: 30000,
      retries: 2
    });
    
    // Wait for network activity with improved error handling
    logger.step("Waiting for network activity to complete");
    await waitForNetworkIdle(page, 15000);
    logger.info("Network activity completed");
    
    // Save network logs
    await networkLogger.save();
    
    // Verify API mock was called and generate report
    logger.step("Verifying API mock usage");
    const mockReport = await createMockVerificationReport(page);
    logger.info(`Mock verification: ${JSON.stringify(mockReport, null, 2)}`);
    
    // Assert that mock was called
    expect(mockReport.mockVerification.wasCalled).toBe(true);
    expect(mockReport.noRealCalls).toBe(true);
    logger.success("API mock verification passed");
    
    // Wait for and verify the error message appears with improved reliability
    logger.step("Waiting for error message");
    const errorMessage = await ctaForm.waitForErrorMessage(testInfo, 30000);
    
    // Verify the message with better logging
    logger.step("Verifying error message");
    await expect(errorMessage).toBeVisible();
    // The error message could be either the mocked response or the fallback message
    await expect(errorMessage).toContainText(/Submission failed|error submitting/i);
    logger.success("Error message verified");
    
    // Verify that success message is not shown with better error handling
    logger.step("Verifying no success message appeared");
    const successMessage = ctaForm.getSuccessMessage();
    
    // Check with explicit timeout
    const successVisible = await successMessage.isVisible()
      .catch(() => false);
    
    expect(successVisible).toBeFalsy();
    logger.success("Verified no success message was displayed");
    
    // Take a screenshot of the error state
    logger.step("Taking screenshot of error state");
    await waitForAnimationsComplete(page);
    await expectScreenshot(page, testInfo, "cta-flow-error", {
      viewport: StandardViewport.Desktop,
      thresholdPreset: "strict",
      // Focus on the error message by masking other elements
      mask: [
        page.locator("body > *:not(:has(.error-message))"),
      ]
    });
    logger.success("Error state screenshot captured");
    
    // Add rich test attachments for better debugging
    await addTestAttachments(page, testInfo);
    
    logger.end("passed");
  });
  
  // Add a new test for responsive design of the CTA form
  enhancedTest("CTA form should display correctly across different viewports", async ({ page }, testInfo) => {
    const logger = createTestLogger("CTA Form - Responsive Design");
    logger.start();
    
    // Initialize page objects
    const splashPage = new SplashPage(page);
    
    // Navigate to the splash page
    logger.step("Navigating to splash page");
    await splashPage.navigate(testInfo);
    logger.success("Navigation completed");
    
    // Test the form rendering across multiple viewports
    logger.step("Testing CTA form across multiple viewports");
    
    // Test desktop viewport first
    await expectScreenshot(page, testInfo, "cta-form-desktop", {
      viewport: StandardViewport.Desktop,
      thresholdPreset: "default",
      // Focus the screenshot on the form area
      mask: [
        page.locator("header"),
        page.locator("footer")
      ]
    });
    logger.success("Desktop viewport screenshot captured");
    
    // Test tablet viewport
    await expectScreenshot(page, testInfo, "cta-form-tablet", {
      viewport: StandardViewport.Tablet,
      thresholdPreset: "default",
      // Focus the screenshot on the form area
      mask: [
        page.locator("header"),
        page.locator("footer")
      ]
    });
    logger.success("Tablet viewport screenshot captured");
    
    // Test mobile viewport
    await expectScreenshot(page, testInfo, "cta-form-mobile", {
      viewport: StandardViewport.Mobile,
      thresholdPreset: "default",
      // Focus the screenshot on the form area
      mask: [
        page.locator("header"),
        page.locator("footer")
      ]
    });
    logger.success("Mobile viewport screenshot captured");
    
    logger.end("passed");
  });

  // After each test, confirm we created proper artifacts
  enhancedTest.afterEach(async ({}, testInfo) => {
    debugLog(`Test completed: ${testInfo.title}`);
  });
});
