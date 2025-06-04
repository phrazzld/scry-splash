/**
 * Debug Artifacts Module
 *
 * Provides unified debug artifact management for E2E tests in both local and CI environments.
 * Leverages Playwright's built-in TestInfo mechanism for consistent path handling.
 *
 * Dependencies:
 * - core.ts: For base utilities and type definitions
 *
 * This module should NOT import from other utility modules to avoid circular dependencies.
 */

import { TestInfo } from "@playwright/test";
import fs from "fs/promises";
import path from "path";
import {
  ArtifactContentType,
  debugLog,
  ensureDirectoryExists,
  isDirectoryWritable,
  isRunningInCI,
} from "./core";

/**
 * Save custom artifact to the test output directory
 * @param testInfo Playwright TestInfo object
 * @param artifactName Name for the artifact (without extension)
 * @param content Content to save (string, Buffer or object)
 * @param extension File extension/type
 * @returns Promise resolving to the path where artifact was saved
 */
export async function saveCustomArtifact(
  testInfo: TestInfo,
  artifactName: string,
  content: string | Buffer | object,
  extension: ArtifactContentType,
): Promise<string> {
  try {
    const startTime = Date.now();
    const artifactPath = testInfo.outputPath(`${artifactName}.${extension}`);

    debugLog(`Saving ${extension} artifact: ${artifactPath}`);

    // Ensure parent directory exists
    await ensureDirectoryExists(path.dirname(artifactPath));

    // Format content appropriately
    let dataToWrite: string | Buffer;
    if (
      typeof content === "object" &&
      !(content instanceof Buffer) &&
      extension === "json"
    ) {
      dataToWrite = JSON.stringify(content, null, 2);
    } else if (typeof content === "string") {
      dataToWrite = content;
    } else if (content instanceof Buffer) {
      dataToWrite = content;
    } else {
      dataToWrite = String(content);
    }

    // Write file
    await fs.writeFile(artifactPath, dataToWrite);

    // Verify file was written
    const stats = await fs.stat(artifactPath);
    const elapsedMs = Date.now() - startTime;

    debugLog(
      `Artifact saved (${elapsedMs}ms, ${stats.size} bytes): ${artifactPath}`,
    );

    // Add to test attachments if running in Playwright Test
    if (testInfo.attachments) {
      let contentType = "text/plain";
      switch (extension) {
        case "html":
          contentType = "text/html";
          break;
        case "json":
          contentType = "application/json";
          break;
        case "log":
          contentType = "text/plain";
          break;
      }

      await testInfo.attach(`${artifactName}.${extension}`, {
        path: artifactPath,
        contentType,
      });
    }

    return artifactPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(
      `Failed to save artifact ${artifactName}.${extension}: ${errorMessage}`,
      "error",
    );
    throw error;
  }
}

/**
 * Create and ensure a custom subdirectory exists in the test output directory
 * @param testInfo Playwright TestInfo object
 * @param subDirName Name of the subdirectory
 * @returns Promise resolving to the path of the subdirectory
 */
export async function ensureAndGetCustomSubDir(
  testInfo: TestInfo,
  subDirName: string,
): Promise<string> {
  try {
    const subDirPath = testInfo.outputPath(subDirName);
    debugLog(`Ensuring custom subdirectory: ${subDirPath}`);

    await ensureDirectoryExists(subDirPath);

    // Perform explicit permission check
    const isWritable = await isDirectoryWritable(subDirPath);
    if (!isWritable) {
      throw new Error(`Subdirectory exists but is not writable: ${subDirPath}`);
    }

    return subDirPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(
      `Failed to create subdirectory ${subDirName}: ${errorMessage}`,
      "error",
    );
    throw error;
  }
}

/**
 * List contents of a directory, optionally recursively
 * @param dirPath Directory path to list
 * @param recursive Whether to list subdirectories recursively
 * @param indent Indentation level for pretty printing (used in recursive calls)
 * @returns Promise resolving to a formatted string with the directory listing
 */
export async function getDirectoryListing(
  dirPath: string,
  recursive: boolean = false,
  indent: string = "",
): Promise<string> {
  try {
    let result = `${indent}${path.basename(dirPath)}/\n`;

    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory() && recursive) {
        result += await getDirectoryListing(
          entryPath,
          recursive,
          `${indent}  `,
        );
      } else {
        let entryInfo = `${indent}  ${entry.name}`;

        try {
          const stats = await fs.stat(entryPath);
          entryInfo += ` (${stats.size} bytes)`;
        } catch (e) {
          // Ignore stat errors
        }

        result += `${entryInfo}\n`;
      }
    }

    return result;
  } catch (error) {
    return `${indent}Error listing directory: ${error instanceof Error ? error.message : String(error)}\n`;
  }
}

