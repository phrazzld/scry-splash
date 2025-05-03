import { test, expect } from '@playwright/test';

test.describe('Theme Persistence', () => {
  test('should persist light theme across page reloads', async ({ page }) => {
    // First, set the theme to light via localStorage
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'light');
    });
    
    // Reload the page
    await page.reload();
    
    // Wait for theme to be applied
    await page.waitForSelector('html.light');
    
    // Verify HTML has light class
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('light'));
    expect(htmlClass).toBeTruthy();
    
    // Check the theme debug info if visible
    const themeDebug = page.locator('.bg-background:has-text("Theme Debug")');
    if (await themeDebug.isVisible()) {
      const debugInfo = await themeDebug.textContent();
      expect(debugInfo).toContain('Selected: light');
    }
  });
  
  test('should persist dark theme across page reloads', async ({ page }) => {
    // First, set the theme to dark via localStorage
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'dark');
    });
    
    // Reload the page
    await page.reload();
    
    // Wait for theme to be applied
    await page.waitForSelector('html.dark');
    
    // Verify HTML has dark class
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(htmlClass).toBeTruthy();
    
    // Check the theme debug info if visible
    const themeDebug = page.locator('.bg-background:has-text("Theme Debug")');
    if (await themeDebug.isVisible()) {
      const debugInfo = await themeDebug.textContent();
      expect(debugInfo).toContain('Selected: dark');
    }
  });
  
  test('should persist system theme preference across page reloads', async ({ page }) => {
    // First, set the theme to system via localStorage
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'system');
    });
    
    // Reload the page
    await page.reload();
    
    // Check the theme debug info if visible
    const themeDebug = page.locator('.bg-background:has-text("Theme Debug")');
    if (await themeDebug.isVisible()) {
      const debugInfo = await themeDebug.textContent();
      expect(debugInfo).toContain('Selected: system');
    }
    
    // Check localStorage to verify it remains unchanged
    const localStorageTheme = await page.evaluate(() => localStorage.getItem('scry-ui-theme'));
    expect(localStorageTheme).toBe('system');
  });
  
  test('should apply the correct theme on initial load when localStorage is empty', async ({ browser }) => {
    // Create a context with dark color scheme preference
    const darkContext = await browser.newContext({
      colorScheme: 'dark'
    });
    
    // Create a new page with empty localStorage
    const darkPage = await darkContext.newPage();
    await darkPage.goto('/');
    
    // Wait for theme to be applied based on system preference
    await darkPage.waitForSelector('html.dark');
    
    // Verify HTML has dark class
    const darkHtmlClass = await darkPage.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(darkHtmlClass).toBeTruthy();
    
    await darkContext.close();
    
    // Create a context with light color scheme preference
    const lightContext = await browser.newContext({
      colorScheme: 'light'
    });
    
    // Create a new page with empty localStorage
    const lightPage = await lightContext.newPage();
    await lightPage.goto('/');
    
    // Wait for theme to be applied based on system preference
    await lightPage.waitForSelector('html.light');
    
    // Verify HTML has light class
    const lightHtmlClass = await lightPage.evaluate(() => document.documentElement.classList.contains('light'));
    expect(lightHtmlClass).toBeTruthy();
    
    await lightContext.close();
  });
});