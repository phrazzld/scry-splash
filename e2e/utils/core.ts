/**
 * Core E2E Testing Utilities Module
 *
 * This module provides core types, interfaces, and universal utilities for E2E testing.
 * It serves as the foundation layer with NO dependencies on other utility modules.
 *
 * All other testing utility modules should depend on this module, but this module
 * should not depend on any other utility modules to prevent circular dependencies.
 */

import fs from "fs/promises";
import path from "path";
import type { TestInfo } from "@playwright/test";

/**
 * Supported content types for saving artifacts
 */
export type ArtifactContentType = "html" | "json" | "txt" | "log";

/**
 * Log levels for debug logging
 */
export type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * Common context type for test operations
 */
export interface TestContext {
  outputDir: string;
  testName?: string;
  testFile?: string;
}

/**
 * Check if running in CI environment
 * @returns true if running in CI, false otherwise
 */
export function isRunningInCI(): boolean {
  return !!process.env.CI;
}

/**
 * Environment-aware console logging with timestamp
 * @param message The message to log
 * @param level The log level
 */
export function debugLog(message: string, level: LogLevel = "info"): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [DEBUG ${level.toUpperCase()}]`;

  switch (level) {
    case "warn":
      console.warn(`${prefix} ${message}`);
      break;
    case "error":
      console.error(`${prefix} ${message}`);
      break;
    case "debug":
      if (process.env.DEBUG) {
        console.debug(`${prefix} ${message}`);
      }
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

/**
 * Check if a directory exists and is writable
 * @param dirPath Path to the directory to check
 * @returns Promise resolving to a boolean indicating if directory exists and is writable
 */
export async function isDirectoryWritable(dirPath: string): Promise<boolean> {
  try {
    await fs.access(dirPath, fs.constants.W_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create a directory if it doesn't exist
 * @param dirPath Path to the directory to create
 * @returns Promise resolving to the directory path
 */
export async function ensureDirectoryExists(dirPath: string): Promise<string> {
  try {
    const startTime = Date.now();
    debugLog(`Ensuring directory exists: ${dirPath}`);

    await fs.mkdir(dirPath, { recursive: true });

    // Verify directory was created and is writable
    const isWritable = await isDirectoryWritable(dirPath);
    if (!isWritable) {
      throw new Error(`Directory exists but is not writable: ${dirPath}`);
    }

    const elapsedMs = Date.now() - startTime;
    debugLog(`Directory ready (${elapsedMs}ms): ${dirPath}`);

    return dirPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(
      `Failed to ensure directory exists: ${dirPath}. Error: ${errorMessage}`,
      "error",
    );
    throw error;
  }
}

/**
 * Format an error into a string with stack trace if available
 * @param error The error to format
 * @returns Formatted error string
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ? error.stack : error.message;
  }
  return String(error);
}

/**
 * Convert TestInfo to TestContext (for functions that don't need full TestInfo)
 * @param testInfo Playwright TestInfo object or TestContext
 * @returns TestContext object
 */
export function toTestContext(testInfo: TestInfo | TestContext): TestContext {
  if ("outputDir" in testInfo) {
    return {
      outputDir: testInfo.outputDir,
      testName: "title" in testInfo ? testInfo.title : undefined,
      testFile: "file" in testInfo ? testInfo.file : undefined,
    };
  }
  return testInfo;
}

/**
 * Safely join paths, ensuring any directory portions exist
 * @param base Base directory
 * @param segments Path segments to join
 * @returns Promise resolving to the joined path
 */
export async function safeJoinPath(
  base: string,
  ...segments: string[]
): Promise<string> {
  const joinedPath = path.join(base, ...segments);
  const dir = path.dirname(joinedPath);
  await ensureDirectoryExists(dir);
  return joinedPath;
}

/**
 * Sleep for a specified number of milliseconds
 * @param ms Milliseconds to sleep
 * @returns Promise that resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async operation with backoff
 * @param operation Function to retry
 * @param options Retry options
 * @returns Promise resolving to the operation result
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    maxDelay?: number;
    backoff?: number;
    description?: string;
  } = {},
): Promise<T> {
  const {
    retries = 3,
    delay = 1000,
    maxDelay = 10000,
    backoff = 1.5,
    description = "operation",
  } = options;

  let lastError: Error | undefined;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      debugLog(`Attempting ${description} (${attempt}/${retries + 1})...`);
      const result = await operation();
      if (attempt > 1) {
        debugLog(`✓ ${description} succeeded after ${attempt - 1} retries`);
      }
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt <= retries) {
        debugLog(
          `Retry ${attempt}/${retries} for ${description}: ${lastError.message}`,
          "warn",
        );
        await sleep(currentDelay);
        // Increase delay with backoff for next attempt
        currentDelay = Math.min(currentDelay * backoff, maxDelay);
      } else {
        debugLog(
          `✗ ${description} failed after ${attempt - 1} retries: ${lastError.message}`,
          "error",
        );
      }
    }
  }

  throw lastError!;
}
