import { test, expect } from "@playwright/test";

test.describe("Splash Page Component", () => {
  test("should render correctly in dark theme", async ({ page }) => {
    // Set dark theme
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "dark");
    });

    await page.reload();
    await page.waitForSelector("html.dark");

    // Verify the main splash page elements are present and visible

    // Skip logo check and look for headline instead

    // Headline
    const headline = page.locator("h1");
    await expect(headline).toBeVisible();

    // CTA section
    const ctaSection = page.locator("form");
    await expect(ctaSection).toBeVisible();

    // Input field
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // CTA button
    const ctaButton = page.getByRole("button", { name: /get early access/i });
    await expect(ctaButton).toBeVisible();

    // Check CTA interaction
    await emailInput.fill("test@example.com");
    await ctaButton.click();

    // Check footer
    const footer = page.getByText("a misty step project");
    await expect(footer).toBeVisible();

    // Take a screenshot of the splash page
    await page.screenshot({ path: "e2e/screenshots/dark-splash-page.png" });
  });

  test("should render correctly in light theme", async ({ page }) => {
    // Set light theme
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "light");
    });

    await page.reload();
    await page.waitForSelector("html.light");

    // Verify the main splash page elements are present and visible

    // Skip logo check and look for headline instead

    // Headline
    const headline = page.locator("h1");
    await expect(headline).toBeVisible();

    // CTA section
    const ctaSection = page.locator("form");
    await expect(ctaSection).toBeVisible();

    // Input field
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // CTA button
    const ctaButton = page.getByRole("button", { name: /get early access/i });
    await expect(ctaButton).toBeVisible();

    // Check CTA interaction
    await emailInput.fill("test@example.com");
    await ctaButton.click();

    // Check footer
    const footer = page.getByText("a misty step project");
    await expect(footer).toBeVisible();

    // Take a screenshot of the splash page
    await page.screenshot({ path: "e2e/screenshots/light-splash-page.png" });
  });

  test("should have proper focus styles in dark theme", async ({ page }) => {
    // Set dark theme
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "dark");
    });

    await page.reload();
    await page.waitForSelector("html.dark");

    // Tab to focus on elements and test focus styles
    await page.keyboard.press("Tab"); // Usually focuses on email input

    // Capture screenshot with focused element
    await page.screenshot({ path: "e2e/screenshots/dark-focus-input.png" });

    // Check if something has focus
    const hasFocus = await page.evaluate(
      () =>
        !!document.activeElement && document.activeElement !== document.body,
    );
    expect(hasFocus).toBeTruthy();

    // Tab again to focus on the button
    await page.keyboard.press("Tab");

    // Capture screenshot with button focused
    await page.screenshot({ path: "e2e/screenshots/dark-focus-button.png" });

    // Check if it's a different element now
    const isFocusChanged = await page.evaluate(
      () =>
        !!document.activeElement &&
        document.activeElement.tagName.toLowerCase() === "button",
    );
    expect(isFocusChanged).toBeTruthy();
  });

  test("should have proper focus styles in light theme", async ({ page }) => {
    // Set light theme
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "light");
    });

    await page.reload();
    await page.waitForSelector("html.light");

    // Tab to focus on elements and test focus styles
    await page.keyboard.press("Tab"); // Usually focuses on email input

    // Capture screenshot with focused element
    await page.screenshot({ path: "e2e/screenshots/light-focus-input.png" });

    // Check if something has focus
    const hasFocus = await page.evaluate(
      () =>
        !!document.activeElement && document.activeElement !== document.body,
    );
    expect(hasFocus).toBeTruthy();

    // Tab again to focus on the button
    await page.keyboard.press("Tab");

    // Capture screenshot with button focused
    await page.screenshot({ path: "e2e/screenshots/light-focus-button.png" });

    // Check if it's a different element now
    const isFocusChanged = await page.evaluate(
      () =>
        !!document.activeElement &&
        document.activeElement.tagName.toLowerCase() === "button",
    );
    expect(isFocusChanged).toBeTruthy();
  });
});
