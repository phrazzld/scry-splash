/**
 * Test Setup Module
 * 
 * Handles test environment preparation, debug directories, and CI configurations.
 * Sets up the testing environment for E2E tests and provides functions for
 * capturing test state and artifacts.
 * 
 * Dependencies:
 * - core.ts: For base utilities and type definitions
 * - debugArtifacts.ts: For artifact creation and management
 */
import { type Page, type TestInfo } from '@playwright/test';
import { debugLog } from './core';
import { 
  takeAndSaveScreenshot,
  saveHtmlContent,
  saveJsonData,
  logDirectoryListing,
  saveCustomArtifact
} from './debugArtifacts';

/**
 * Setup function to be called at the beginning of a test file
 * Ensures all necessary test directories exist
 */
export async function setupTestEnvironment(): Promise<void> {
  try {
    debugLog('Setting up test environment (global setup)', 'info');
    // Nothing to do here - proper environment initialization happens per-test
    // with the TestInfo object in each test via initializeDebugEnvironment
    debugLog('✅ Global test environment setup completed successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`❌ Error setting up test environment: ${errorMessage}`, 'error');
    throw error;
  }
}

/**
 * Captures the current state of the page for debugging
 * @param page Playwright page object
 * @param testInfo Playwright test info object
 * @param context Context identifier for the debug capture
 */
export async function capturePageState(page: Page, testInfo: TestInfo, context: string): Promise<void> {
  try {
    debugLog(`Capturing page state: ${context}`);
    
    // Take screenshot
    await takeAndSaveScreenshot(testInfo, page, `capture-${context}`);
    
    // Save HTML content
    const html = await page.content();
    await saveHtmlContent(testInfo, html, `page-${context}`);
    
    // Log current URL and page information
    debugLog(`Current URL: ${page.url()}`);
    
    // Save visible text
    try {
      const visibleText = await page.evaluate(() => document.body.innerText);
      debugLog(`Visible text length: ${visibleText.length} characters`);
      
      // Save long text contents to a file for better inspection
      if (visibleText.length > 500) {
        await saveCustomArtifact(
          testInfo,
          `visible-text-${context}`,
          visibleText,
          'txt'
        );
      }
    } catch (e) {
      debugLog(`Failed to get visible text: ${e}`, 'error');
    }
    
    debugLog(`Page state capture completed: ${context}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Error capturing page state for context "${context}": ${errorMessage}`, 'error');
  }
}

/**
 * Captures network logs and saves them to the test artifacts directory
 * @param testInfo Playwright test info object
 * @param data Network data to save
 * @param context Context identifier for the logs
 */
export async function saveNetworkLogs(
  testInfo: TestInfo,
  data: Record<string, any>,
  context: string
): Promise<string> {
  return saveJsonData(testInfo, data, `network-logs-${context}`);
}

/**
 * Sets up console logging for a page
 * @param page Playwright page object
 * @param testInfo Playwright test info object for storing logs
 * @returns Object with logs array and save function
 */
export function setupConsoleLogging(page: Page, testInfo: TestInfo): { 
  logs: string[]; 
  save: () => Promise<string>;
} {
  const logs: string[] = [];
  
  // Capture console logs
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const logEntry = `[${new Date().toISOString()}] [${type}] ${text}`;
    
    logs.push(logEntry);
    console.log(`[Browser ${type}] ${text}`);
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    const logEntry = `[${new Date().toISOString()}] [ERROR] ${error}`;
    logs.push(logEntry);
    console.log(`[Browser Error] ${error}`);
  });
  
  // Return object with logs array and save function
  return { 
    logs, 
    save: async () => {
      const content = logs.join('\n');
      return saveCustomArtifact(
        testInfo,
        'console-logs',
        content,
        'log'
      );
    }
  };
}

/**
 * Attaches debug artifacts to the test report
 * @param page Playwright page object
 * @param testInfo Playwright test info object
 * @param context Context identifier for the artifacts
 */
export async function attachDebugArtifacts(
  page: Page, 
  testInfo: TestInfo, 
  context: string
): Promise<void> {
  try {
    // Take screenshot
    await takeAndSaveScreenshot(testInfo, page, `${context}-final`);
    
    // Get and save HTML content
    const html = await page.content();
    await saveHtmlContent(testInfo, html, `${context}-final`);
    
    // Log directory contents for debugging
    await logDirectoryListing(testInfo, undefined, `${context}-final`);
    
    debugLog(`Debug artifacts attached for context "${context}"`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Error attaching debug artifacts for context "${context}": ${errorMessage}`, 'error');
  }
}