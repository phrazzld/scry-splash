import { type Page } from '@playwright/test';

/**
 * Capture comprehensive debug information about the current page state
 */
export async function captureDebugInfo(page: Page, context: string) {
  console.log(`\n=== DEBUG: ${context} ===`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
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
  const successMessages = await page.locator('text=Thank you').count();
  const errorMessages = await page.locator('text=error').count();
  
  console.log(`Element counts:
  - Email inputs: ${emailInputs}
  - Submit buttons: ${submitButtons}
  - Success messages: ${successMessages}
  - Error messages: ${errorMessages}`);
  
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
  
  // Take screenshot
  try {
    const screenshotPath = `test-results/debug-${context.replace(/\s+/g, '-')}-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);
  } catch (e) {
    console.log(`Failed to take screenshot: ${e}`);
  }
  
  console.log(`=== END DEBUG: ${context} ===\n`);
}

/**
 * Wait for network to become idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000) {
  console.log(`Waiting for network idle (timeout: ${timeout}ms)...`);
  try {
    await page.waitForLoadState('networkidle', { timeout });
    console.log('Network is idle');
  } catch (e) {
    console.log('Network did not become idle within timeout');
  }
}

/**
 * Set up console logging for a page
 */
export function setupConsoleLogging(page: Page) {
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[Browser ${type}] ${text}`);
  });
  
  page.on('pageerror', error => {
    console.log(`[Browser Error] ${error}`);
  });
}

/**
 * Track network requests
 */
export function setupNetworkLogging(page: Page) {
  const requests: any[] = [];
  
  page.on('request', request => {
    const url = request.url();
    const method = request.method();
    console.log(`[Network Request] ${method} ${url}`);
    requests.push({
      url,
      method,
      headers: request.headers(),
      timestamp: Date.now(),
    });
  });
  
  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    console.log(`[Network Response] ${status} ${url}`);
  });
  
  return requests;
}