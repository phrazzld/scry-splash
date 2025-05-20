/**
 * Test setup module for E2E tests
 * Handles test environment preparation, debug directories, and CI configurations
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import { type Page, type TestInfo } from '@playwright/test';

/**
 * Debug directory structure constants
 */
export const DEBUG_DIRS = {
  ROOT: '.debug',
  SCREENSHOTS: '.debug/screenshots',
  HTML_DUMPS: '.debug/html-dumps',
  NETWORK_LOGS: '.debug/network-logs',
  CONSOLE_LOGS: '.debug/console-logs',
  ARTIFACTS: '.debug/artifacts'
};

/**
 * Test results directory for Playwright
 */
export const TEST_RESULTS_DIR = 'test-results';

/**
 * Ensures a directory exists, creating it if necessary
 * @param dirPath Directory path to ensure
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`❌ Error creating directory ${dirPath}:`, error);
    throw error;
  }
}

/**
 * Creates all debug directories needed for tests
 */
export async function setupDebugDirectories(): Promise<void> {
  const allDirs = Object.values(DEBUG_DIRS);
  
  for (const dir of allDirs) {
    await ensureDirectoryExists(dir);
  }
  
  // Also ensure test-results directory exists for Playwright
  await ensureDirectoryExists(TEST_RESULTS_DIR);
  
  console.log('✅ Debug directories created successfully');
}

/**
 * Gets a path for a debug screenshot
 * @param context Context identifier for the screenshot
 * @returns Path where the screenshot should be saved
 */
export function getScreenshotPath(context: string): string {
  const sanitizedContext = context.replace(/\s+/g, '-').toLowerCase();
  const timestamp = Date.now();
  return path.join(DEBUG_DIRS.SCREENSHOTS, `debug-${sanitizedContext}-${timestamp}.png`);
}

/**
 * Gets a path for a HTML dump
 * @param context Context identifier for the HTML dump
 * @returns Path where the HTML dump should be saved
 */
export function getHtmlDumpPath(context: string): string {
  const sanitizedContext = context.replace(/\s+/g, '-').toLowerCase();
  const timestamp = Date.now();
  return path.join(DEBUG_DIRS.HTML_DUMPS, `html-dump-${sanitizedContext}-${timestamp}.html`);
}

/**
 * Gets a path for network logs
 * @param context Context identifier for the network logs
 * @returns Path where the network logs should be saved
 */
export function getNetworkLogPath(context: string): string {
  const sanitizedContext = context.replace(/\s+/g, '-').toLowerCase();
  const timestamp = Date.now();
  return path.join(DEBUG_DIRS.NETWORK_LOGS, `network-logs-${sanitizedContext}-${timestamp}.json`);
}

/**
 * Gets a path for console logs
 * @param context Context identifier for the console logs
 * @returns Path where the console logs should be saved
 */
export function getConsoleLogPath(context: string): string {
  const sanitizedContext = context.replace(/\s+/g, '-').toLowerCase();
  const timestamp = Date.now();
  return path.join(DEBUG_DIRS.CONSOLE_LOGS, `console-log-${sanitizedContext}-${timestamp}.txt`);
}

/**
 * Saves content to a file, ensuring the directory exists
 * @param filePath Path where to save the file
 * @param content Content to write to the file
 */
