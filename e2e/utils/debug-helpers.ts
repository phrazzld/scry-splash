import { type Page } from '@playwright/test';
import { 
  setupDebugDirectories, 
  saveScreenshot, 
  saveHtmlDump, 
  capturePageState 
} from './test-setup';

/**
 * Capture comprehensive debug information about the current page state
 */
export async function captureDebugInfo(page: Page, context: string) {
  console.log(`\n=== DEBUG: ${context} ===`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  // Ensure debug directories exist
  await setupDebugDirectories();
  
  // Capture page URL
  const url = page.url();
  console.log(`Current URL: ${url}`);
  
  // Capture page content
  const html = await page.content();
  console.log(`Page HTML length: ${html.length} characters`);
  
  // Capture visible text
  try {
    const visibleText = await page.evaluate(() => document.body.innerText);
    console.log(`Visible text on page:\n${visibleText}\n`);
  } catch (e) {
    console.log(`Failed to get visible text: ${e}`);
  }
  
  // Check for specific elements
  const emailInputs = await page.locator('input[type="email"]').count();
  const submitButtons = await page.locator('button[type="submit"]').count();
  const successMessagesText = await page.locator('text=Thank you').count();
  const errorMessagesText = await page.locator('text=error').count();
  
  // Check for data-testid elements
  const successMessagesId = await page.locator('[data-testid="cta-success-message"]').count();
  const errorMessagesId = await page.locator('[data-testid="cta-error-message"]').count();
  
  // Check visibility of messages by data-testid
  let successVisible = false;
  let errorVisible = false;
  
  try {
    successVisible = await page.locator('[data-testid="cta-success-message"]').isVisible();
  } catch (e) {
    console.log(`Error checking success message visibility: ${e}`);
  }
  
  try {
    errorVisible = await page.locator('[data-testid="cta-error-message"]').isVisible();
  } catch (e) {
    console.log(`Error checking error message visibility: ${e}`);
  }
  
  console.log(`Element counts:
  - Email inputs: ${emailInputs}
  - Submit buttons: ${submitButtons}
  - Success messages (by text): ${successMessagesText}
  - Error messages (by text): ${errorMessagesText}
  - Success messages (by data-testid): ${successMessagesId} (visible: ${successVisible})
  - Error messages (by data-testid): ${errorMessagesId} (visible: ${errorVisible})`);
  
  // Capture form state
  try {
    const formState = await page.evaluate(() => {
      const forms = document.querySelectorAll('form');
      return Array.from(forms).map((form, index) => {
        const inputs = form.querySelectorAll('input');
        const buttons = form.querySelectorAll('button');
        return {
          formIndex: index,
          action: form.action,
          method: form.method,
          inputs: Array.from(inputs).map(input => ({
            type: input.type,
            name: input.name,
            value: input.value,
            disabled: input.disabled,
            required: input.required,
          })),
          buttons: Array.from(buttons).map(button => ({
            type: button.type,
            text: button.textContent,
            disabled: button.disabled,
          })),
        };
      });
    });
    console.log(`Form state: ${JSON.stringify(formState, null, 2)}`);
  } catch (e) {
    console.log(`Failed to get form state: ${e}`);
  }
  
  // Take screenshot using the test-setup module
  try {
    const screenshotPath = await saveScreenshot(page, context, { fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);
    
    // Save HTML dump using the test-setup module
    const htmlPath = await saveHtmlDump(page, context);
    console.log(`HTML dump saved: ${htmlPath}`);
  } catch (e) {
    console.log(`Failed to save debug artifacts: ${e}`);
  }
  
  console.log(`=== END DEBUG: ${context} ===\n`);
}

/**
 * Wait for network to become idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 10000) {
  console.log(`Waiting for network idle (timeout: ${timeout}ms)...`);
  
  // Start time logging for debugging
  const startTime = Date.now();
  
  try {
    // Wait for network idle with increased timeout
    await page.waitForLoadState('networkidle', { timeout });
    const elapsed = Date.now() - startTime;
    console.log(`Network became idle after ${elapsed}ms`);
    
    // Add a small delay to ensure DOM updates are processed
    await page.waitForTimeout(500);
    console.log('Added buffer time after network idle');
  } catch (e) {
    const elapsed = Date.now() - startTime;
    console.log(`Network did not become idle within timeout (elapsed: ${elapsed}ms)`);
    console.log(`Error details: ${e}`);
  }
}

/**
 * Set up console logging for a page
 */
export function setupConsoleLogging(page: Page) {
  // Create a logs array to store console messages
  const logs: string[] = [];
  
  // Set up console listeners
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const logEntry = `[${new Date().toISOString()}] [${type}] ${text}`;
    
    logs.push(logEntry);
    console.log(`[Browser ${type}] ${text}`);
  });
  
  page.on('pageerror', error => {
    const logEntry = `[${new Date().toISOString()}] [ERROR] ${error}`;
    logs.push(logEntry);
    console.log(`[Browser Error] ${error}`);
  });
  
  return logs;
}

/**
 * Track network requests
 */
export function setupNetworkLogging(page: Page) {
  const networkData: any = {
    requests: {},
    responses: {}
  };
  
  page.on('request', request => {
    const url = request.url();
    const method = request.method();
    console.log(`[Network Request] ${method} ${url}`);
    
    const requestId = `${method}-${url}-${Date.now()}`;
    networkData.requests[requestId] = {
      url,
      method,
      headers: request.headers(),
      timestamp: Date.now(),
    };
  });
  
  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    console.log(`[Network Response] ${status} ${url}`);
    
    const request = response.request();
    const method = request.method();
    const requestId = `${method}-${url}-${Date.now()}`;
    
    networkData.responses[requestId] = {
      url,
      status,
      headers: response.headers(),
      timestamp: Date.now()
    };
  });
  
  return networkData;
}

/**
 * Navigate to a page and ensure it's fully loaded before continuing
 * @param page The Playwright page object
 * @param url The URL to navigate to
 * @param options Options for navigation
 */
export async function navigateAndWaitForLoad(page: Page, url: string, options = { timeout: 60000 }) {
  console.log(`Navigating to ${url} with timeout ${options.timeout}ms...`);
  
  try {
    // Ensure debug directories exist before navigation
    await setupDebugDirectories();
    
    // Start navigation and wait for load event
    await page.goto(url, { 
      waitUntil: 'load',
      timeout: options.timeout
    });
    
    // Additional waits to ensure page is fully interactive
    console.log('Navigation completed, waiting for network idle...');
    await waitForNetworkIdle(page, options.timeout / 2);
    
    console.log('Waiting for page to be fully interactive...');
    // Wait for key selectors that indicate the page is ready
    await page.waitForSelector('button', { state: 'attached', timeout: options.timeout / 2 }).catch(e => {
      console.log(`No buttons found on page: ${e}`);
    });
    
    console.log('Page fully loaded');
  } catch (e) {
    console.error(`Navigation error: ${e}`);
    
    // Capture additional debugging info using the new capturePageState function
    await capturePageState(page, 'navigation-error');
    throw e;
  }
}