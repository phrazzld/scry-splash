import { defineConfig, devices } from "@playwright/test";
import { execSync } from "child_process";
import { getPlaywrightConfig } from "./e2e/config/ci-config";
import {
  applyTestModeEnvironment,
  getTestModeSummary,
} from "./e2e/utils/test-modes";

// Apply test mode environment variables
applyTestModeEnvironment();

// Get the current test mode and configuration
const testModeSummary = getTestModeSummary();

// Log the current test mode for debugging
console.log("Current test mode:", testModeSummary.mode);
console.log("Test mode description:", testModeSummary.description);

// Get base configuration from CI config
const baseConfig = getPlaywrightConfig();

// Central location for all test artifacts
const artifactsDir = baseConfig.outputDir;

// Ensure artifact directory exists
try {
  execSync(`mkdir -p ${artifactsDir}`);
} catch (error) {
  console.warn(`Warning: Failed to create artifacts directory: ${error}`);
}

// Validate the environment with fallback for CI
try {
  console.log("Validating environment before test execution...");
  // Run the validation script
  execSync("bash e2e/scripts/validate-environment.sh", { stdio: "inherit" });
  console.log("Environment validation complete.");
} catch (error) {
  console.warn("Environment validation had issues:", error);
  if (!testModeSummary.isCI) {
    console.error("Environment validation failed in local environment");
    throw error; // Only fail in local environment
  } else {
    console.warn("Continuing in CI environment despite validation issues");
    // In CI, we continue despite validation issues to allow the tests to run
  }
}

// Set up browser projects with proper filtering
const setupProjects = () => {
  // Get projects from base config
  const projects = baseConfig.projects.map((project) => {
    const browserName = project.name;
    return {
      name: browserName,
      use: {
        ...devices[
          `Desktop ${browserName.charAt(0).toUpperCase() + browserName.slice(1)}`
        ],
      },
      // Apply grep filters for test filtering
      grep: process.env.PLAYWRIGHT_TEST_GREP
        ? new RegExp(process.env.PLAYWRIGHT_TEST_GREP)
        : undefined,
      grepInvert: process.env.PLAYWRIGHT_TEST_GREP_INVERT
        ? new RegExp(process.env.PLAYWRIGHT_TEST_GREP_INVERT)
        : undefined,
    };
  });

  return projects;
};

export default defineConfig({
  // Test directory
  testDir: baseConfig.testDir,

  // Test execution
  fullyParallel: baseConfig.fullyParallel,
  forbidOnly: baseConfig.forbidOnly,
  retries: baseConfig.retries,
  workers: baseConfig.workers,

  // Reporting
  reporter: baseConfig.reporter,

  // Timeouts
  timeout: baseConfig.testTimeout,

  // Artifacts
  outputDir: baseConfig.outputDir,

  // Browser behavior
  use: {
    ...baseConfig.use,
    // Make sure baseURL is always set
    baseURL: baseConfig.use.baseURL || "http://localhost:3000",
  },

  // Screenshot comparison settings
  expect: baseConfig.expect,

  // Configure projects (browsers)
  projects: setupProjects(),

  // Web server configuration
  webServer: baseConfig.webServer,
});