export async function saveToFile(filePath: string, content: string | Buffer): Promise<string> {
  try {
    // Ensure directory exists
    const directory = path.dirname(filePath);
    await ensureDirectoryExists(directory);
    
    // Write file
    await fs.writeFile(filePath, content);
    
    console.log(`✅ File saved: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error(`❌ Error saving file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Takes a screenshot and saves it to the debug directory
 * @param page Playwright page object
 * @param context Context identifier for the screenshot
 * @param options Screenshot options
 */
export async function saveScreenshot(
  page: Page, 
  context: string, 
  options: { fullPage?: boolean } = {}
): Promise<string> {
  try {
    const { fullPage = true } = options;
    const screenshotPath = getScreenshotPath(context);
    
    // Take screenshot
    const buffer = await page.screenshot({ fullPage });
    
    // Save to file
    return await saveToFile(screenshotPath, buffer);
  } catch (error) {
    console.error(`❌ Error taking screenshot for context "${context}":`, error);
    return '';
  }
}

/**
 * Saves HTML content to the debug directory
 * @param page Playwright page object
 * @param context Context identifier for the HTML dump
 */
export async function saveHtmlDump(page: Page, context: string): Promise<string> {
  try {
    const html = await page.content();
    const htmlPath = getHtmlDumpPath(context);
    
    // Save to file
    return await saveToFile(htmlPath, html);
  } catch (error) {
    console.error(`❌ Error saving HTML dump for context "${context}":`, error);
    return '';
  }
}

/**
 * Saves network logs to the debug directory
 * @param data Network data to save
 * @param context Context identifier for the network logs
 */
export async function saveNetworkLogs(data: Record<string, any>, context: string): Promise<string> {
  try {
    const networkLogPath = getNetworkLogPath(context);
    const jsonContent = JSON.stringify(data, null, 2);
    
    // Save to file
    return await saveToFile(networkLogPath, jsonContent);
  } catch (error) {
    console.error(`❌ Error saving network logs for context "${context}":`, error);
    return '';
  }
}

/**
 * Sets up console logging for a page and saves logs to a file
 * @param page Playwright page object
 * @param context Context identifier for the console logs
 */
export function setupConsoleLogging(page: Page, context: string): { logs: string[]; path: string } {
  const logs: string[] = [];
  const consoleLogPath = getConsoleLogPath(context);
  
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
  
  // Return object with logs array and path for later saving
  return { logs, path: consoleLogPath };
}

/**
 * Saves console logs to a file
 * @param logsData Console logs data from setupConsoleLogging
 */
export async function saveConsoleLogs(logsData: { logs: string[]; path: string }): Promise<string> {
  try {
    const { logs, path: logPath } = logsData;
    const content = logs.join('\n');
    
    // Save to file
    return await saveToFile(logPath, content);
  } catch (error) {
    console.error('❌ Error saving console logs:', error);
    return '';
  }
}

/**
 * Comprehensive page state capture function - captures everything for debugging
 * @param page Playwright page object
 * @param context Context identifier for all debug artifacts
 */
export async function capturePageState(page: Page, context: string): Promise<void> {
  try {
    // Ensure debug directories exist
    await setupDebugDirectories();
    
    console.log(`\n=== CAPTURING PAGE STATE: ${context} ===`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    
    // Take screenshot and save HTML
    await saveScreenshot(page, context);
    await saveHtmlDump(page, context);
    
    console.log(`Current URL: ${page.url()}`);
    
    // Save information about key elements
    try {
      const visibleText = await page.evaluate(() => document.body.innerText);
      console.log(`Visible text length: ${visibleText.length} characters`);
    } catch (e) {
      console.log(`Failed to get visible text: ${e}`);
    }
    
    console.log(`=== END CAPTURE: ${context} ===\n`);
  } catch (error) {
    console.error(`❌ Error capturing page state for context "${context}":`, error);
  }
}

/**
 * Setup function to be called at the beginning of a test file
 * Ensures all necessary directories exist and configures the test environment
 */
export async function setupTestEnvironment(): Promise<void> {
  try {
    // Create all debug directories
    await setupDebugDirectories();
    
    console.log('✅ Test environment set up successfully');
  } catch (error) {
    console.error('❌ Error setting up test environment:', error);
    throw error;
  }
}

/**
 * Attaches debug artifacts to test report
 * @param page Playwright page object
 * @param testInfo Playwright test info object
 * @param context Context identifier for the debug artifacts
 */
export async function attachDebugArtifacts(
  page: Page, 
  testInfo: TestInfo, 
  context: string
): Promise<void> {
  try {
    // Take screenshot
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await testInfo.attach(`${context}-screenshot.png`, { 
      body: screenshotBuffer, 
      contentType: 'image/png' 
    });
    
    // Get HTML content
    const html = await page.content();
    await testInfo.attach(`${context}-page.html`, {
      body: Buffer.from(html),
      contentType: 'text/html'
    });
    
    console.log(`✅ Debug artifacts attached to test report for context "${context}"`);
  } catch (error) {
    console.error(`❌ Error attaching debug artifacts for context "${context}":`, error);
  }
}