import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Ensure the theme switch is visible - may need to scroll to see it
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  });
  
  test('should switch to light theme when clicking light theme button', async ({ page }) => {
    // Find and click the light theme button
    const lightButton = page.locator('button[aria-label="Switch to light theme"]');
    await lightButton.click();
    
    // Wait for light theme to be applied
    await page.waitForSelector('html.light');
    
    // Verify HTML has light class
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('light'));
    expect(htmlClass).toBeTruthy();
    
    // Verify light button is active (has the primary background color)
    const hasActiveClass = await lightButton.evaluate(button => {
      return button.classList.contains('bg-primary');
    });
    expect(hasActiveClass).toBeTruthy();
    
    // Verify localStorage is updated
    const localStorageTheme = await page.evaluate(() => localStorage.getItem('scry-ui-theme'));
    expect(localStorageTheme).toBe('light');
  });
  
  test('should switch to dark theme when clicking dark theme button', async ({ page }) => {
    // First ensure we're not already in dark theme
    const lightButton = page.locator('button[aria-label="Switch to light theme"]');
    await lightButton.click();
    await page.waitForSelector('html.light');
    
    // Now switch to dark theme
    const darkButton = page.locator('button[aria-label="Switch to dark theme"]');
    await darkButton.click();
    
    // Wait for dark theme to be applied
    await page.waitForSelector('html.dark');
    
    // Verify HTML has dark class
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(htmlClass).toBeTruthy();
    
    // Verify dark button is active
    const hasActiveClass = await darkButton.evaluate(button => {
      return button.classList.contains('bg-primary');
    });
    expect(hasActiveClass).toBeTruthy();
    
    // Verify localStorage is updated
    const localStorageTheme = await page.evaluate(() => localStorage.getItem('scry-ui-theme'));
    expect(localStorageTheme).toBe('dark');
  });
  
  test('should switch to system theme when clicking system theme button', async ({ page, browser }) => {
    // Create a context with known color scheme
    await page.context().clearCookies();
    
    // Ensure we're not already using system theme
    const darkButton = page.locator('button[aria-label="Switch to dark theme"]');
    await darkButton.click();
    await page.waitForSelector('html.dark');
    
    // Now switch to system theme
    const systemButton = page.locator('button:has-text("System")');
    await systemButton.click();
    
    // Verify system button is active
    const hasActiveClass = await systemButton.evaluate(button => {
      return button.classList.contains('bg-primary');
    });
    expect(hasActiveClass).toBeTruthy();
    
    // Verify localStorage is updated
    const localStorageTheme = await page.evaluate(() => localStorage.getItem('scry-ui-theme'));
    expect(localStorageTheme).toBe('system');
    
    // The actual theme (light/dark) will depend on the system preference,
    // so we don't test that specific outcome here.
  });
});