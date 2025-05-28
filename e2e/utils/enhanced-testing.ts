/**
 * Enhanced Testing Module
 * 
 * Top-level integration module that brings together all testing utilities.
 * Provides high-level test helpers, page object model base class, and reusable utilities
 * for writing robust and maintainable E2E tests.
 * 
 * This module is the main entry point for test files and depends on all other utility modules.
 * 
 * Dependencies:
 * - core.ts: For base utilities and type definitions
 * - debugArtifacts.ts: For artifact creation and management
 * - test-setup.ts: For test environment setup and configuration
 * - debug-helpers.ts: For debug information capture and logging
 * - environment-detector.ts: For environment detection and configuration
 * - filesystem-validator.ts: For filesystem validation and operations
 * - browser-metrics.ts: For browser performance metrics collection
 * - environment-capture.ts: For comprehensive environment information capture
 * - ci-debugger.ts: For unified CI debugging capabilities
 */

import { test, mergeTests, type Page, type Locator, type TestInfo } from '@playwright/test';

// Import from core
import { debugLog, retry as coreRetry, sleep, isRunningInCI } from './core';

// Import from debugArtifacts
import { 
  initializeDebugEnvironment,
  takeAndSaveScreenshot,
  saveHtmlContent,
  saveJsonData,
  logDirectoryListing,
  saveCustomArtifact
} from './debugArtifacts';

// Import from test-setup
import { 
  capturePageState, 
  setupConsoleLogging,
  attachDebugArtifacts
} from './test-setup';

// Import from debug-helpers
import {
  waitForNetworkIdle,
  captureDebugInfo,
  setupNetworkLogging
} from './debug-helpers';

// Import from environment-detector
import {
  getEnvironmentInfo,
  getEnvironmentConfig,
  detectCIProvider,
  detectOperatingSystem,
  printEnvironmentDiagnosis,
  CIProvider,
  OperatingSystem,
  BrowserType
} from './environment-detector';

// Import from filesystem-validator
import {
  ensureDirectoryExists,
  checkPermissions,
  validateArtifactStructure,
  writeDataToFile,
  getDirectoryContents,
  FilesystemError,
  FilesystemErrorCode
} from './filesystem-validator';

// Import from browser-metrics
import {
  setupPerformanceMetrics,
  collectPerformanceMetrics,
  getBrowserInfo
} from './browser-metrics';

// Import from environment-capture
import {
  captureEnvironmentDiagnostics,
  captureFailureInfo,
  setupErrorCapture,
  createFailureReport,
  FailureType
} from './environment-capture';

// Import from ci-debugger
import {
  setupCIDebugging,
  withCIDebugging,
  CIDebugger,
  DebugLevel
} from './ci-debugger';

// Re-export all needed functions
export {
  // From core
  debugLog,
  isRunningInCI,
  
  // From debugArtifacts
  initializeDebugEnvironment,
  takeAndSaveScreenshot,
  saveHtmlContent,
  saveJsonData,
  logDirectoryListing,
  saveCustomArtifact,
  
  // From test-setup
  capturePageState,
  setupConsoleLogging,
  attachDebugArtifacts,
  
  // From debug-helpers
  waitForNetworkIdle,
  captureDebugInfo,
  setupNetworkLogging,
  
  // From environment-detector
  getEnvironmentInfo,
  getEnvironmentConfig,
  detectCIProvider,
  detectOperatingSystem,
  printEnvironmentDiagnosis,
  CIProvider,
  OperatingSystem,
  BrowserType,
  
  // From filesystem-validator
  ensureDirectoryExists,
  checkPermissions,
  validateArtifactStructure,
  writeDataToFile,
  getDirectoryContents,
  FilesystemError,
  FilesystemErrorCode,
  
  // From browser-metrics
  setupPerformanceMetrics,
  collectPerformanceMetrics,
  getBrowserInfo,
  
  // From environment-capture
  captureEnvironmentDiagnostics,
  captureFailureInfo,
  setupErrorCapture,
  createFailureReport,
  FailureType,
  
  // From ci-debugger
  setupCIDebugging,
  withCIDebugging,
  CIDebugger,
  DebugLevel
};