/**
 * Log a directory listing to console and optionally save to a file
 * @param testInfo Playwright TestInfo object or object with outputDir
 * @param relativeOrAbsolutePath Optional path relative to outputDir or absolute
 * @param description Optional description for the listing
 * @returns Promise resolving when listing is complete
 */
export async function logDirectoryListing(
  testInfo: TestInfo | { outputDir: string },
  relativeOrAbsolutePath?: string,
  description: string = "directory-listing",
): Promise<void> {
  try {
    const baseDir = testInfo.outputDir;

    // Determine the target directory path
    let targetDir: string;
    if (relativeOrAbsolutePath) {
      targetDir = path.isAbsolute(relativeOrAbsolutePath)
        ? relativeOrAbsolutePath
        : path.join(baseDir, relativeOrAbsolutePath);
    } else {
      targetDir = baseDir;
    }

    debugLog(`Listing directory contents for: ${targetDir} (${description})`);

    // Get the directory listing
    const listing = await getDirectoryListing(targetDir, true);

    // Log to console
    console.log(
      `\n=== DIRECTORY LISTING: ${description} ===\n${listing}\n=== END LISTING ===\n`,
    );

    // Save to file if we have TestInfo with attachment capability
    if ("attachments" in testInfo) {
      const listingFileName = `_directory_listing_${description.replace(/\W+/g, "-")}.log`;
      await saveCustomArtifact(testInfo, listingFileName, listing, "log");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Failed to list directory: ${errorMessage}`, "error");
  }
}

/**
 * Save HTML content from a page
 * @param testInfo Playwright TestInfo object
 * @param html HTML content to save
 * @param name Name for the artifact (without extension)
 * @returns Promise resolving to the path where HTML was saved
 */
export async function saveHtmlContent(
  testInfo: TestInfo,
  html: string,
  name: string,
): Promise<string> {
  return saveCustomArtifact(testInfo, name, html, "html");
}

/**
 * Save data as JSON
 * @param testInfo Playwright TestInfo object
 * @param data Data to save as JSON
 * @param name Name for the artifact (without extension)
 * @returns Promise resolving to the path where JSON was saved
 */
export async function saveJsonData(
  testInfo: TestInfo,
  data: object,
  name: string,
): Promise<string> {
  return saveCustomArtifact(testInfo, name, data, "json");
}

/**
 * Take and save a screenshot with proper error handling
 * @param testInfo Playwright TestInfo object
 * @param page Playwright Page object
 * @param name Name for the screenshot
 * @returns Promise resolving to the path where screenshot was saved
 */
export async function takeAndSaveScreenshot(
  testInfo: TestInfo,
  page: { screenshot: (options?: any) => Promise<Buffer> },
  name: string,
): Promise<string> {
  try {
    const screenshotPath = testInfo.outputPath(`${name}.png`);

    debugLog(`Taking screenshot: ${screenshotPath}`);

    // Ensure directory exists
    await ensureDirectoryExists(path.dirname(screenshotPath));

    // Take screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // Attach to test report
    await testInfo.attach(`${name}.png`, {
      path: screenshotPath,
      contentType: "image/png",
    });

    return screenshotPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(`Failed to take screenshot ${name}: ${errorMessage}`, "error");
    throw error;
  }
}

/**
 * Initialize the debug artifacts environment
 * Verifies key directories are available and logs system info
 * @param testInfo Playwright TestInfo object
 */
export async function initializeDebugEnvironment(
  testInfo: TestInfo,
): Promise<void> {
  try {
    debugLog("Initializing debug artifacts environment");

    // Log environment info
    debugLog(`Running in CI: ${isRunningInCI()}`);
    debugLog(`Test output directory: ${testInfo.outputDir}`);
    debugLog(`Node.js version: ${process.version}`);
    debugLog(`OS Platform: ${process.platform}`);

    // Verify base output directory exists and is writable
    await ensureDirectoryExists(testInfo.outputDir);

    // Create common subdirectories for artifacts
    await ensureAndGetCustomSubDir(testInfo, "screenshots");
    await ensureAndGetCustomSubDir(testInfo, "html-dumps");
    await ensureAndGetCustomSubDir(testInfo, "network-logs");
    await ensureAndGetCustomSubDir(testInfo, "console-logs");

    // Save environment info
    await saveJsonData(
      testInfo,
      {
        ci: isRunningInCI(),
        outputDir: testInfo.outputDir,
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
        testTitle: testInfo.title,
        testFile: testInfo.file,
      },
      "environment-info",
    );

    debugLog("Debug environment initialized successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    debugLog(
      `Failed to initialize debug environment: ${errorMessage}`,
      "error",
    );
    throw error;
  }
}
