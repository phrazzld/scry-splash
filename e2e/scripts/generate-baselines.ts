/**
 * Script to generate new baseline screenshots for visual testing
 * 
 * This script is used to generate baseline screenshots for different environments
 * (local and CI) and platforms (Linux, Windows, macOS).
 * 
 * Usage:
 *   pnpm ts-node e2e/scripts/generate-baselines.ts
 */

import { chromium, Browser, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs/promises';
import { StandardViewport, viewportDimensions } from '../utils/visual-testing';

// Pages to capture
const pages = [
  { name: 'splash-page', url: '/' },
];

// Viewports to test
const viewports = [
  StandardViewport.Mobile,
  StandardViewport.Tablet,
  StandardViewport.Desktop,
];

// Configuration
const config = {
  baseUrl: 'http://localhost:3000',
  snapshotsDir: path.join(process.cwd(), 'e2e/tests'),
  // Add CI detection
  isCI: process.env.CI === 'true',
  // Platform info
  platform: process.platform, // 'win32', 'darwin', 'linux'
};

/**
 * Generate a screenshot name based on test parameters
 */
function getScreenshotName(pageName: string, viewport: StandardViewport): string {
  const envSuffix = config.isCI ? '-ci' : '';
  return `${pageName}-${viewport}-${config.platform}${envSuffix}.png`;
}

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error);
    throw error;
  }
}

/**
 * Wait for animations to complete
 */
async function waitForAnimationsComplete(page: Page): Promise<void> {
  console.log('Waiting for animations to complete...');
  
  try {
    // Wait for no animations
    await page.waitForFunction(
      () => {
        const animating = document.querySelectorAll(
          '.animate-*, [class*="transition-"], [class*="animate"], ' +
          '[class*="motion-"], [class*="fade"], [class*="slide"], ' +
          '[style*="animation"], [style*="transition"]'
        );
        
        return animating.length === 0 || Array.from(animating).every(el => {
          const styles = window.getComputedStyle(el);
          return styles.animationPlayState === 'completed' || 
                 styles.animationPlayState === 'none' || 
                 styles.animationDuration === '0s' ||
                 styles.transitionDuration === '0s';
        });
      },
      { timeout: 10000 }
    );
    
    // Additional stability delay
    await page.waitForTimeout(2000);
    console.log('Animations completed');
  } catch (e) {
    console.warn('Could not confirm animations completed:', e);
    // Still wait a bit to improve chances of stability
    await page.waitForTimeout(2000);
  }
}

/**
 * Wait for network to be idle
 */
async function waitForNetworkIdle(page: Page): Promise<void> {
  console.log('Waiting for network to be idle...');
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    console.log('Network is idle');
  } catch (e) {
    console.warn('Network idle timeout:', e);
  }
}

/**
 * Generate a baseline screenshot 
 */
async function generateBaseline(
  browser: Browser, 
  pageName: string, 
  url: string, 
  viewport: StandardViewport
): Promise<void> {
  console.log(`Generating baseline for ${pageName} at ${viewport} viewport...`);
  
  const dimensions = viewportDimensions[viewport];
  const page = await browser.newPage({
    viewport: dimensions,
    baseURL: config.baseUrl,
  });
  
  try {
    // Navigate to page
    await page.goto(url);
    console.log(`Navigated to ${url}`);
    
    // Wait for page to stabilize
    await waitForNetworkIdle(page);
    await waitForAnimationsComplete(page);
    
    // Generate screenshot name
    const screenshotName = getScreenshotName(pageName, viewport);
    
    // Determine target directory (for splash-page-load.spec.ts tests)
    const testDir = path.join(config.snapshotsDir, 'splash-page-load.spec.ts-snapshots');
    await ensureDir(testDir);
    
    // Create screenshot file path
    const filePath = path.join(testDir, screenshotName);
    
    // Take screenshot
    await page.screenshot({ path: filePath });
    console.log(`Screenshot saved to ${filePath}`);
  } catch (error) {
    console.error(`Failed to generate baseline for ${pageName} at ${viewport}:`, error);
  } finally {
    await page.close();
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Starting baseline screenshot generation');
  console.log(`Environment: ${config.isCI ? 'CI' : 'Local'}`);
  console.log(`Platform: ${config.platform}`);
  
  const browser = await chromium.launch();
  
  try {
    // Process each page and viewport combination
    for (const page of pages) {
      for (const viewport of viewports) {
        await generateBaseline(browser, page.name, page.url, viewport);
      }
    }
    
    // Generate specific named baselines for existing tests
    const splashPage = pages[0];
    
    // For the original test that uses splash-page-stable.png
    await generateBaseline(
      browser, 
      'splash-page-stable', 
      splashPage.url, 
      StandardViewport.Desktop
    );
    
    // For the new multi-viewport test
    for (const viewport of viewports) {
      await generateBaseline(
        browser, 
        'splash-page-responsive', 
        splashPage.url, 
        viewport
      );
    }
    
    console.log('Baseline generation completed successfully');
  } catch (error) {
    console.error('Failed to generate baselines:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the script
main();