/**
 * Retries an operation until it succeeds or reaches the maximum number of attempts
 * @param operation The async function to retry
 * @param options Configuration options for retries
 * @returns The result of the operation
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    onRetry?: (error: Error, attempt: number) => void;
    retryCondition?: (error: Error) => boolean;
    description?: string;
  } = {}
): Promise<T> {
  const {
    retries = 3,
    delay = 1000,
    description = 'operation',
    // Unused parameters, removed to avoid TypeScript warnings
    // onRetry, retryCondition
  } = options;

  return coreRetry(
    operation,
    {
      retries,
      delay,
      description,
      backoff: 1.5,
      maxDelay: 10000
    }
  );
}

/**
 * Creates a test fixture that automatically captures error information
 */
export const withErrorReporting = test.extend<{ errorReporter: void }>({
  errorReporter: [async ({ page }, use, testInfo) => {
    try {
      // Initialize environment and create necessary directories
      await initializeDebugEnvironment(testInfo);
      
      // Setup network logging
      const networkLogger = setupNetworkLogging(page, testInfo);
      
      // Setup console logging
      const consoleLogger = setupConsoleLogging(page, testInfo);
      
      // Take initial screenshot for reference
      await takeAndSaveScreenshot(testInfo, page, 'test-start');
      
      // Create a directory listing for debugging
      await logDirectoryListing(testInfo, undefined, 'test-start');
      
      // Use enhanced error reporting
      try {
        await use();
        
        // Test completed successfully - save final state
        await networkLogger.save();
        await consoleLogger.save();
        await takeAndSaveScreenshot(testInfo, page, 'test-completed');
        
        debugLog(`Test completed successfully: ${testInfo.title}`);
      } catch (error) {
        // Test failed - capture detailed debug information
        debugLog(`Test failure detected in "${testInfo.title}"`, 'error');
        
        // Save network and console logs
        await networkLogger.save();
        await consoleLogger.save();
        
        // Capture comprehensive debug information
        await capturePageState(page, testInfo, `test-failure-${testInfo.title}`);
        
        // Create a directory listing showing all artifacts
        await logDirectoryListing(testInfo, undefined, 'test-failure');
        
        // Re-throw to fail the test
        throw error;
      }
    } catch (error) {
      // Error in the fixture itself
      const errorMessage = error instanceof Error ? error.message : String(error);
      debugLog(`Error in enhanced test fixture: ${errorMessage}`, 'error');
      throw error;
    }
  }, { auto: true }]
});

/**
 * Creates a test fixture with enhanced CI debugging capabilities
 * This extends the basic error reporting with comprehensive CI-specific debugging
 */
export const withCIDebugReporting = test.extend<{ ciDebugger: CIDebugger }>({
  ciDebugger: [async ({ page }, use, testInfo) => {
    // Set up the CI debugger
    const ciDebugger = await setupCIDebugging(page, testInfo, {
      // Use comprehensive debugging in CI, standard in local
      debugLevel: isRunningInCI() ? DebugLevel.Comprehensive : DebugLevel.Standard,
      // Always capture performance metrics in CI
      capturePerformanceMetrics: isRunningInCI(),
      // Create HTML reports for failures
      createHtmlReports: true
    });
    
    try {
      // Initialize environment diagnostics
      await captureEnvironmentDiagnostics(testInfo);
      
      // Collect performance metrics if in CI
      if (isRunningInCI()) {
        await setupPerformanceMetrics(page, testInfo);
      }
      
      // Register error handling
      setupErrorCapture(page, testInfo);
      
      // Make ciDebugger available to the test
      await use(ciDebugger);
    } catch (error) {
      // Handle initialization error
      console.error('Error setting up CI debugging:', error);
      
      // Create a minimal debugger to satisfy the fixture interface
      const minimalDebugger = new CIDebugger(page, testInfo, {
        debugLevel: DebugLevel.Essential
      });
      
      await use(minimalDebugger);
    }
  }, { auto: false }]
});

