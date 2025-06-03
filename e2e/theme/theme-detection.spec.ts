import { test, expect } from "@playwright/test";

test.describe.skip("Theme Detection", () => {
  test("should detect system preference for dark theme", async ({
    browser,
  }) => {
    // Create a context with dark color scheme preference
    const context = await browser.newContext({
      colorScheme: "dark",
    });

    const page = await context.newPage();
    await page.goto("/");

    // Wait for theme to be applied
    await page.waitForSelector("html.dark");

    // Verify HTML has dark class or dark data-theme attribute
    const isDarkTheme = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    expect(isDarkTheme).toBeTruthy();

    // Verify background color is dark
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Dark theme should have a dark background (close to black)
    // We use RGB values to avoid issues with different color formats
    const rgb = bgColor.match(/\d+/g)?.map(Number);
    expect(rgb?.every((val) => val < 50)).toBeTruthy(); // All RGB values should be low (dark)

    await context.close();
  });

  test("should detect system preference for light theme", async ({
    browser,
  }) => {
    // Create a context with light color scheme preference
    const context = await browser.newContext({
      colorScheme: "light",
    });

    const page = await context.newPage();
    await page.goto("/");

    // Wait for theme to be applied
    await page.waitForSelector("html.light");

    // Verify HTML has light class or light data-theme attribute
    const isLightTheme = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains("light") ||
        document.documentElement.getAttribute("data-theme") === "light"
      );
    });
    expect(isLightTheme).toBeTruthy();

    // Verify background color is light
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Light theme should have a light background (close to white)
    const rgb = bgColor.match(/\d+/g)?.map(Number);
    expect(rgb?.every((val) => val > 200)).toBeTruthy(); // All RGB values should be high (light)

    await context.close();
  });

  test("should correctly set data-theme attribute", async ({ browser }) => {
    // Create a context with dark color scheme preference
    const context = await browser.newContext({
      colorScheme: "dark",
    });

    const page = await context.newPage();
    await page.goto("/");

    // Check the data-theme attribute or class
    const isDarkTheme = await page.evaluate(() => {
      return (
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"
      );
    });
    expect(isDarkTheme).toBeTruthy();

    await context.close();
  });
});
