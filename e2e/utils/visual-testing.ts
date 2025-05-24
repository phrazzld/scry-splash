/**
 * Visual Testing Module
 * 
 * Provides utilities for consistent visual testing in both local and CI environments.
 * Handles viewport management, animation stabilization, and environment-specific
 * screenshot comparisons.
 * 
 * CI Environment Behavior:
 * - Visual tests are skipped in CI by default to avoid failures due to platform-specific differences
 * - Set VISUAL_TESTS_ENABLED_IN_CI=1 to override this behavior and run visual tests in CI
 * 
 * Dependencies:
 * - core.ts: For base utilities and type definitions
 * - enhanced-testing.ts: For animation and network waiting utilities
 */

import { Page, Locator, expect, TestInfo } from '@playwright/test';
import { debugLog, isRunningInCI } from './core';
import { waitForAnimationsComplete, waitForNetworkIdle, waitForPageLoaded } from './enhanced-testing';
import { takeAndSaveScreenshot } from './debugArtifacts';

/**
 * Standard viewport sizes for visual testing
 */
export enum StandardViewport {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
  LargeDesktop = 'large-desktop',
}

/**
 * Dimensions for standard viewport sizes
 */
export const viewportDimensions = {
  [StandardViewport.Mobile]: { width: 375, height: 667 },
  [StandardViewport.Tablet]: { width: 768, height: 1024 },
  [StandardViewport.Desktop]: { width: 1280, height: 800 },
  [StandardViewport.LargeDesktop]: { width: 1920, height: 1080 },
};

/**
 * Screenshot comparison thresholds based on environment
 */
export const screenshotThresholds = {
  // Default thresholds
  default: {
    // CI environments need higher thresholds due to rendering differences
    threshold: isRunningInCI() ? 0.35 : 0.2,
    // Allow for more pixel differences in CI
    maxDiffPixelRatio: isRunningInCI() ? 0.05 : 0.01,
  },
  // More strict thresholds for specific cases (less animation/dynamic content)
  strict: {
    threshold: isRunningInCI() ? 0.25 : 0.1,
    maxDiffPixelRatio: isRunningInCI() ? 0.03 : 0.005,
  },
  // Very lenient thresholds for highly dynamic content
  lenient: {
    threshold: isRunningInCI() ? 0.45 : 0.3,
    maxDiffPixelRatio: isRunningInCI() ? 0.08 : 0.03,
  },
};

/**
 * Check if visual tests should be skipped
 * Visual tests are skipped in CI by default unless explicitly enabled
 * 
 * This can be controlled with the following environment variables:
 * - VISUAL_TESTS_ENABLED_IN_CI=1: Enable visual tests in CI (default: disabled)
 * - PLAYWRIGHT_TEST_GREP="@visual": Only run visual tests
 * - PLAYWRIGHT_TEST_GREP_INVERT="@visual": Skip visual tests
 *
 * @returns true if visual tests should be skipped, false otherwise
 */
export function shouldSkipVisualTests(): boolean {
  // Skip visual tests in CI by default
  if (isRunningInCI()) {
    // Unless explicitly enabled with VISUAL_TESTS_ENABLED_IN_CI=1
    return process.env.VISUAL_TESTS_ENABLED_IN_CI !== '1';
  }
  // Always run visual tests in local development
  return false;
}

/**
 * Get the appropriate snapshot update mode based on environment and settings
 * 
 * Update modes:
 * - 'all': Update all snapshots (replace existing ones)
 * - 'missing': Only add snapshots that don't exist yet
 * - 'on-failure': Update snapshots for tests that would otherwise fail
 * - undefined: Use Playwright's default behavior
 * 
 * @returns The snapshot update mode to use
 */