/**
 * Combined test fixture with all enhanced testing capabilities
 * This combines error reporting and CI debugging
 */
export const enhancedCITest = mergeTests(withErrorReporting, withCIDebugReporting);

/**
 * Retries clicking an element until successful
 */
export async function retryClick(
  locator: Locator, 
  options: { retries?: number; delay?: number; timeout?: number; description?: string } = {}
): Promise<void> {
  const { timeout = 10000, ...retryOptions } = options;
  const description = options.description || `click on ${locator}`;
  
  return withRetry(
    async () => {
      await locator.waitFor({ state: 'visible', timeout });
      await locator.click({ timeout });
    },
    { ...retryOptions, description }
  );
}

/**
 * Retries filling a form field until successful
 */
export async function retryFill(
  locator: Locator,
  value: string,
  options: { retries?: number; delay?: number; timeout?: number; description?: string } = {}
): Promise<void> {
  const { timeout = 10000, ...retryOptions } = options;
  const description = options.description || `fill ${locator} with "${value}"`;
  
  return withRetry(
    async () => {
      await locator.waitFor({ state: 'visible', timeout });
      await locator.fill(value, { timeout });
    },
    { ...retryOptions, description }
  );
}

/**
 * Retries navigation until successful
 */
export async function retryNavigation(
  page: Page,
  testInfo: TestInfo,
  url: string,
  options: { retries?: number; delay?: number; timeout?: number; waitUntil?: 'load'|'domcontentloaded'|'networkidle'; description?: string } = {}
): Promise<void> {
  const { 
    timeout = 30000, 
    waitUntil = 'networkidle',
    ...retryOptions 
  } = options;
  const description = options.description || `navigate to ${url}`;
  
  return withRetry(
    async () => {
      // Initialize environment before navigation
      await initializeDebugEnvironment(testInfo);
      
      // Navigate to URL
      await page.goto(url, { timeout, waitUntil });
      
      // Take a screenshot after navigation
      await takeAndSaveScreenshot(testInfo, page, 'post-navigation');
    },
    { ...retryOptions, description }
  );
}

/**
 * Retries an assertion until it passes
 */
export async function retryAssertion<T>(
  assertion: () => Promise<T>,
  options: { retries?: number; delay?: number; timeout?: number; description?: string } = {}
): Promise<T> {
  const description = options.description || 'assertion';
  return withRetry(assertion, { ...options, description });
}

/**
 * Waits for an element to be stable (no movement or visual changes)
 */
export async function waitForElementStability(
  locator: Locator,
  options: { timeout?: number; checkInterval?: number } = {}
): Promise<void> {
  const { timeout = 10000, checkInterval = 100 } = options;
  const startTime = Date.now();
  let lastRect: { x: number; y: number; width: number; height: number } | null = null;
  
  debugLog(`Waiting for element to stabilize (timeout: ${timeout}ms)...`);
  
  while (Date.now() - startTime < timeout) {
    try {
      // Get current element position and size
      const boundingBox = await locator.boundingBox();
      
      if (!boundingBox) {
        // Element not visible yet
        await sleep(checkInterval);
        continue;
      }
      
      const currentRect = {
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height
      };
      
      if (lastRect && 
          lastRect.x === currentRect.x && 
          lastRect.y === currentRect.y && 
          lastRect.width === currentRect.width && 
          lastRect.height === currentRect.height) {
        // Element has stabilized
        debugLog(`Element stabilized after ${Date.now() - startTime}ms`);
        return;
      }
      
      lastRect = currentRect;
      await sleep(checkInterval);
    } catch (e) {
      // Element might not be available yet
      await sleep(checkInterval);
    }
  }
  
  debugLog(`Element did not stabilize within ${timeout}ms`, 'warn');
  throw new Error(`Element did not stabilize within ${timeout}ms`);
}

/**
 * Waits for a form to be ready for submission with improved reliability
 */
