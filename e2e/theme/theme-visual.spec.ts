import { expect } from '@playwright/test';
import { 
  withErrorReporting, 
  debugLog, 
  initializeDebugEnvironment,
  waitForNetworkIdle
} from '../utils/enhanced-testing';
import {
  expectScreenshot,
  StandardViewport
} from '../utils/visual-testing';

// Use the enhanced test fixture for better error reporting
const enhancedTest = withErrorReporting;

enhancedTest.describe('Theme Visual Appearance', () => {
  // Initialize the environment before running tests
  enhancedTest.beforeEach(async ({}, testInfo) => {
    await initializeDebugEnvironment(testInfo);
    debugLog(`Starting theme visual test: ${testInfo.title}`);
  });

  enhancedTest('should apply correct styles in dark theme', async ({ page }, testInfo) => {
    // First, set the theme to dark
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'dark');
    });
    
    await page.reload();
    await page.waitForSelector('html.dark');
    await waitForNetworkIdle(page);
    
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
    
    // Check headline text visibility
    const headline = page.locator('h1');
    const headlineColor = await headline.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Headline text should be light-colored in dark theme
    const rgb = headlineColor.match(/\d+/g)?.map(Number);
    const isLightText = rgb && (rgb[0] > 200 || rgb[1] > 200 || rgb[2] > 200);
    expect(isLightText).toBeTruthy();
    
    // Take a visual screenshot using the enhanced testing tool
    await expectScreenshot(page, testInfo, 'theme-dark', {
      viewport: StandardViewport.Desktop,
      thresholdPreset: 'default',
      animationTimeout: 5000,
      stabilityDelay: 1000
    });
  });
  
  enhancedTest('should apply correct styles in light theme', async ({ page }, testInfo) => {
    // First, set the theme to light
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'light');
    });
    
    await page.reload();
    await page.waitForSelector('html.light');
    await waitForNetworkIdle(page);
    
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
    
    // Check headline text visibility
    const headline = page.locator('h1');
    const headlineColor = await headline.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Headline text should be dark-colored in light theme
    const rgb = headlineColor.match(/\d+/g)?.map(Number);
    const isDarkText = rgb && (rgb[0] < 100 || rgb[1] < 100 || rgb[2] < 100);
    expect(isDarkText).toBeTruthy();
    
    // Take a visual screenshot using the enhanced testing tool
    await expectScreenshot(page, testInfo, 'theme-light', {
      viewport: StandardViewport.Desktop,
      thresholdPreset: 'default',
      animationTimeout: 5000,
      stabilityDelay: 1000
    });
  });
  
  enhancedTest('should have visible CTA button with proper contrast in both themes', async ({ browser }, testInfo) => {
    // Test dark theme first
    const darkContext = await browser.newContext();
    const darkPage = await darkContext.newPage();
    
    await darkPage.goto('/');
    await darkPage.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'dark');
    });
    await darkPage.reload();
    await darkPage.waitForSelector('html.dark');
    await waitForNetworkIdle(darkPage);
    
    // Check CTA button in dark theme
    const darkCta = darkPage.getByRole('button', { name: /get early access/i });
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
    
    // Take a screenshot of the CTA button in dark theme
    await expectScreenshot(darkPage, testInfo, 'theme-dark-cta', {
      viewport: StandardViewport.Desktop,
      thresholdPreset: 'strict',
      stabilityDelay: 1000,
      // Mask everything except the CTA to focus on it
      mask: [
        darkPage.locator('body > *:not(:has(button:has-text("Get Early Access")))'),
      ]
    });
    
    // Test light theme
    const lightContext = await browser.newContext();
    const lightPage = await lightContext.newPage();
    
    await lightPage.goto('/');
    await lightPage.evaluate(() => {
      localStorage.setItem('scry-ui-theme', 'light');
    });
    await lightPage.reload();
    await lightPage.waitForSelector('html.light');
    await waitForNetworkIdle(lightPage);
    
    // Check CTA button in light theme
    const lightCta = lightPage.getByRole('button', { name: /get early access/i });
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
    
    // Take a screenshot of the CTA button in light theme
    await expectScreenshot(lightPage, testInfo, 'theme-light-cta', {
      viewport: StandardViewport.Desktop,
      thresholdPreset: 'strict',
      stabilityDelay: 1000,
      // Mask everything except the CTA to focus on it
      mask: [
        lightPage.locator('body > *:not(:has(button:has-text("Get Early Access")))'),
      ]
    });
    
    await darkContext.close();
    await lightContext.close();
  });
  
  // Add a new test to check theme rendering across different viewports
  enhancedTest('should render both themes correctly across different viewports', async ({ browser }, testInfo) => {
    // Test each theme across viewports
    const viewports = [StandardViewport.Mobile, StandardViewport.Tablet, StandardViewport.Desktop];
    const themes = ['dark', 'light'];
    
    for (const theme of themes) {
      for (const viewport of viewports) {
        const dimensions = viewport === StandardViewport.Mobile 
          ? { width: 375, height: 667 } 
          : viewport === StandardViewport.Tablet 
            ? { width: 768, height: 1024 }
            : { width: 1280, height: 800 };
        
        // Create new context for this theme and viewport
        const context = await browser.newContext({
          viewport: dimensions
        });
        const page = await context.newPage();
        
        // Set up theme and navigate
        await page.goto('/');
        await page.evaluate((themeName) => {
          localStorage.setItem('scry-ui-theme', themeName);
        }, theme);
        await page.reload();
        await page.waitForSelector(`html.${theme}`);
        await waitForNetworkIdle(page);
        
        // Take screenshot
        await expectScreenshot(page, testInfo, `theme-${theme}-${viewport}`, {
          viewport: dimensions,
          thresholdPreset: 'lenient', // More relaxed thresholds for multi-viewport tests
          animationTimeout: 5000,
          stabilityDelay: 1000
        });
        
        await context.close();
      }
    }
  });
});