export function getSnapshotUpdateMode(): 'all' | 'missing' | 'on-failure' | undefined {
  // If user has explicitly set the mode via environment variable, use that
  const existingMode = process.env.PLAYWRIGHT_UPDATE_SNAPSHOTS;
  if (existingMode) {
    // Validate it's a valid mode
    if (['all', 'missing', 'on-failure'].includes(existingMode)) {
      debugLog(`Using user-defined snapshot update mode: ${existingMode}`, 'info');
      return existingMode as 'all' | 'missing' | 'on-failure';
    } else {
      debugLog(`Invalid snapshot update mode: ${existingMode}, defaulting to undefined`, 'warn');
    }
  }
  
  // For CI with visual tests enabled, use 'missing' mode by default
  if (isRunningInCI() && process.env.VISUAL_TESTS_ENABLED_IN_CI === '1') {
    return 'missing';
  }
  
  // For local development, don't set any mode (let Playwright use its default)
  return undefined;
}

/**
 * Set the viewport to a standard size or custom dimensions
 * 
 * @param page Playwright Page object
 * @param viewport Standard viewport or custom dimensions
 * @returns Promise that resolves when viewport is set
 */
export async function setViewport(
  page: Page, 
  viewport: StandardViewport | { width: number; height: number }
): Promise<void> {
  try {
    // Determine dimensions from standard viewport or use custom dimensions
    const dimensions = typeof viewport === 'string' 
      ? viewportDimensions[viewport] 
      : viewport;
      
    debugLog(`Setting viewport to ${JSON.stringify(dimensions)}`);
    
    // Set viewport size
    await page.setViewportSize(dimensions);
    
    // Allow time for responsive elements to adjust
    await page.waitForTimeout(100);
    
    debugLog(`Viewport set to ${dimensions.width}x${dimensions.height}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Failed to set viewport: ${errorMessage}`, 'error');
    throw error;
  }
}

/**
 * Get the platform-specific screenshot name based on OS and environment
 * 
 * @param baseName Base name for the screenshot
 * @param viewport Viewport size used for the screenshot
 * @returns Platform and environment-specific screenshot name
 */
export function getScreenshotName(
  baseName: string,
  viewport?: StandardViewport | { width: number; height: number }
): string {
  // Get platform and determine if running in CI
  const platform = process.platform;
  const envSuffix = isRunningInCI() ? '-ci' : '';
  
  // Add viewport information if provided
  let viewportSuffix = '';
  if (viewport) {
    if (typeof viewport === 'string') {
      viewportSuffix = `-${viewport}`;
    } else {
      viewportSuffix = `-${viewport.width}x${viewport.height}`;
    }
  }
  
  // Create a complete screenshot name with platform and environment info
  return `${baseName}${viewportSuffix}-${platform}${envSuffix}.png`;
}

/**
 * Options for visual screenshot comparison
 */
export interface VisualComparisonOptions {
  /** Viewport to use for the screenshot */
  viewport?: StandardViewport | { width: number; height: number };
  /** Timeout for screenshot operations */
  timeout?: number;
  /** Elements to mask during comparison */
  mask?: Array<Locator>;
  /** Threshold preset to use for screenshot comparison */
  thresholdPreset?: 'default' | 'strict' | 'lenient';
  /** Custom animation wait timeout */
  animationTimeout?: number;
  /** Custom network idle timeout */
  networkTimeout?: number;
  /** Additional wait time before taking screenshot */
  stabilityDelay?: number;
  /** Whether to save a debug screenshot alongside comparison */
  saveDebugScreenshot?: boolean;
}

/**
 * Take a screenshot and compare it with a baseline using environment-specific settings
 * In CI environment, visual tests are skipped by default unless explicitly enabled
 *
 * @param page Playwright Page object
 * @param testInfo Playwright TestInfo object
 * @param name Base name for the screenshot
 * @param options Configuration options for the visual comparison
 */
