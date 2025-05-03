import { test, expect } from '@playwright/test';

test.describe('Theme Visual Appearance', () => {
  test('should apply correct styles in dark theme', async ({ page }) => {
    // First, set the theme to dark
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'dark');
    });
    
    await page.reload();
    await page.waitForSelector('html.dark');
    
    // Check CSS variables
    const cssVars = await page.evaluate(() => {
      const computedStyle = window.getComputedStyle(document.documentElement);
      return {
        background: computedStyle.getPropertyValue('--background').trim(),
        foreground: computedStyle.getPropertyValue('--foreground').trim(),
        primary: computedStyle.getPropertyValue('--primary').trim(),
        muted: computedStyle.getPropertyValue('--muted').trim(),
      };
    });
    
    // In dark theme, background should be dark and foreground should be light
    expect(cssVars.background).not.toBe(cssVars.foreground);
    
    // Check if elements have appropriate contrast
    const logo = page.locator('.app-logo');
    const logoVisible = await logo.isVisible();
    expect(logoVisible).toBeTruthy();
    
    // Check headline text visibility
    const headline = page.locator('h1');
    const headlineColor = await headline.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Headline text should be light-colored in dark theme
    const rgb = headlineColor.match(/\d+/g)?.map(Number);
    const isLightText = rgb && (rgb[0] > 200 || rgb[1] > 200 || rgb[2] > 200);
    expect(isLightText).toBeTruthy();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'dark-theme.png' });
  });
  
  test('should apply correct styles in light theme', async ({ page }) => {
    // First, set the theme to light
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'light');
    });
    
    await page.reload();
    await page.waitForSelector('html.light');
    
    // Check CSS variables
    const cssVars = await page.evaluate(() => {
      const computedStyle = window.getComputedStyle(document.documentElement);
      return {
        background: computedStyle.getPropertyValue('--background').trim(),
        foreground: computedStyle.getPropertyValue('--foreground').trim(),
        primary: computedStyle.getPropertyValue('--primary').trim(),
        muted: computedStyle.getPropertyValue('--muted').trim(),
      };
    });
    
    // In light theme, background should be light and foreground should be dark
    expect(cssVars.background).not.toBe(cssVars.foreground);
    
    // Check if elements have appropriate contrast
    const logo = page.locator('.app-logo');
    const logoVisible = await logo.isVisible();
    expect(logoVisible).toBeTruthy();
    
    // Check headline text visibility
    const headline = page.locator('h1');
    const headlineColor = await headline.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Headline text should be dark-colored in light theme
    const rgb = headlineColor.match(/\d+/g)?.map(Number);
    const isDarkText = rgb && (rgb[0] < 100 || rgb[1] < 100 || rgb[2] < 100);
    expect(isDarkText).toBeTruthy();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'light-theme.png' });
  });
  
  test('should have visible CTA button with proper contrast in both themes', async ({ browser }) => {
    // Test dark theme first
    const darkContext = await browser.newContext();
    const darkPage = await darkContext.newPage();
    
    await darkPage.goto('/');
    await darkPage.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'dark');
    });
    await darkPage.reload();
    
    // Check CTA button in dark theme
    const darkCta = darkPage.locator('button.cta-button');
    const darkCtaVisible = await darkCta.isVisible();
    expect(darkCtaVisible).toBeTruthy();
    
    // CTA should have good contrast with background
    const darkCtaColor = await darkCta.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        background: style.backgroundColor,
        color: style.color
      };
    });
    
    // Simple contrast check (not a full WCAG calculation)
    expect(darkCtaColor.background).not.toBe(darkCtaColor.color);
    
    // Test light theme
    const lightContext = await browser.newContext();
    const lightPage = await lightContext.newPage();
    
    await lightPage.goto('/');
    await lightPage.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'light');
    });
    await lightPage.reload();
    
    // Check CTA button in light theme
    const lightCta = lightPage.locator('button.cta-button');
    const lightCtaVisible = await lightCta.isVisible();
    expect(lightCtaVisible).toBeTruthy();
    
    // CTA should have good contrast with background
    const lightCtaColor = await lightCta.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        background: style.backgroundColor,
        color: style.color
      };
    });
    
    // Simple contrast check (not a full WCAG calculation)
    expect(lightCtaColor.background).not.toBe(lightCtaColor.color);
    
    await darkContext.close();
    await lightContext.close();
  });
});