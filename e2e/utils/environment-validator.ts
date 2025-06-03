/**
 * Environment Validator
 *
 * Utility module to validate the test environment and ensure proper setup
 * before running E2E tests, with specific focus on CI environment validation.
 */

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { TestInfo } from "@playwright/test";

const execAsync = promisify(exec);

// Base artifact directories
export const ARTIFACTS_DIR = process.env.CI
  ? "test-results/e2e-artifacts"
  : path.join(process.cwd(), "test-results/e2e-artifacts");

export const REQUIRED_DIRS = [
  "test-results",
  ARTIFACTS_DIR,
  path.join(ARTIFACTS_DIR, "screenshots"),
  path.join(ARTIFACTS_DIR, "videos"),
  path.join(ARTIFACTS_DIR, "traces"),
  path.join(ARTIFACTS_DIR, "downloads"),
  "playwright-report",
];

/**
 * Environment validation result
 */
export interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  details: Record<string, unknown>;
}

/**
 * Validates the environment and returns the result
 */
export async function validateEnvironment(): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: [],
    details: {
      isCI: !!process.env.CI,
      nodeVersion: process.version,
      platform: process.platform,
      validatedAt: new Date().toISOString(),
    },
  };

  // Check directory structure
  await validateDirectories(result);

  // Check environment variables
  validateEnvironmentVariables(result);

  // Final determination
  result.success = result.errors.length === 0;

  return result;
}

/**
 * Validates all required directories exist and are writable
 */
async function validateDirectories(result: ValidationResult): Promise<void> {
  const directoryDetails: Record<
    string,
    { exists: boolean; writable: boolean }
  > = {};

  for (const dir of REQUIRED_DIRS) {
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        result.warnings.push(`Directory created: ${dir}`);
      }

      // Check if directory is writable
      const testFilePath = path.join(dir, ".write-test");
      fs.writeFileSync(testFilePath, "test");
      fs.unlinkSync(testFilePath);

      directoryDetails[dir] = { exists: true, writable: true };
    } catch (error) {
      result.errors.push(
        `Directory validation failed for "${dir}": ${(error as Error).message}`,
      );
      directoryDetails[dir] = {
        exists: fs.existsSync(dir),
        writable: false,
      };
    }
  }

  result.details.directories = directoryDetails;

  // Additional diagnostics in CI
  if (process.env.CI) {
    try {
      // Get directory permissions
      const { stdout: lsOutput } = await execAsync(`ls -la ${ARTIFACTS_DIR}`);
      result.details.directoryListing = lsOutput;
    } catch (error) {
      result.warnings.push(
        `Failed to get directory listing: ${(error as Error).message}`,
      );
    }
  }
}

/**
 * Validates required environment variables
 */
function validateEnvironmentVariables(result: ValidationResult): void {
  const envVars: Record<string, string | undefined> = {};

  // CI-specific required variables
  if (process.env.CI) {
    const requiredVars = ["NEXT_PUBLIC_FORMSPARK_FORM_ID"];

    for (const varName of requiredVars) {
      const value = process.env[varName];
      if (!value) {
        result.errors.push(`Missing required environment variable: ${varName}`);
      }
      // Store with value or "<missing>" for tracking
      envVars[varName] = value || "<missing>";
    }
  }

  // Optional variables that affect behavior
  const optionalVars = ["RUN_ALL_BROWSERS", "CI"];

  for (const varName of optionalVars) {
    envVars[varName] = process.env[varName];
  }

  result.details.environmentVariables = envVars;
}

/**
 * Performs environment validation at test start and attaches
 * the result to the test for debugging purposes
 */
export async function validateTestEnvironment(
  testInfo: TestInfo,
): Promise<void> {
  // Run validation
  const validationResult = await validateEnvironment();

  // Attach validation result to the test for debugging
  await testInfo.attach("environment-validation.json", {
    body: JSON.stringify(validationResult, null, 2),
    contentType: "application/json",
  });

  // If validation failed, fail the test
  if (!validationResult.success) {
    throw new Error(
      `Environment validation failed: ${validationResult.errors.join(", ")}`,
    );
  }
}

/**
 * Ensures artifact directory for a specific test exists
 */
export function ensureTestArtifactDirectory(testInfo: TestInfo): string {
  // Create a unique directory for this test's artifacts
  const testArtifactDir = path.join(
    ARTIFACTS_DIR,
    sanitizeFilename(testInfo.title),
  );

  // Ensure directory exists
  if (!fs.existsSync(testArtifactDir)) {
    fs.mkdirSync(testArtifactDir, { recursive: true });
  }

  return testArtifactDir;
}

/**
 * Sanitizes a filename to be safe for filesystem usage
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase();
}
