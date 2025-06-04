import { test, expect } from "@playwright/test";

test.describe("Anti-FOUC Script", () => {
  test("should apply dark theme immediately on load with dark theme in localStorage", async ({
    page,
  }) => {
    // Set dark theme in localStorage before navigating
    await page.context().addInitScript(() => {
      window.localStorage.setItem("scry-ui-theme", "dark");
    });

    // Slow down network requests to better test FOUC prevention
    await page.route("**/*", async (route) => {
      // Use a longer delay to ensure we can detect FOUC if it happens
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.continue();
    });

    // Start navigation
    const navigationPromise = page.goto("/", { waitUntil: "domcontentloaded" });

    // Wait for the document to be available (but not necessarily fully loaded)
    await page.waitForFunction(() => document.documentElement !== null);

    // Take a screenshot of the early page state to visually verify later
    await page.screenshot({ path: "e2e/screenshots/dark-theme-early.png" });

    // Check if the HTML element has the dark class/data-theme before the page fully loads
    // Also check for our indicator element that confirms the theme was applied early
    const earlyThemeCheck = await page.evaluate(() => {
      const root = document.documentElement;
      const indicator = document.getElementById("theme-applied-early");
      return {
        hasDarkClass: root.classList.contains("dark"),
        dataTheme: root.dataset.theme,
        indicatorExists: !!indicator,
        indicatorTheme: indicator?.dataset.appliedTheme,
      };
    });

    // Wait for navigation to complete
    await navigationPromise;

    // Take a second screenshot once the page is fully loaded
    await page.screenshot({ path: "e2e/screenshots/dark-theme-loaded.png" });

    // Verify that dark theme was applied early, before page fully loaded
    // Either the HTML class, data-theme attribute, or our indicator should confirm dark theme
    expect(
      earlyThemeCheck.hasDarkClass ||
        earlyThemeCheck.dataTheme === "dark" ||
        (earlyThemeCheck.indicatorExists &&
          earlyThemeCheck.indicatorTheme === "dark"),
    ).toBeTruthy();

    // Also verify the theme is correct after full load
    const finalThemeState = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(document.body);
      return {
        hasDarkClass: root.classList.contains("dark"),
        dataTheme: root.dataset.theme,
        // Check actual CSS variables that should be set for dark theme
        bgColor: computedStyle.getPropertyValue("background-color").trim(),
      };
    });

    expect(finalThemeState.hasDarkClass).toBeTruthy();
    expect(finalThemeState.dataTheme).toBe("dark");
  });

  test("should apply light theme immediately on load with light theme in localStorage", async ({
    page,
  }) => {
    // Set light theme in localStorage before navigating
    await page.context().addInitScript(() => {
      window.localStorage.setItem("scry-ui-theme", "light");
    });

    // Slow down network requests to better test FOUC prevention
    await page.route("**/*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.continue();
    });

    // Start navigation but don't wait for it to complete
    const navigationPromise = page.goto("/", { waitUntil: "domcontentloaded" });

    // Wait for the document to be available
    await page.waitForFunction(() => document.documentElement !== null);

    // Take a screenshot of the early page state
    await page.screenshot({ path: "e2e/screenshots/light-theme-early.png" });

    // Check if light theme is applied early
    const earlyThemeCheck = await page.evaluate(() => {
      const root = document.documentElement;
      const indicator = document.getElementById("theme-applied-early");
      return {
        hasLightClass: root.classList.contains("light"),
        dataTheme: root.dataset.theme,
        indicatorExists: !!indicator,
        indicatorTheme: indicator?.dataset.appliedTheme,
      };
    });

    // Wait for navigation to complete
    await navigationPromise;

    // Take a second screenshot once fully loaded
    await page.screenshot({ path: "e2e/screenshots/light-theme-loaded.png" });

    // Verify light theme was applied early
    expect(
      earlyThemeCheck.hasLightClass ||
        earlyThemeCheck.dataTheme === "light" ||
        (earlyThemeCheck.indicatorExists &&
          earlyThemeCheck.indicatorTheme === "light"),
    ).toBeTruthy();

    // Verify correct theme after full load too
    const finalThemeState = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(document.body);
      return {
        hasLightClass: root.classList.contains("light"),
        dataTheme: root.dataset.theme,
        bgColor: computedStyle.getPropertyValue("background-color").trim(),
      };
    });

    expect(finalThemeState.hasLightClass).toBeTruthy();
    expect(finalThemeState.dataTheme).toBe("light");
  });

  test("should detect system preference when localStorage is empty", async ({
    browser,
  }) => {
    // Create browser context with dark color scheme preference
    const context = await browser.newContext({
      colorScheme: "dark",
    });

    const page = await context.newPage();

    // Slow down network for testing
    await page.route("**/*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.continue();
    });

    // Start navigation
    const navigationPromise = page.goto("/", { waitUntil: "domcontentloaded" });

    // Wait for document to be available
    await page.waitForFunction(() => document.documentElement !== null);

    // Screenshot early state
    await page.screenshot({ path: "e2e/screenshots/system-theme-early.png" });

    // Check early theme state
    const earlyThemeCheck = await page.evaluate(() => {
      const root = document.documentElement;
      const indicator = document.getElementById("theme-applied-early");
      return {
        hasDarkClass: root.classList.contains("dark"),
        dataTheme: root.dataset.theme,
        indicatorExists: !!indicator,
        indicatorTheme: indicator?.dataset.appliedTheme,
      };
    });

    // Wait for navigation to complete
    await navigationPromise;

    // Final screenshot
    await page.screenshot({ path: "e2e/screenshots/system-theme-loaded.png" });

    // Verify system preference (dark) was applied
    expect(
      earlyThemeCheck.hasDarkClass ||
        earlyThemeCheck.dataTheme === "dark" ||
        (earlyThemeCheck.indicatorExists &&
          earlyThemeCheck.indicatorTheme === "dark"),
    ).toBeTruthy();

    // Also check final state
    const finalDarkState = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        hasDarkClass: root.classList.contains("dark"),
        dataTheme: root.dataset.theme,
      };
    });

    expect(finalDarkState.hasDarkClass).toBeTruthy();

    // Clean up
    await context.close();
  });
});
