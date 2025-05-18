import { test, expect } from "@playwright/test";
import { SplashPage } from "../page-objects/SplashPage.pom";
import { CtaForm } from "../page-objects/CtaForm.pom";

test.describe("CTA Flow", () => {
  test("happy path - successful email submission", async ({ page }) => {
    // Mock the Formspark API to return a successful response
    await page.route("https://submit-form.com/rq22voxgX", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Initialize page objects
    const splashPage = new SplashPage(page);
    const ctaForm = new CtaForm(page);

    // Navigate to the splash page
    await splashPage.navigate();

    // Fill in a valid email
    await ctaForm.fillEmail("test@example.com");

    // Submit the form
    await ctaForm.submit();

    // Assert that a success message is displayed
    await expect(ctaForm.getSuccessMessage()).toBeVisible();
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
    // Mock the Formspark API to return a server error response
    await page.route("https://submit-form.com/rq22voxgX", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Submission failed" }),
      });
    });

    // Initialize page objects
    const splashPage = new SplashPage(page);
    const ctaForm = new CtaForm(page);

    // Navigate to the splash page
    await splashPage.navigate();

    // Fill in a valid email
    await ctaForm.fillEmail("test@example.com");

    // Submit the form
    await ctaForm.submit();

    // Assert that an error message is displayed - check for the actual error text returned by the API
    await expect(page.getByText('Submission failed')).toBeVisible();

    // Verify that success message is not shown
    await expect(ctaForm.getSuccessMessage()).not.toBeVisible();
  });
});
