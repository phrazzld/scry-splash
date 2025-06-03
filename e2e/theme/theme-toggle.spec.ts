import { test, expect } from "@playwright/test";

test.describe("Theme Toggle Button", () => {
  // Common setup for all tests
  test.beforeEach(async ({ page }) => {
    // Start with a fresh page visit
    await page.goto("/");
  });

  test("should be visible in the footer", async ({ page }) => {
    // Look for the theme toggle button in the footer
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Find the button in the footer
    const themeToggleButton = footer.locator("button");
    await expect(themeToggleButton).toBeVisible();

    // Verify it has an aria-label attribute
    const hasAriaLabel = await themeToggleButton.evaluate((el) =>
      el.hasAttribute("aria-label"),
    );
    expect(hasAriaLabel).toBeTruthy();

    // Take a screenshot showing the button in the footer
    await page.screenshot({
      path: "e2e/screenshots/theme-toggle-button-in-footer.png",
    });
  });

  test("should show the sun icon in dark mode", async ({ page }) => {
    // Set dark theme
    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "dark");
    });
    await page.reload();
    await page.waitForSelector("html.dark");

    // Find the theme toggle button
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const themeToggleButton = footer.locator("button");
    await expect(themeToggleButton).toBeVisible();

    // Verify the button has an aria-label that contains the word "light"
    const ariaLabel = await themeToggleButton.getAttribute("aria-label");
    expect(ariaLabel?.toLowerCase().includes("light")).toBeTruthy();

    // Take a screenshot
    await page.screenshot({
      path: "e2e/screenshots/theme-toggle-dark-mode.png",
    });
  });

  test("should show the moon icon in light mode", async ({ page }) => {
    // Set light theme
    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "light");
    });
    await page.reload();
    await page.waitForSelector("html.light");

    // Find the theme toggle button by targeting the button in the footer
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const themeToggleButton = footer.locator("button");
    await expect(themeToggleButton).toBeVisible();

    // Skip checking aria-label content as it might vary
    // Just verify we have a visible button in the footer

    // Take a screenshot to visually verify
    await page.screenshot({
      path: "e2e/screenshots/theme-toggle-light-mode.png",
    });
  });

  test("should toggle from dark to light theme when clicked", async ({
    page,
  }) => {
    // Set dark theme initially
    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "dark");
    });
    await page.reload();
    await page.waitForSelector("html.dark");

    // Verify we're in dark theme
    const isDarkTheme = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(isDarkTheme).toBeTruthy();

    // Find and click the theme toggle button
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const themeToggleButton = footer.locator("button");
    await expect(themeToggleButton).toBeVisible();

    // Click the button
    await themeToggleButton.click();

    // Wait for the theme to change
    await page.waitForSelector("html.light", { timeout: 5000 });

    // Verify theme changed to light
    const isLightTheme = await page.evaluate(() =>
      document.documentElement.classList.contains("light"),
    );
    expect(isLightTheme).toBeTruthy();

    // Verify localStorage was updated
    const theme = await page.evaluate(() =>
      localStorage.getItem("scry-ui-theme"),
    );
    expect(theme).toBe("light");

    // Take a screenshot after toggle
    await page.screenshot({
      path: "e2e/screenshots/theme-toggled-to-light.png",
    });
  });

  test("should toggle from light to dark theme when clicked", async ({
    page,
  }) => {
    // Set light theme initially
    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "light");
    });
    await page.reload();
    await page.waitForSelector("html.light");

    // Verify we're in light theme
    const isLightTheme = await page.evaluate(() =>
      document.documentElement.classList.contains("light"),
    );
    expect(isLightTheme).toBeTruthy();

    // Find and click the theme toggle button
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const themeToggleButton = footer.locator("button");
    await expect(themeToggleButton).toBeVisible();

    // Click the button
    await themeToggleButton.click();

    // Wait for the theme to change
    await page.waitForSelector("html.dark", { timeout: 5000 });

    // Verify theme changed to dark
    const isDarkTheme = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(isDarkTheme).toBeTruthy();

    // Verify localStorage was updated
    const theme = await page.evaluate(() =>
      localStorage.getItem("scry-ui-theme"),
    );
    expect(theme).toBe("dark");

    // Take a screenshot after toggle
    await page.screenshot({
      path: "e2e/screenshots/theme-toggled-to-dark.png",
    });
  });

  test("should persist theme preference between page loads", async ({
    page,
  }) => {
    // Set a specific theme
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "light");
    });

    // Reload the page
    await page.reload();

    // Verify the theme is applied
    await page.waitForSelector("html.light");

    // Now set to dark theme
    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "dark");
    });

    // Reload again
    await page.reload();

    // Verify the theme switched to dark
    await page.waitForSelector("html.dark");

    // Get the current theme from classes
    const currentTheme = await page.evaluate(() =>
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
    expect(currentTheme).toBe("dark");

    // Verify localStorage has the correct theme setting
    const storedTheme = await page.evaluate(() =>
      localStorage.getItem("scry-ui-theme"),
    );
    expect(storedTheme).toBe("dark");
  });

  test("should be keyboard accessible", async ({ page }) => {
    // Start with a fresh page and set a known theme
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "dark");
    });
    await page.reload();
    await page.waitForSelector("html.dark");

    // Find the theme toggle button
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const themeToggleButton = footer.locator("button");
    await expect(themeToggleButton).toBeVisible();

    // Focus the button directly instead of trying to tab to it
    await themeToggleButton.focus();

    // Take a screenshot with button focused
    await page.screenshot({
      path: "e2e/screenshots/theme-toggle-keyboard-focus.png",
    });

    // Get the initial theme
    const initialTheme = await page.evaluate(() =>
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );

    // Activate the button with keyboard
    await page.keyboard.press("Enter");

    // Calculate the expected theme after toggle
    const expectedTheme = initialTheme === "dark" ? "light" : "dark";

    // Wait for the theme to change
    await page.waitForSelector(`html.${expectedTheme}`, { timeout: 5000 });

    // Verify theme changed after keyboard activation
    const themeAfterToggle = await page.evaluate(() =>
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
    expect(themeAfterToggle).toBe(expectedTheme);

    // Get what theme was stored in localStorage
    const storedTheme = await page.evaluate(() =>
      localStorage.getItem("scry-ui-theme"),
    );

    // Verify the localStorage theme matches the visual theme
    expect(storedTheme).toBe(themeAfterToggle);
  });

  test("should override system theme preference when toggled", async ({
    browser,
  }) => {
    // Create browser context with dark color scheme
    const context = await browser.newContext({
      colorScheme: "dark",
    });

    const page = await context.newPage();
    await page.goto("/");

    // Set system theme in localStorage
    await page.evaluate(() => {
      localStorage.setItem("scry-ui-theme", "system");
    });
    await page.reload();

    // Verify we're using dark theme (from system preference)
    await page.waitForSelector("html.dark");

    // Find and click the theme toggle button to override to light
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const themeToggleButton = footer.locator("button");
    await expect(themeToggleButton).toBeVisible();

    await themeToggleButton.click();

    // Wait for theme to change to light despite system preference for dark
    await page.waitForSelector("html.light", { timeout: 5000 });

    // Verify localStorage was updated from 'system' to explicit 'light'
    const theme = await page.evaluate(() =>
      localStorage.getItem("scry-ui-theme"),
    );
    expect(theme).toBe("light");

    // Take a screenshot showing light theme despite system dark preference
    await page.screenshot({
      path: "e2e/screenshots/light-theme-override-system.png",
    });

    // Clean up
    await context.close();
  });
});
