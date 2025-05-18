import { test, expect } from "@playwright/test";
import { SplashPage } from "../page-objects/SplashPage.pom";
import { CtaForm } from "../page-objects/CtaForm.pom";

test.describe("CTA Flow", () => {
  test("happy path - successful email submission", async ({ page }) => {
    // Mock the Formspark API to return a successful response
    await page.route("https://submit-form.com/**", async (route) => {
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
});
