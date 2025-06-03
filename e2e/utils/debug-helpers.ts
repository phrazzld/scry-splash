/**
 * Debug Helpers Module
 *
 * Provides utilities for debugging test failures and capturing detailed information
 * about the current state of the application under test.
 *
 * Dependencies:
 * - core.ts: For base utilities and type definitions
 * - debugArtifacts.ts: For artifact creation and management
 */

import { type Page, type TestInfo } from "@playwright/test";
import { debugLog, sleep } from "./core";
import {
  saveHtmlContent,
  saveJsonData,
  takeAndSaveScreenshot,
  logDirectoryListing,
} from "./debugArtifacts";

/**
 * Capture comprehensive debug information about the current page state
 * @param page Playwright page object
 * @param testInfo Playwright test info object
 * @param context Context identifier for the debug info
 */
export async function captureDebugInfo(
  page: Page,
  testInfo: TestInfo,
  context: string,
): Promise<void> {
  debugLog(`\n=== DEBUG: ${context} ===`);
  debugLog(`Timestamp: ${new Date().toISOString()}`);

  // Capture current URL
  const url = page.url();
  debugLog(`Current URL: ${url}`);

  // Capture key element information
  await captureElementInfo(page, testInfo, context);

  // Capture form state
  await captureFormState(page, testInfo, context);

  // Take screenshot and save HTML
  await takeAndSaveScreenshot(testInfo, page, `debug-${context}`);
  const html = await page.content();
  await saveHtmlContent(testInfo, html, `debug-${context}`);

  // Create a directory listing for debugging
  await logDirectoryListing(testInfo, undefined, `debug-${context}`);

  debugLog(`=== END DEBUG: ${context} ===\n`);
}

/**
 * Capture information about key elements on the page
 * @param page Playwright page object
 * @param testInfo Playwright test info object
 * @param context Context identifier for the information
 */
export async function captureElementInfo(
  page: Page,
  testInfo: TestInfo,
  context: string,
): Promise<void> {
  try {
    // Check for specific elements
    const emailInputs = await page.locator('input[type="email"]').count();
    const submitButtons = await page.locator('button[type="submit"]').count();
    const successMessagesText = await page.locator("text=Thank you").count();
    const errorMessagesText = await page.locator("text=error").count();

    // Check for data-testid elements
    const successMessagesId = await page
      .locator('[data-testid="cta-success-message"]')
      .count();
    const errorMessagesId = await page
      .locator('[data-testid="cta-error-message"]')
      .count();

    // Check visibility of messages by data-testid
    let successVisible = false;
    let errorVisible = false;

    try {
      successVisible = await page
        .locator('[data-testid="cta-success-message"]')
        .isVisible();
    } catch (e) {
      debugLog(`Error checking success message visibility: ${e}`, "error");
    }

    try {
      errorVisible = await page
        .locator('[data-testid="cta-error-message"]')
        .isVisible();
    } catch (e) {
      debugLog(`Error checking error message visibility: ${e}`, "error");
    }

    // Log element information
    const elementInfo = {
      timestamp: new Date().toISOString(),
      url: page.url(),
      elements: {
        emailInputs,
        submitButtons,
        successMessagesText,
        errorMessagesText,
        successMessagesId,
        successVisible,
        errorMessagesId,
        errorVisible,
      },
    };

    // Save as JSON for artifacts
    await saveJsonData(testInfo, elementInfo, `elements-${context}`);

    // Also log to console for immediate feedback
    debugLog(`Element counts:
    - Email inputs: ${emailInputs}
    - Submit buttons: ${submitButtons}
    - Success messages (by text): ${successMessagesText}
    - Error messages (by text): ${errorMessagesText}
    - Success messages (by data-testid): ${successMessagesId} (visible: ${successVisible})
    - Error messages (by data-testid): ${errorMessagesId} (visible: ${errorVisible})`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Error capturing element info: ${errorMessage}`, "error");
  }
}

/**
 * Capture form state information
 * @param page Playwright page object
 * @param testInfo Playwright test info object
 * @param context Context identifier for the information
 */
export async function captureFormState(
  page: Page,
  testInfo: TestInfo,
  context: string,
): Promise<void> {
  try {
    const formState = await page.evaluate(() => {
      const forms = document.querySelectorAll("form");
      return Array.from(forms).map((form, index) => {
        const inputs = form.querySelectorAll("input");
        const buttons = form.querySelectorAll("button");
        return {
          formIndex: index,
          action: form.action,
          method: form.method,
          inputs: Array.from(inputs).map((input) => ({
            type: input.type,
            name: input.name || "(no name)",
            value: input.value,
            disabled: input.disabled,
            required: input.required,
          })),
          buttons: Array.from(buttons).map((button) => ({
            type: button.type || "(no type)",
            text: button.textContent || "(no text)",
            disabled: button.disabled,
          })),
        };
      });
    });

    // Save form state as JSON
    if (formState && formState.length > 0) {
      await saveJsonData(
        testInfo,
        {
          timestamp: new Date().toISOString(),
          url: page.url(),
          forms: formState,
        },
        `form-state-${context}`,
      );

      debugLog(`Form state captured: ${formState.length} forms found`);
    } else {
      debugLog("No forms found on page");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Error capturing form state: ${errorMessage}`, "error");
  }
}

