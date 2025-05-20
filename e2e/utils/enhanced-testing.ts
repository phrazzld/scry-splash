import { test, type Page, type Locator, type TestInfo } from '@playwright/test';
import fs from 'fs/promises';
import { captureDebugInfo, setupConsoleLogging, waitForNetworkIdle as debugNetworkIdle } from './debug-helpers';
import { 
  setupTestEnvironment, 
  setupDebugDirectories, 
  saveNetworkLogs,
  capturePageState,
  attachDebugArtifacts
} from './test-setup';

// Re-export waitForNetworkIdle from debug-helpers
export const waitForNetworkIdle = debugNetworkIdle;

// Setup test environment at module load time
setupTestEnvironment().catch(e => console.error('Failed to set up test environment:', e));

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
    onRetry = (error, attempt) => console.log(`Retrying (${attempt}/${retries}) after error: ${error.message}`),
    retryCondition = () => true,
    description = 'operation',
  } = options;

  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      console.log(`Attempting ${description} (${attempt}/${retries + 1})...`);
      const result = await operation();
      if (attempt > 1) {
        console.log(`✓ ${description} succeeded after ${attempt - 1} retries`);
      }
      return result;
    } catch (error) {
      lastError = error as Error;
      if (attempt <= retries && retryCondition(lastError)) {
        onRetry(lastError, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.log(`✗ ${description} failed after ${attempt - 1} retries: ${lastError.message}`);
        break;
      }
    }
  }
  throw lastError!;
}

/**
 * Captures and saves the full page HTML to a file
 */
export async function saveHtmlDump(page: Page, context: string): Promise<string> {
  try {
    const html = await page.content();
    const timestamp = Date.now();
    
    // Use dedicated debug directory
    const debugDir = '.debug/html-dumps';
    
    // Create directory if it doesn't exist
    await fs.mkdir(debugDir, { recursive: true });
    
    const filename = `${debugDir}/html-dump-${context.replace(/\s+/g, '-')}-${timestamp}.html`;
    await fs.writeFile(filename, html);
    
    console.log(`HTML dump saved to: ${filename}`);
    return filename;
  } catch (e) {
    console.error(`Failed to save HTML dump: ${e}`);
    return '';
  }
}

/**
 * Enhanced network logging with detailed request/response capture
 */
export function setupDetailedNetworkLogging(page: Page) {
  const networkData: {
    requests: Record<string, any>;
    responses: Record<string, any>;
  } = {
    requests: {},
    responses: {}
  };

  page.on('request', request => {
    const url = request.url();
    const method = request.method();
    // Use URL as a unique ID for the request since request.id() isn't available
    const requestId = `${method}-${url}-${Date.now()}`;
    
    console.log(`[Network Request] ${method} ${url}`);
    
    try {
      // Capture request details
      networkData.requests[requestId] = {
        url,
        method,
        headers: request.headers(),
        postData: request.postData(),
        timestamp: Date.now(),
        resourceType: request.resourceType()
      };
    } catch (e) {
      console.error(`Error capturing request data: ${e}`);
    }
  });

  page.on('response', async response => {
    const request = response.request();
    const url = response.url();
    const method = request.method();
    const status = response.status();
    // Use URL as a unique ID for the response to match the request
    const requestId = `${method}-${url}-${Date.now()}`;
    
    console.log(`[Network Response] ${status} ${url}`);
    
    try {
      // Get response body for API requests
      let body = null;
      const contentType = response.headers()['content-type'] || '';
      
      if (
        (contentType.includes('json') || 
         contentType.includes('text')) && 
        !url.endsWith('.js') && 
        !url.endsWith('.css') && 
        !url.endsWith('.html')
      ) {
        try {
          body = await response.text();
        } catch (e) {
          body = `<Failed to get response body: ${e}>`;
        }
      }
      
      // Capture response details
      networkData.responses[requestId] = {
        url,
        status,
        headers: response.headers(),
        body,
        timestamp: Date.now()
      };
    } catch (e) {
      console.error(`Error capturing response data: ${e}`);
    }
  });

  return networkData;
}

/**
 * Creates a test fixture that automatically captures error information
 */
export const withErrorReporting = test.extend<{ errorReporter: void }>({
  errorReporter: [async ({ page }, use, testInfo) => {
    // Ensure debug directories exist
    await setupDebugDirectories();
    
    // Setup handlers before test
    const networkData = setupDetailedNetworkLogging(page);
    setupConsoleLogging(page);
    
    // Use enhanced error reporting
    try {
      await use();
    } catch (error) {
      console.log('\n=== TEST FAILURE DETECTED ===');
      
      // Capture comprehensive debug information
      await capturePageState(page, `test-failure-${testInfo.title}`);
      
      // Save network logs using the test-setup module
      await saveNetworkLogs(networkData, `test-failure-${testInfo.title}`);
      
      // Attach debug artifacts to test report
      await attachDebugArtifacts(page, testInfo, `test-failure-${testInfo.title}`);
      
      // Re-throw to fail the test
      throw error;
    }
  }, { auto: true }]
});

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
      await page.goto(url, { timeout, waitUntil });
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
  
  while (Date.now() - startTime < timeout) {
    try {
      // Get current element position and size
      const boundingBox = await locator.boundingBox();
      
      if (!boundingBox) {
        // Element not visible yet
        await new Promise(r => setTimeout(r, checkInterval));
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
        return;
      }
      
      lastRect = currentRect;
      await new Promise(r => setTimeout(r, checkInterval));
    } catch (e) {
      // Element might not be available yet
      await new Promise(r => setTimeout(r, checkInterval));
    }
  }
  
  throw new Error(`Element did not stabilize within ${timeout}ms`);
}

