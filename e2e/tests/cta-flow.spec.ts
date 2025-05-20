import { expect } from "@playwright/test";
import { SplashPage } from "../page-objects/SplashPage.pom";
import { CtaForm } from "../page-objects/CtaForm.pom";
import { 
  withErrorReporting, 
  setupDetailedNetworkLogging, 
  createTestLogger, 
  addTestAttachments,
  waitForNetworkIdle
} from "../utils/enhanced-testing";

// Use the enhanced test fixture for better error reporting
const enhancedTest = withErrorReporting;

enhancedTest.describe("CTA Flow", () => {
  enhancedTest("happy path - successful email submission", async ({ page }, testInfo) => {
    const logger = createTestLogger("CTA Flow - Happy Path");
    logger.start();
    
    // Set up detailed network logging for better diagnostics
    setupDetailedNetworkLogging(page);
    
    // Track API mock usage
    let apiCallMade = false;
    let apiRequestBody: any = null;
    
    // Mock the Formspark API to return a successful response
    logger.step("Setting up API mock");
    await page.route("https://submit-form.com/rq22voxgX", async (route) => {
      logger.info("API request intercepted");
      apiCallMade = true;
      
      // Capture request details
      const request = route.request();
      apiRequestBody = request.postDataJSON();
      logger.info(`Request body: ${JSON.stringify(apiRequestBody)}`);
      
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
      logger.success("Returned mocked success response");
    });

    // Initialize page objects
    const splashPage = new SplashPage(page);
    const ctaForm = new CtaForm(page);

    // Navigate to the splash page with improved reliability
    logger.step("Navigating to splash page");
    await splashPage.navigate();
    logger.success("Navigation completed");

    // Fill in a valid email with retry logic
    logger.step("Filling email field");
    await ctaForm.fillEmail("test@example.com", { 
      timeout: 30000,
      retries: 2
    });
    logger.success("Email field filled");

    // Submit the form with enhanced reliability
    logger.step("Submitting form");
    await ctaForm.submit({ 
      timeout: 30000,
      retries: 2
    });
    
    // Wait for network activity with improved error handling
    logger.step("Waiting for network activity to complete");
    await waitForNetworkIdle(page, 15000);
    logger.info("Network activity completed");
    
    // Log API mock status for debugging
    logger.info(`API mock was called: ${apiCallMade}`);
    if (apiRequestBody) {
      logger.info(`Request data: ${JSON.stringify(apiRequestBody)}`);
    }
    
    // Wait for and verify the success message appears with improved reliability
    logger.step("Waiting for success message");
    const successMessage = await ctaForm.waitForSuccessMessage(30000);
    
    // Verify the message with better logging
    logger.step("Verifying success message");
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText("submitted successfully");
    logger.success("Success message verified");
    
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
    await splashPage.navigate();
    logger.success("Navigation completed");

    // Fill in an invalid email with retry logic
    logger.step("Filling invalid email");
    await ctaForm.fillEmail("invalid-email", {
      timeout: 30000,
      retries: 2
    });
    logger.success("Invalid email filled");

    // Try to submit the form with enhanced reliability
    logger.step("Attempting to submit form with invalid email");
    await ctaForm.submit({
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
    
    // Add rich test attachments for better debugging
    await addTestAttachments(page, testInfo);
    
    logger.end("passed");
  });

  enhancedTest("mocked server error - displays error message", async ({ page }, testInfo) => {
    const logger = createTestLogger("CTA Flow - Server Error");
    logger.start();
    
    // Set up detailed network logging for better diagnostics
    setupDetailedNetworkLogging(page);
    
    // Track API mock usage
    let apiCallMade = false;
    let apiRequestBody: any = null;
    
    // Mock the Formspark API to return a server error response
    logger.step("Setting up API error mock");
    await page.route("https://submit-form.com/rq22voxgX", async (route) => {
      logger.info("API request intercepted for error simulation");
      apiCallMade = true;
      
      // Capture request details
      const request = route.request();
      apiRequestBody = request.postDataJSON();
      logger.info(`Request body: ${JSON.stringify(apiRequestBody)}`);
      
      // Return error response
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Submission failed" }),
      });
      logger.success("Returned mocked error response");
    });

    // Initialize page objects
    const splashPage = new SplashPage(page);
    const ctaForm = new CtaForm(page);

    // Navigate to the splash page with improved reliability
    logger.step("Navigating to splash page");
    await splashPage.navigate();
    logger.success("Navigation completed");

    // Fill in a valid email with retry logic
    logger.step("Filling email field");
    await ctaForm.fillEmail("test@example.com", {
      timeout: 30000,
      retries: 2
    });
    logger.success("Email field filled");

    // Submit the form with enhanced reliability
    logger.step("Submitting form (expecting error)");
    await ctaForm.submit({
      timeout: 30000,
      retries: 2
    });
    
    // Wait for network activity with improved error handling
    logger.step("Waiting for network activity to complete");
    await waitForNetworkIdle(page, 15000);
    logger.info("Network activity completed");
    
    // Log API mock status for debugging
    logger.info(`API mock was called: ${apiCallMade}`);
    if (apiRequestBody) {
      logger.info(`Request data: ${JSON.stringify(apiRequestBody)}`);
    }
    
    // Wait for and verify the error message appears with improved reliability
    logger.step("Waiting for error message");
    const errorMessage = await ctaForm.waitForErrorMessage(30000);
    
    // Verify the message with better logging
    logger.step("Verifying error message");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("error submitting");
    logger.success("Error message verified");
    
    // Verify that success message is not shown with better error handling
    logger.step("Verifying no success message appeared");
    const successMessage = ctaForm.getSuccessMessage();
    
    // Check with explicit timeout
    const successVisible = await successMessage.isVisible()
      .catch(() => false);
    
    expect(successVisible).toBeFalsy();
    logger.success("Verified no success message was displayed");
    
    // Add rich test attachments for better debugging
    await addTestAttachments(page, testInfo);
    
    logger.end("passed");
  });
});
