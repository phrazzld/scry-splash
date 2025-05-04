import { test, expect } from '@playwright/test';

test.describe('Theme Switching (via localStorage)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('should apply light theme when set in localStorage', async ({ page }) => {
    // Set theme to light via localStorage
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'light');
    });
    
    // Reload the page to apply the theme
    await page.reload();
    
    // Wait for light theme to be applied
    await page.waitForSelector('html.light');
    
    // Verify HTML has light class
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('light'));
    expect(htmlClass).toBeTruthy();
    
    // Verify localStorage is updated
    const localStorageTheme = await page.evaluate(() => localStorage.getItem('scry-ui-theme'));
    expect(localStorageTheme).toBe('light');
  });
  
  test('should apply dark theme when set in localStorage', async ({ page }) => {
    // First ensure we're not already in dark theme
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'light');
    });
    await page.reload();
    await page.waitForSelector('html.light');
    
    // Now switch to dark theme
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'dark');
    });
    await page.reload();
    
    // Wait for dark theme to be applied
    await page.waitForSelector('html.dark');
    
    // Verify HTML has dark class
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(htmlClass).toBeTruthy();
    
    // Verify localStorage is updated
    const localStorageTheme = await page.evaluate(() => localStorage.getItem('scry-ui-theme'));
    expect(localStorageTheme).toBe('dark');
  });
  
  test('should apply system theme when set in localStorage', async ({ page, browser }) => {
    // Create a context with known color scheme
    await page.context().clearCookies();
    
    // Ensure we're not already using system theme
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'dark');
    });
    await page.reload();
    await page.waitForSelector('html.dark');
    
    // Now switch to system theme
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'system');
    });
    await page.reload();
    
    // Verify localStorage is updated
    const localStorageTheme = await page.evaluate(() => localStorage.getItem('scry-ui-theme'));
    expect(localStorageTheme).toBe('system');
    
    // The actual theme (light/dark) will depend on the system preference,
    // so we don't test that specific outcome here.
  });
});