/**
 * Wait for network to become idle with improved error handling
 * @param page Playwright page object
 * @param timeout Timeout in milliseconds
 * @returns Promise that resolves when network is idle
 */
export async function waitForNetworkIdle(
  page: Page,
  timeout = 10000,
): Promise<void> {
  debugLog(`Waiting for network idle (timeout: ${timeout}ms)...`);

  // Start time logging for debugging
  const startTime = Date.now();

  try {
    // Wait for network idle with specified timeout
    await page.waitForLoadState("networkidle", { timeout });

    const elapsed = Date.now() - startTime;
    debugLog(`Network became idle after ${elapsed}ms`);

    // Add a small delay to ensure DOM updates are processed
    await sleep(500);
    debugLog("Added buffer time after network idle");
  } catch (error) {
    const elapsed = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(
      `Network did not become idle within timeout (elapsed: ${elapsed}ms): ${errorMessage}`,
      "warn",
    );
  }
}

/**
 * Set up enhanced network logging for a page
 * @param page Playwright page object
 * @param testInfo Playwright test info object
 * @returns Object with data and save function
 */
export function setupNetworkLogging(
  page: Page,
  testInfo: TestInfo,
): {
  data: Record<string, any>;
  save: () => Promise<string>;
} {
  const networkData: Record<string, any> = {
    requests: {},
    responses: {},
    timestamp: new Date().toISOString(),
  };

  // Track request counts by type
  const counts = {
    xhr: 0,
    fetch: 0,
    document: 0,
    script: 0,
    stylesheet: 0,
    image: 0,
    media: 0,
    font: 0,
    other: 0,
    total: 0,
  };

  page.on("request", (request) => {
    const url = request.url();
    const method = request.method();
    const resourceType = request.resourceType();

    // Update counts
    counts.total++;
    if (resourceType in counts) {
      counts[resourceType as keyof typeof counts]++;
    } else {
      counts.other++;
    }

    debugLog(`[Network Request] ${method} ${resourceType} ${url}`);

    const requestId = `${method}-${url}-${Date.now()}`;
    networkData.requests[requestId] = {
      url,
      method,
      resourceType,
      headers: request.headers(),
      postData: request.postData(),
      timestamp: Date.now(),
    };
  });

  page.on("response", async (response) => {
    const url = response.url();
    const status = response.status();

    debugLog(`[Network Response] ${status} ${url}`);

    const request = response.request();
    const method = request.method();
    const requestId = `${method}-${url}-${Date.now()}`;

    try {
      // Only capture response body for API requests to avoid excessive data
      let body = null;
      const contentType = response.headers()["content-type"] || "";

      if (
        (contentType.includes("json") || contentType.includes("text/plain")) &&
        !url.endsWith(".js") &&
        !url.endsWith(".css") &&
        !url.endsWith(".html")
      ) {
        try {
          body = await response.text();
        } catch (e) {
          body = `<Failed to get response body: ${e}>`;
        }
      }

      networkData.responses[requestId] = {
        url,
        status,
        headers: response.headers(),
        body,
        timestamp: Date.now(),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      debugLog(
        `Error processing response for ${url}: ${errorMessage}`,
        "error",
      );
    }
  });

  // Add counts to network data
  networkData.counts = counts;

  // Return object with network data and save function
  return {
    data: networkData,
    save: async () => {
      // Update final counts before saving
      networkData.counts = counts;
      networkData.duration = `${Date.now() - new Date(networkData.timestamp).getTime()}ms`;

      return saveJsonData(testInfo, networkData, "network-activity");
    },
  };
}

/**
 * Navigate to a page and ensure it's fully loaded before continuing
 * @param page Playwright page object
 * @param testInfo Playwright test info object
 * @param url URL to navigate to
 * @param options Navigation options
 */
export async function navigateAndWaitForLoad(
  page: Page,
  testInfo: TestInfo,
  url: string,
  options = { timeout: 60000 },
): Promise<void> {
  debugLog(`Navigating to ${url} with timeout ${options.timeout}ms...`);

  try {
    // Start navigation and wait for load event
    await page.goto(url, {
      waitUntil: "load",
      timeout: options.timeout,
    });

    // Additional waits to ensure page is fully interactive
    debugLog("Navigation completed, waiting for network idle...");
    await waitForNetworkIdle(page, options.timeout / 2);

    debugLog("Waiting for page to be fully interactive...");

    // Wait for key selectors that indicate the page is ready
    await page
      .waitForSelector("button", {
        state: "attached",
        timeout: options.timeout / 2,
      })
      .catch((e) => {
        debugLog(`No buttons found on page: ${e}`, "warn");
      });

    // Take a screenshot to verify page loaded correctly
    await takeAndSaveScreenshot(testInfo, page, "post-navigation");

    debugLog("Page fully loaded");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Navigation error: ${errorMessage}`, "error");

    // Capture debug info if possible
    try {
      await captureDebugInfo(page, testInfo, "navigation-error");
    } catch (e) {
      debugLog(
        `Failed to capture page state after navigation error: ${e}`,
        "error",
      );
    }

    throw error;
  }
}