export async function waitForFormReady(
  page: Page,
  testInfo: TestInfo,
  formSelector: string,
  options: { timeout?: number; debug?: boolean } = {}
): Promise<void> {
  const { timeout = 10000, debug = true } = options;
  const logger = createTestLogger('waitForFormReady');
  
  if (debug) {
    logger.start();
    logger.info(`Waiting for form with selector: ${formSelector}`);
  }
  
  try {
    // First check if form exists at all
    const formExists = await page.locator(formSelector).count() > 0;
    
    if (!formExists) {
      if (debug) {
        logger.error(`Form with selector "${formSelector}" not found in the document`);
        // Capture debug information
        await captureDebugInfo(page, testInfo, 'form-not-found');
      }
      throw new Error(`Form with selector "${formSelector}" not found`);
    }
    
    if (debug) {
      logger.info('Form element found, now waiting for it to be interactive');
    }
    
    // Wait for the form element to be visible and attached
    await page.locator(formSelector).waitFor({ 
      state: 'visible', 
      timeout: timeout / 2 
    });
    
    if (debug) {
      logger.info('Form is visible, checking for input elements');
    }
    
    // Wait for key interactive elements within the form
    // Use specific data-testid selectors to avoid matching honeypot fields
    // Try CTA form elements first (most common case), then fall back to generic selectors
    
    // First try data-testid selectors for CTA form elements
    const ctaEmailInput = page.getByTestId('cta-email-input');
    const ctaSubmitButton = page.getByTestId('cta-submit-button');
    
    try {
      // Wait for CTA form elements specifically
      await ctaEmailInput.waitFor({ state: 'visible', timeout: timeout / 4 });
      await ctaSubmitButton.waitFor({ state: 'visible', timeout: timeout / 4 });
    } catch {
      // Fall back to more targeted generic selectors that exclude honeypot fields
      // Target visible, enabled inputs that are NOT honeypot fields
      const visibleInputLocator = page.locator(`${formSelector} input:not([name="_gotcha"]):not([tabindex="-1"])`).first();
      await visibleInputLocator.waitFor({ 
        state: 'visible', 
        timeout: timeout / 2 
      });
    }
    
    if (debug) {
      // Log form state for debugging
      const formInfo = await page.evaluate((selector) => {
        const form = document.querySelector(selector);
        if (!form) return { found: false };
        
        const inputs = form.querySelectorAll('input');
        const buttons = form.querySelectorAll('button');
        
        return {
          found: true,
          inputCount: inputs.length,
          buttonCount: buttons.length,
          inputs: Array.from(inputs).map(input => ({
            type: input.type,
            name: input.name || '(no name)',
            disabled: input.disabled,
            visible: input.offsetParent !== null
          })),
          buttons: Array.from(buttons).map(button => ({
            type: button.type || '(no type)',
            text: button.textContent?.trim() || '(no text)',
            disabled: button.disabled,
            visible: button.offsetParent !== null
          }))
        };
      }, formSelector);
      
      // Save form info as JSON for debugging
      await saveJsonData(testInfo, formInfo, 'form-ready-state');
      
      logger.info(`Form state: ${JSON.stringify(formInfo, null, 2)}`);
      logger.success('Form is ready for interaction');
      logger.end('passed');
    }
  } catch (error) {
    if (debug) {
      logger.error(`Failed waiting for form: ${error instanceof Error ? error.message : String(error)}`);
      logger.end('failed');
    }
    throw error;
  }
}

/**
 * Waits for animations to complete with enhanced reliability
 */
