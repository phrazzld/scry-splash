import { test, expect } from '@playwright/test';

test.describe('Theme Detection', () => {
  test('should detect system preference for dark theme', async ({ browser }) => {
    // Create a context with dark color scheme preference
    const context = await browser.newContext({
      colorScheme: 'dark'
    });
    
    const page = await context.newPage();
    await page.goto('/');
    
    // Wait for theme to be applied
    await page.waitForSelector('html.dark');
    
    // Verify HTML has dark class
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(htmlClass).toBeTruthy();
    
    // Verify background color is dark
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    // Dark theme should have a dark background (close to black)
    // We use RGB values to avoid issues with different color formats
    const rgb = bgColor.match(/\d+/g)?.map(Number);
    expect(rgb?.every(val => val < 50)).toBeTruthy(); // All RGB values should be low (dark)
    
    await context.close();
  });
  
  test('should detect system preference for light theme', async ({ browser }) => {
    // Create a context with light color scheme preference
    const context = await browser.newContext({
      colorScheme: 'light'
    });
    
    const page = await context.newPage();
    await page.goto('/');
    
    // Wait for theme to be applied
    await page.waitForSelector('html.light');
    
    // Verify HTML has light class
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('light'));
    expect(htmlClass).toBeTruthy();
    
    // Verify background color is light
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    // Light theme should have a light background (close to white)
    const rgb = bgColor.match(/\d+/g)?.map(Number);
    expect(rgb?.every(val => val > 200)).toBeTruthy(); // All RGB values should be high (light)
    
    await context.close();
  });
  
  test('should correctly set data-theme attribute', async ({ browser }) => {
    // Create a context with dark color scheme preference
    const context = await browser.newContext({
      colorScheme: 'dark'
    });
    
    const page = await context.newPage();
    await page.goto('/');
    
    // Check the data-theme attribute
    const dataTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(dataTheme).toBe('dark');
    
    await context.close();
  });
});