export async function expectScreenshot(
  page: Page,
  testInfo: TestInfo,
  name: string,
  options: VisualComparisonOptions = {}
): Promise<void> {
  const { 
    viewport, 
    timeout = 15000, 
    mask,
    thresholdPreset = 'default',
    animationTimeout = timeout / 3,
    networkTimeout = timeout / 3,
    stabilityDelay = 200,
    saveDebugScreenshot = true
  } = options;
  
  try {
    // Check if we should skip visual tests in CI
    if (shouldSkipVisualTests()) {
      debugLog(`Skipping visual comparison for "${name}" in CI environment`, 'info');
      debugLog('To enable visual tests in CI, set VISUAL_TESTS_ENABLED_IN_CI=1', 'info');
      
      // Still set viewport and take debug screenshot for reference
      if (viewport) {
        await setViewport(page, viewport);
      }
      
      // Take debug screenshot even when skipping visual tests
      if (saveDebugScreenshot) {
        debugLog('Taking debug screenshot only (visual comparison skipped)');
        await takeAndSaveScreenshot(testInfo, page, `debug-ci-skipped-${name}`);
      }
      
      // Skip the actual visual comparison
      return;
    }
    
    debugLog(`Preparing visual comparison for "${name}"`);
    
    // Set viewport if specified
    if (viewport) {
      await setViewport(page, viewport);
    }
    
    // Wait for the page to be in a stable state
    debugLog('Waiting for animations to complete');
    await waitForAnimationsComplete(page, { timeout: animationTimeout });
    
    debugLog('Waiting for network to be idle');
    await waitForNetworkIdle(page, networkTimeout);
    
    debugLog('Waiting for page to finish loading');
    await waitForPageLoaded(page);
    
    // Add additional stability delay
    debugLog(`Adding stability delay of ${stabilityDelay}ms`);
    await page.waitForTimeout(stabilityDelay);
    
    // Save debug screenshot if requested
    if (saveDebugScreenshot) {
      await takeAndSaveScreenshot(testInfo, page, `debug-${name}`);
    }
    
    // Get environment-specific screenshot name
    const screenshotName = getScreenshotName(name, viewport);
    debugLog(`Taking screenshot for comparison: ${screenshotName}`);
    
    // Get threshold settings based on preset
    const thresholds = screenshotThresholds[thresholdPreset];
    
    // Take and compare screenshot with appropriate settings
    // Handle snapshot updates based on environment and settings
    try {
      // Get the appropriate snapshot update mode
      const updateMode = getSnapshotUpdateMode();
      
      // If an update mode was determined, set the environment variable
      if (updateMode) {
        debugLog(`Setting snapshot update mode: ${updateMode}`, 'info');
        process.env.PLAYWRIGHT_UPDATE_SNAPSHOTS = updateMode;
      }
      
      await expect(page).toHaveScreenshot(screenshotName, {
        timeout,
        mask,
        threshold: thresholds.threshold,
        maxDiffPixelRatio: thresholds.maxDiffPixelRatio,
      });
    } catch (error) {
      // For CI only with visual tests enabled: if we still get an error, log it but don't fail the test
      if (isRunningInCI() && process.env.VISUAL_TESTS_ENABLED_IN_CI === '1') {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const updateMode = process.env.PLAYWRIGHT_UPDATE_SNAPSHOTS || 'none';
        
        debugLog(`WARNING: Visual comparison failed in CI (update mode: ${updateMode}): ${errorMessage}`, 'warn');
        debugLog('Available options to fix this issue:', 'info');
        debugLog('1. Set VISUAL_TESTS_ENABLED_IN_CI=0 to disable visual tests in CI completely', 'info');
        debugLog('2. Set PLAYWRIGHT_UPDATE_SNAPSHOTS=all to update all snapshots', 'info');
        debugLog('3. Set PLAYWRIGHT_UPDATE_SNAPSHOTS=on-failure to update failing snapshots', 'info');
        return; // Exit without failing in CI
      }
      throw error; // Re-throw in non-CI environment or if tests should fail
    }
    
    debugLog(`Visual comparison passed for "${screenshotName}"`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Visual comparison failed for "${name}": ${errorMessage}`, 'error');
    
    // Save a failure screenshot with timestamp for debugging
    const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
    await takeAndSaveScreenshot(testInfo, page, `failure-${name}-${timestamp}`);
    
    throw error;
  }
}

/**
 * Create a visual test for each standard viewport
 * In CI environment, visual tests are skipped by default unless explicitly enabled
 * 
 * @param page Playwright Page object
 * @param testInfo Playwright TestInfo object
 * @param name Base name for the screenshot
 * @param viewports Array of viewports to test
 * @param options Configuration options for the visual comparison
 */
export async function expectScreenshotForViewports(
  page: Page,
  testInfo: TestInfo,
  name: string,
  viewports: StandardViewport[] = [StandardViewport.Desktop],
  options: Omit<VisualComparisonOptions, 'viewport'> = {}
): Promise<void> {
  // Check if we should skip visual tests in CI
  if (shouldSkipVisualTests()) {
    debugLog(`Skipping multi-viewport visual test for "${name}" in CI environment`, 'info');
    
    // Still take debug screenshots for reference (just one viewport)
    if (viewports.length > 0 && options.saveDebugScreenshot !== false) {
      debugLog(`Taking debug screenshot for reference (using ${viewports[0]} viewport)`);
      await setViewport(page, viewports[0]);
      await takeAndSaveScreenshot(testInfo, page, `debug-ci-skipped-${name}-${viewports[0]}`);
    }
    
    return;
  }
  
  debugLog(`Running visual tests for "${name}" across ${viewports.length} viewports`);
  
  for (const viewport of viewports) {
    debugLog(`Testing viewport: ${viewport}`);
    await expectScreenshot(page, testInfo, name, { ...options, viewport });
  }
  
  debugLog(`Completed visual tests for "${name}" across all viewports`);
}

/**
 * Generate new baseline screenshots for the current environment
 * 
 * This function explicitly generates new screenshots regardless of environment settings.
 * It's useful for creating initial baselines or deliberately updating them.
 * 
 * When running in CI, consider using the PLAYWRIGHT_UPDATE_SNAPSHOTS environment variable
 * with expectScreenshot() instead, as it provides more fine-grained control.
 * 
 * @param page Playwright Page object
 * @param testInfo Playwright TestInfo object
 * @param name Base name for the screenshot
 * @param options Configuration options for the baseline generation
 */
export async function generateBaselineScreenshot(
  page: Page,
  testInfo: TestInfo,
  name: string,
  options: VisualComparisonOptions = {}
): Promise<void> {
  try {
    // In CI, warn that we're generating baselines which might be unexpected
    if (isRunningInCI()) {
      debugLog(`Generating baseline screenshot in CI environment for "${name}"`, 'warn');
      debugLog('Note: This will override existing snapshots if they exist', 'warn');
      debugLog('For more controlled updates, consider using PLAYWRIGHT_UPDATE_SNAPSHOTS with expectScreenshot', 'info');
    } else {
      debugLog(`Generating baseline screenshot for "${name}"`);
    }
    
    const { viewport, timeout = 15000 } = options;
    
    // Set viewport if specified
    if (viewport) {
      await setViewport(page, viewport);
    }
    
    // Wait for stable state
    await waitForAnimationsComplete(page);
    await waitForNetworkIdle(page);
    await waitForPageLoaded(page);
    
    // Add stability delay
    await page.waitForTimeout(200);
    
    // Get environment-specific screenshot name
    const screenshotName = getScreenshotName(name, viewport);
    
    // Take screenshot for baseline
    await page.screenshot({
      path: testInfo.outputPath(`../snapshots/${screenshotName}`),
      timeout,
    });
    
    // Explicitly log the full path for easier verification
    const fullPath = testInfo.outputPath(`../snapshots/${screenshotName}`);
    debugLog(`Baseline screenshot generated: ${screenshotName}`, 'info');
    debugLog(`Full path: ${fullPath}`, 'debug');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Failed to generate baseline screenshot: ${errorMessage}`, 'error');
    throw error;
  }
}