export async function waitForAnimationsComplete(
  page: Page,
  options: { timeout?: number; retries?: number; checkInterval?: number } = {}
): Promise<void> {
  const { timeout = 5000, retries = 3, checkInterval = 100 } = options;
  
  debugLog(`Waiting for animations to complete (timeout: ${timeout}ms, retries: ${retries})...`);
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      debugLog(`Checking for animations (attempt ${attempt + 1}/${retries + 1})...`);
      
      // Look for common animation classes and properties
      await page.waitForFunction(
        () => {
          // Enhanced animation detection - check for more animation classes
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
        { timeout: timeout / (retries + 1) }
      );
      
      // Add additional wait to ensure stability
      await page.waitForTimeout(checkInterval);
      
      // Verify stability by checking for DOM stability
      const before = await page.evaluate(() => document.documentElement.outerHTML);
      await page.waitForTimeout(checkInterval);
      const after = await page.evaluate(() => document.documentElement.outerHTML);
      
      if (before === after) {
        debugLog('Animations completed successfully and DOM is stable');
        return; // Animations are truly stable
      }
      
      debugLog('DOM still changing, continuing to wait...');
    } catch (e) {
      if (attempt === retries) {
        // On last attempt, log warning but continue - this is best-effort
        debugLog(`Could not confirm animations completed: ${e}`, 'warn');
      } else {
        debugLog(`Animation check failed on attempt ${attempt + 1}, retrying...`, 'warn');
      }
    }
  }
  
  // Additional safeguard - final brief wait
  await page.waitForTimeout(100);
  debugLog('Animation wait cycle completed');
}

/**
 * Checks if page is in a loading state
 */
export async function isPageLoading(page: Page): Promise<boolean> {
  try {
    // Check for common loading indicators
    const loadingIndicators = [
      '[aria-busy="true"]',
      '[class*="loading"]',
      '[class*="spinner"]',
      '[role="progressbar"]'
    ];
    
    for (const selector of loadingIndicators) {
      const count = await page.locator(selector).count();
      if (count > 0) return true;
    }
    
    return false;
  } catch (e) {
    debugLog(`Error checking page loading state: ${e}`, 'error');
    return false;
  }
}

/**
 * Waits for a page to stop loading
 */
export async function waitForPageLoaded(
  page: Page,
  options: { timeout?: number; pollInterval?: number } = {}
): Promise<void> {
  const { timeout = 30000, pollInterval = 100 } = options;
  const startTime = Date.now();
  
  debugLog(`Waiting for page to finish loading (timeout: ${timeout}ms)...`);
  
  while (Date.now() - startTime < timeout) {
    if (!(await isPageLoading(page))) {
      // Wait a bit more to ensure stability
      await page.waitForTimeout(500);
      // Double-check it's still not loading
      if (!(await isPageLoading(page))) {
        debugLog(`Page finished loading after ${Date.now() - startTime}ms`);
        return;
      }
    }
    
    await page.waitForTimeout(pollInterval);
  }
  
  debugLog(`Page did not finish loading within ${timeout}ms`, 'warn');
  throw new Error(`Page did not finish loading within ${timeout}ms`);
}

/**
 * Creates a structured logger for test steps
 */
export function createTestLogger(testTitle: string) {
  return {
    start: () => {
      debugLog(`\n🔶 STARTING TEST: ${testTitle}`);
      debugLog(`🕒 ${new Date().toISOString()}`);
      debugLog('--------------------------------------------------');
    },
    
    step: (stepName: string) => {
      debugLog(`\n📌 STEP: ${stepName}`);
    },
    
    info: (message: string) => {
      debugLog(`  ℹ️ ${message}`);
    },
    
    warn: (message: string) => {
      debugLog(`  ⚠️ WARNING: ${message}`, 'warn');
    },
    
    error: (message: string, error?: Error) => {
      debugLog(`  ❌ ERROR: ${message}`, 'error');
      if (error) {
        debugLog(`  ${error.stack || error.message}`, 'error');
      }
    },
    
    success: (message: string) => {
      debugLog(`  ✅ ${message}`);
    },
    
    end: (status: 'passed' | 'failed') => {
      debugLog('--------------------------------------------------');
      debugLog(`🏁 TEST ${status.toUpperCase()}: ${testTitle}`);
      debugLog(`🕒 ${new Date().toISOString()}\n`);
    }
  };
}

/**
 * Adds various attachments to the test report
 */
