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
    
    // Wait for and verify the success message appears
    console.log('Waiting for success message...');
    
    // Use the updated selector with explicit wait
    const successMessage = ctaForm.getSuccessMessage();
    await expect(successMessage).toBeVisible({ timeout: 15000 });
    
    // Optional: Verify the message contains expected text
    await expect(successMessage).toContainText('submitted successfully');
    
    console.log('Success message found and verified');
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

    // Verify that error message is not shown
    await expect(ctaForm.getErrorMessage()).not.toBeVisible();
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
    
    // Wait for and verify the error message appears
    console.log('Waiting for error message...');
    
    // Use the updated selector with explicit wait
    const errorMessage = ctaForm.getErrorMessage();
    await expect(errorMessage).toBeVisible({ timeout: 15000 });
    
    // Verify the message contains expected text (generic error since API returns 400)
    await expect(errorMessage).toContainText('error submitting');
    
    console.log('Error message found and verified');

    // Verify that success message is not shown
    await expect(ctaForm.getSuccessMessage()).not.toBeVisible();
  });
});
