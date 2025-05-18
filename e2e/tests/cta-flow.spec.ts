import { test, expect } from "@playwright/test";
import { SplashPage } from "../page-objects/SplashPage.pom";
import { CtaForm } from "../page-objects/CtaForm.pom";
import { captureDebugInfo, waitForNetworkIdle, setupConsoleLogging, setupNetworkLogging } from "../utils/debug-helpers";

test.describe("CTA Flow", () => {
  test("happy path - successful email submission", async ({ page }) => {
    // Set up debugging
    setupConsoleLogging(page);
    const networkRequests = setupNetworkLogging(page);
    
    // Track API mock usage
    let apiCallMade = false;
    let apiRequestBody: any = null;
    
    // Mock the Formspark API to return a successful response
    await page.route("https://submit-form.com/rq22voxgX", async (route) => {
      console.log('[API Mock] Request intercepted');
      apiCallMade = true;
      
      // Capture request details
      const request = route.request();
      apiRequestBody = request.postDataJSON();
      console.log(`[API Mock] Request body: ${JSON.stringify(apiRequestBody)}`);
      
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
      console.log('[API Mock] Returned success response');
    });

    // Initialize page objects
    const splashPage = new SplashPage(page);
    const ctaForm = new CtaForm(page);

    // Navigate to the splash page
    await splashPage.navigate();
    await captureDebugInfo(page, 'after-navigation');

    // Fill in a valid email
    await ctaForm.fillEmail("test@example.com");
    await captureDebugInfo(page, 'after-email-fill');

    // Submit the form
    console.log('Submitting form...');
    await ctaForm.submit();
    
    // Wait for network activity
    await waitForNetworkIdle(page);
    
    // Add explicit wait to allow for state updates
    console.log('Waiting for potential state updates...');
    await page.waitForTimeout(2000);
    
    await captureDebugInfo(page, 'after-submission');
    
    // Log API mock status
    console.log(`[API Mock] Was called: ${apiCallMade}`);
    console.log(`[API Mock] Request body received: ${JSON.stringify(apiRequestBody)}`);
    console.log(`[Network] Total requests made: ${networkRequests.length}`);
    
    // Try multiple methods to find the success message
    console.log('Attempting to find success message...');
    
    try {
      // First try the page object method
      await expect(ctaForm.getSuccessMessage()).toBeVisible({ timeout: 10000 });
      console.log('Success message found via page object');
    } catch (e) {
      console.log('Failed to find success message with page object, trying alternatives...');
      
      // Try finding by text content
      const thankYouElements = await page.locator('text=Thank you').count();
      console.log(`Elements containing "Thank you": ${thankYouElements}`);
      
      const successElements = await page.locator('text=successfully').count();
      console.log(`Elements containing "successfully": ${successElements}`);
      
      // Try finding by partial text
      const partialSuccess = await page.locator('*:has-text("submitted successfully")').count();
      console.log(`Elements with partial text "submitted successfully": ${partialSuccess}`);
      
      // Check all text content on page
      const allText = await page.evaluate(() => document.body.innerText);
      console.log(`All visible text on page:\n${allText}`);
      
      // Check component state through the DOM
      const componentState = await page.evaluate(() => {
        // Look for any element that might contain status messages
        const statusContainers = document.querySelectorAll('[class*="mt-4"], [class*="text-green"], [class*="text-red"]');
        return Array.from(statusContainers).map(el => ({
          className: el.className,
          textContent: el.textContent,
          isVisible: window.getComputedStyle(el).display !== 'none',
          innerHTML: el.innerHTML,
        }));
      });
      console.log(`Potential status containers: ${JSON.stringify(componentState, null, 2)}`);
      
      // Final debug capture before failing
      await captureDebugInfo(page, 'final-failure-state');
      
      // Re-throw to fail the test
      throw e;
    }
  });

  test("client-side invalid email validation", async ({ page }) => {
    // Initialize page objects
    const splashPage = new SplashPage(page);
    const ctaForm = new CtaForm(page);

    // Navigate to the splash page
    await splashPage.navigate();

    // Fill in an invalid email
    await ctaForm.fillEmail("invalid-email");

    // Try to submit the form
    await ctaForm.submit();

    // Check that the email input has validation error
    const emailInput = page.locator('input[type="email"]');

    // Check if input is invalid
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    );
    expect(isInvalid).toBeTruthy();

    // Also verify that the form remains on the same page (no navigation occurred)
    await expect(page).toHaveURL(/\/$/);

    // Verify that success message is not shown
    await expect(ctaForm.getSuccessMessage()).not.toBeVisible();

    // Verify that server error message is not shown
    await expect(ctaForm.getClientSideErrorMessage()).not.toBeVisible();
  });

  test("mocked server error - displays error message", async ({ page }) => {
    // Set up debugging
    setupConsoleLogging(page);
    setupNetworkLogging(page);
    
    // Track API mock usage
    let apiCallMade = false;
    let apiRequestBody: any = null;
    
    // Mock the Formspark API to return a server error response
    await page.route("https://submit-form.com/rq22voxgX", async (route) => {
      console.log('[API Mock] Error request intercepted');
      apiCallMade = true;
      
      // Capture request details
      const request = route.request();
      apiRequestBody = request.postDataJSON();
      console.log(`[API Mock] Request body: ${JSON.stringify(apiRequestBody)}`);
      
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Submission failed" }),
      });
      console.log('[API Mock] Returned error response');
    });

    // Initialize page objects
    const splashPage = new SplashPage(page);
    const ctaForm = new CtaForm(page);

    // Navigate to the splash page
    await splashPage.navigate();
    await captureDebugInfo(page, 'error-test-after-navigation');

    // Fill in a valid email
    await ctaForm.fillEmail("test@example.com");
    await captureDebugInfo(page, 'error-test-after-email-fill');

    // Submit the form
    console.log('Submitting form for error test...');
    await ctaForm.submit();
    
    // Wait for network activity
    await waitForNetworkIdle(page);
    
    // Add explicit wait
    await page.waitForTimeout(2000);
    
    await captureDebugInfo(page, 'error-test-after-submission');
    
    // Log API mock status
    console.log(`[API Mock] Was called: ${apiCallMade}`);
    
    // Try to find error message
    console.log('Attempting to find error message...');
    
    try {
      // Try direct selector first
      await expect(page.getByText('Submission failed')).toBeVisible({ timeout: 10000 });
      console.log('Error message found');
    } catch (e) {
      console.log('Failed to find error message, debugging...');
      
      // Look for any error text
      const errorElements = await page.locator('text=error').count();
      console.log(`Elements containing "error": ${errorElements}`);
      
      const failedElements = await page.locator('text=failed').count();
      console.log(`Elements containing "failed": ${failedElements}`);
      
      // Check for elements with error styling
      const errorStyleElements = await page.locator('[class*="text-red"], [class*="error"]').count();
      console.log(`Elements with error styling: ${errorStyleElements}`);
      
      // Get all text
      const allText = await page.evaluate(() => document.body.innerText);
      console.log(`All visible text:\n${allText}`);
      
      // Check form state
      const formElements = await page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        const messages = document.querySelectorAll('[class*="mt-4"]');
        return {
          formCount: forms.length,
          messageElements: Array.from(messages).map(el => ({
            className: el.className,
            textContent: el.textContent,
            innerHTML: el.innerHTML,
          })),
        };
      });
      console.log(`Form state: ${JSON.stringify(formElements, null, 2)}`);
      
      await captureDebugInfo(page, 'error-test-final-failure');
      throw e;
    }

    // Verify that success message is not shown
    await expect(ctaForm.getSuccessMessage()).not.toBeVisible();
  });
});