/**
 * Waits for a form to be ready for submission with improved reliability
 */
export async function waitForFormReady(
  page: Page,
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
        // Capture page state for debugging
        await captureDebugInfo(page, 'form-not-found');
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
    // Focus on waiting for any input elements to be visible and enabled
    const inputLocator = page.locator(`${formSelector} input, ${formSelector} button`).first();
    await inputLocator.waitFor({ 
      state: 'visible', 
      timeout: timeout / 2 
    });
    
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
 * Waits for animations to complete
 */
export async function waitForAnimationsComplete(
  page: Page,
  options: { timeout?: number } = {}
): Promise<void> {
  const { timeout = 5000 } = options;
  
  try {
    // Look for common animation classes and properties
    await page.waitForFunction(
      () => {
        // Check for any CSS animations
        const animating = document.querySelectorAll('.animate-*, [class*="transition-"]');
        return animating.length === 0 || Array.from(animating).every(el => {
          const styles = window.getComputedStyle(el);
          return styles.animationPlayState === 'completed' || 
                 styles.animationPlayState === 'none' || 
                 styles.transitionDuration === '0s';
        });
      },
      { timeout }
    );
  } catch (e) {
    // If timeout or error, log but continue - this is best-effort
    console.log(`Warning: Could not confirm animations completed: ${e}`);
  }
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
    console.error(`Error checking page loading state: ${e}`);
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
  
  while (Date.now() - startTime < timeout) {
    if (!(await isPageLoading(page))) {
      // Wait a bit more to ensure stability
      await page.waitForTimeout(500);
      // Double-check it's still not loading
      if (!(await isPageLoading(page))) {
        return;
      }
    }
    
    await page.waitForTimeout(pollInterval);
  }
  
  throw new Error(`Page did not finish loading within ${timeout}ms`);
}

/**
 * Creates a structured logger for test steps
 */
export function createTestLogger(testTitle: string) {
  return {
    start: () => {
      console.log(`\n🔶 STARTING TEST: ${testTitle}`);
      console.log(`🕒 ${new Date().toISOString()}`);
      console.log('--------------------------------------------------');
    },
    
    step: (stepName: string) => {
      console.log(`\n📌 STEP: ${stepName}`);
    },
    
    info: (message: string) => {
      console.log(`  ℹ️ ${message}`);
    },
    
    warn: (message: string) => {
      console.log(`  ⚠️ WARNING: ${message}`);
    },
    
    error: (message: string, error?: Error) => {
      console.log(`  ❌ ERROR: ${message}`);
      if (error) {
        console.log(`  ${error.stack || error.message}`);
      }
    },
    
    success: (message: string) => {
      console.log(`  ✅ ${message}`);
    },
    
    end: (status: 'passed' | 'failed') => {
      console.log('--------------------------------------------------');
      console.log(`🏁 TEST ${status.toUpperCase()}: ${testTitle}`);
      console.log(`🕒 ${new Date().toISOString()}\n`);
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
  // Use the attachDebugArtifacts function from test-setup module
  await attachDebugArtifacts(page, testInfo, testInfo.title);
  
  // Additional trace handling if needed is automatically handled by Playwright
}

/**
 * Enhanced base class for Page Object Models
 */
export class BasePage {
  constructor(protected readonly page: Page) {}
  
  /**
   * Navigates to a page with retry logic and robust URL handling
   */
  async navigateTo(path: string, options?: { retries?: number; timeout?: number }): Promise<void> {
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
            console.log('Could not get baseURL from context, using default', e);
          }
        }
        
        // Construct full URL
        fullUrl = new URL(path, baseUrl).toString();
      }
      
      console.log(`Navigating to: ${fullUrl}`);
      await retryNavigation(this.page, fullUrl, options);
      await waitForNetworkIdle(this.page);
      await waitForPageLoaded(this.page);
    } catch (error) {
      console.error(`Navigation error for path "${path}": ${error}`);
      console.error(`Current page URL: ${this.page.url() || '(empty)'}`);
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
  async waitForElement(selector: string, options?: { state?: 'attached'|'detached'|'visible'|'hidden'; timeout?: number }): Promise<Locator> {
    const { state = 'visible', timeout = 10000 } = options || {};
    const locator = this.page.locator(selector);
    
    try {
      await locator.waitFor({ state, timeout });
      return locator;
    } catch (error) {
      // Enhanced error reporting on timeout
      console.error(`⚠️ Failed to find element: ${selector} (state: ${state})`);
      await captureDebugInfo(this.page, `wait-for-element-failed-${selector.replace(/\W+/g, '-')}`);
      throw error;
    }
  }
  
  /**
   * Captures current state for debugging
   */
  async captureState(context: string): Promise<void> {
    await captureDebugInfo(this.page, context);
  }
}