export async function addTestAttachments(
  page: Page, 
  testInfo: TestInfo, 
  _options: { includeTrace?: boolean } = {}
): Promise<void> {
  try {
    // Use the attachDebugArtifacts function from test-setup module
    await attachDebugArtifacts(page, testInfo, `test-${testInfo.title}`);
    
    // Log directory listing
    await logDirectoryListing(testInfo, undefined, 'final-artifacts');
    
    debugLog(`Debug artifacts attached for test "${testInfo.title}"`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Error attaching debug artifacts: ${errorMessage}`, 'error');
  }
}

/**
 * Enhanced base class for Page Object Models
 */
export class BasePage {
  constructor(protected readonly page: Page) {}
  
  /**
   * Navigates to a page with retry logic and robust URL handling
   */
  async navigateTo(path: string, testInfo: TestInfo, options?: { retries?: number; timeout?: number }): Promise<void> {
    // Handle both absolute and relative paths safely
    let fullUrl: string;
    
    try {
      if (path.startsWith('http://') || path.startsWith('https://')) {
        // Path is already an absolute URL
        fullUrl = path;
      } else {
        // Get current URL or fall back to baseURL
        const currentUrl = this.page.url();
        
        // If current URL is empty or about:blank, use baseURL from config
        let baseUrl = 'http://localhost:3000';
        if (currentUrl && currentUrl !== 'about:blank') {
          baseUrl = currentUrl;
        } else {
          // Try to get baseURL from Playwright config if available
          try {
            const browserContext = this.page.context();
            // Access baseURL from context
            const contextBaseUrl = (browserContext as any)._options?.baseURL;
            if (contextBaseUrl) {
              baseUrl = contextBaseUrl;
            }
          } catch (e) {
            debugLog(`Could not get baseURL from context, using default: ${e}`, 'warn');
          }
        }
        
        // Construct full URL
        fullUrl = new URL(path, baseUrl).toString();
      }
      
      debugLog(`Navigating to: ${fullUrl}`);
      await retryNavigation(this.page, testInfo, fullUrl, options);
      await waitForNetworkIdle(this.page, options?.timeout || 10000);
      await waitForPageLoaded(this.page);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      debugLog(`Navigation error for path "${path}": ${errorMessage}`, 'error');
      debugLog(`Current page URL: ${this.page.url() || '(empty)'}`, 'error');
      
      // Capture debug information
      await captureDebugInfo(this.page, testInfo, 'navigation-error');
      
      throw error;
    }
  }
  
  /**
   * Gets a locator with enhanced error reporting
   */
  getLocator(selector: string, options?: { hasText?: string | RegExp }): Locator {
    const locator = this.page.locator(selector);
    return options?.hasText ? locator.filter({ hasText: options.hasText }) : locator;
  }
  
  /**
   * Clicks an element with retry logic
   */
  async clickElement(selector: string, options?: { retries?: number; timeout?: number }): Promise<void> {
    const locator = this.page.locator(selector);
    await retryClick(locator, options);
  }
  
  /**
   * Fills a form field with retry logic
   */
  async fillField(selector: string, value: string, options?: { retries?: number; timeout?: number }): Promise<void> {
    const locator = this.page.locator(selector);
    await retryFill(locator, value, options);
  }
  
  /**
   * Waits for element to be visible with enhanced error reporting
   */
  async waitForElement(selector: string, testInfo: TestInfo, options?: { state?: 'attached'|'detached'|'visible'|'hidden'; timeout?: number }): Promise<Locator> {
    const { state = 'visible', timeout = 10000 } = options || {};
    const locator = this.page.locator(selector);
    
    try {
      await locator.waitFor({ state, timeout });
      return locator;
    } catch (error) {
      // Enhanced error reporting on timeout
      const errorMessage = error instanceof Error ? error.message : String(error);
      debugLog(`Failed to find element: ${selector} (state: ${state}): ${errorMessage}`, 'error');
      
      // Capture debug information
      await captureDebugInfo(this.page, testInfo, `wait-for-element-failed-${selector.replace(/\W+/g, '-')}`);
      
      throw error;
    }
  }
  
  /**
   * Captures current state for debugging
   */
  async captureState(testInfo: TestInfo, context: string): Promise<void> {
    await captureDebugInfo(this.page, testInfo, context);
  }
}