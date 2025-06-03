/**
 * Test Modes
 *
 * Defines the available test modes and their configurations.
 * This module provides the central configuration for different testing environments,
 * allowing tests to adapt their behavior based on the selected mode.
 *
 * Usage:
 * - Import the getCurrentTestMode() function to get the current test mode
 * - Import the getTestModeConfig() function to get the configuration for the current mode
 * - Use the isInMode() function to check if a specific mode is active
 */

import {
  BrowserType,
  detectOperatingSystem,
  isRunningInCI,
} from "./environment-detector";
import { TestTag } from "./test-segmentation";

/**
 * Available test modes
 */
export enum TestMode {
  // Local development with full testing capabilities
  LocalDevelopment = "local-development",

  // CI mode focused on functional tests (skips visual tests)
  CIFunctional = "ci-functional",

  // CI mode for visual testing (only runs visual tests)
  CIVisual = "ci-visual",

  // Complete test suite in CI environment
  CIFull = "ci-full",

  // Minimal test suite for quick CI verification
  CILightweight = "ci-lightweight",
}

/**
 * Configuration for a test mode
 */
export interface TestModeConfig {
  // Mode identification
  mode: TestMode;
  description: string;

  // Test selection
  includeTags: TestTag[];
  excludeTags: TestTag[];

  // Retry strategy
  retries: number;

  // Artifact collection
  captureScreenshotsOnFailure: boolean;
  captureScreenshotsOnSuccess: boolean;
  captureVideos: boolean;
  captureTraces: boolean | string;

  // Performance settings
  performanceThresholdMultiplier: number;

  // Browser settings
  browsers: BrowserType[];

  // Timeouts
  testTimeout: number;
  actionTimeout: number;
  navigationTimeout: number;

  // Visual testing settings
  visualTestingEnabled: boolean;
  visualTestUpdateMode?: "all" | "missing" | "on-failure";
  visualTestThreshold: number;

  // Debug settings
  verboseLogging: boolean;

  // Environment variables to set
  environmentVariables: Record<string, string>;
}

/**
 * Default configuration used as a base for all modes
 */
const defaultConfig: TestModeConfig = {
  mode: TestMode.LocalDevelopment,
  description: "Default configuration",
  includeTags: [],
  excludeTags: [],
  retries: 0,
  captureScreenshotsOnFailure: true,
  captureScreenshotsOnSuccess: false,
  captureVideos: false,
  captureTraces: "on-first-retry",
  performanceThresholdMultiplier: 1.0,
  browsers: [BrowserType.Chromium],
  testTimeout: 30000,
  actionTimeout: 15000,
  navigationTimeout: 30000,
  visualTestingEnabled: true,
  visualTestThreshold: 0.2,
  verboseLogging: true,
  environmentVariables: {},
};

/**
 * Configuration for local development mode
 */
const localDevelopmentConfig: TestModeConfig = {
  ...defaultConfig,
  mode: TestMode.LocalDevelopment,
  description: "Local development with full testing capabilities",
  retries: 0,
  captureScreenshotsOnFailure: true,
  captureScreenshotsOnSuccess: false,
  captureVideos: false,
  captureTraces: "on-first-retry",
  visualTestingEnabled: true,
  visualTestThreshold: 0.2,
  verboseLogging: true,
  environmentVariables: {
    VISUAL_TESTS_ENABLED_IN_CI: "0", // Not needed in local
  },
};

/**
 * Configuration for CI functional tests mode
 */
const ciFunctionalConfig: TestModeConfig = {
  ...defaultConfig,
  mode: TestMode.CIFunctional,
  description: "CI mode focused on functional tests (skips visual tests)",
  includeTags: [],
  excludeTags: [TestTag.Visual],
  retries: 1,
  captureScreenshotsOnFailure: true,
  captureScreenshotsOnSuccess: false,
  captureVideos: true,
  captureTraces: "on",
  performanceThresholdMultiplier: 1.5, // Higher threshold in CI
  browsers: [BrowserType.Chromium],
  testTimeout: 60000, // Longer timeouts in CI
  actionTimeout: 30000,
  navigationTimeout: 60000,
  visualTestingEnabled: false,
  verboseLogging: true,
  environmentVariables: {
    VISUAL_TESTS_ENABLED_IN_CI: "0",
    PLAYWRIGHT_TEST_GREP_INVERT: "@visual",
  },
};

/**
 * Configuration for CI visual tests mode
 */
const ciVisualConfig: TestModeConfig = {
  ...defaultConfig,
  mode: TestMode.CIVisual,
  description: "CI mode for visual testing (only runs visual tests)",
  includeTags: [TestTag.Visual],
  excludeTags: [],
  retries: 1,
  captureScreenshotsOnFailure: true,
  captureScreenshotsOnSuccess: true,
  captureVideos: true,
  captureTraces: "on",
  performanceThresholdMultiplier: 1.5,
  browsers: [BrowserType.Chromium],
  testTimeout: 60000,
  actionTimeout: 30000,
  navigationTimeout: 60000,
  visualTestingEnabled: true,
  visualTestUpdateMode: "missing",
  visualTestThreshold: 0.35, // Higher threshold for CI
  verboseLogging: true,
  environmentVariables: {
    VISUAL_TESTS_ENABLED_IN_CI: "1",
    PLAYWRIGHT_TEST_GREP: "@visual",
    PLAYWRIGHT_UPDATE_SNAPSHOTS: "missing",
  },
};

/**
 * Configuration for CI full tests mode
 */
const ciFullConfig: TestModeConfig = {
  ...defaultConfig,
  mode: TestMode.CIFull,
  description: "Complete test suite in CI environment",
  includeTags: [],
  excludeTags: [],
  retries: 2,
  captureScreenshotsOnFailure: true,
  captureScreenshotsOnSuccess: false,
  captureVideos: true,
  captureTraces: "on",
  performanceThresholdMultiplier: 1.5,
  browsers: [BrowserType.Chromium, BrowserType.Firefox, BrowserType.WebKit],
  testTimeout: 60000,
  actionTimeout: 30000,
  navigationTimeout: 60000,
  visualTestingEnabled: true,
  visualTestUpdateMode: "missing",
  visualTestThreshold: 0.35,
  verboseLogging: true,
  environmentVariables: {
    VISUAL_TESTS_ENABLED_IN_CI: "1",
    RUN_ALL_BROWSERS: "1",
  },
};

/**
 * Configuration for CI lightweight tests mode
 */
const ciLightweightConfig: TestModeConfig = {
  ...defaultConfig,
  mode: TestMode.CILightweight,
  description: "Minimal test suite for quick CI verification",
  includeTags: [TestTag.Functional],
  excludeTags: [TestTag.Visual, TestTag.Performance],
  retries: 1,
  captureScreenshotsOnFailure: true,
  captureScreenshotsOnSuccess: false,
  captureVideos: false,
  captureTraces: "on-first-retry",
  performanceThresholdMultiplier: 2.0, // Much higher threshold for lightweight mode
  browsers: [BrowserType.Chromium],
  testTimeout: 45000,
  actionTimeout: 20000,
  navigationTimeout: 45000,
  visualTestingEnabled: false,
  verboseLogging: false, // Reduced logging in lightweight mode
  environmentVariables: {
    VISUAL_TESTS_ENABLED_IN_CI: "0",
    PLAYWRIGHT_TEST_GREP: "@functional",
    PLAYWRIGHT_TEST_GREP_INVERT: "@visual\\|@performance",
    LIGHTWEIGHT_TESTS: "true",
  },
};

/**
 * Map of all available test modes
 */
const TEST_MODE_CONFIGS: Record<TestMode, TestModeConfig> = {
  [TestMode.LocalDevelopment]: localDevelopmentConfig,
  [TestMode.CIFunctional]: ciFunctionalConfig,
  [TestMode.CIVisual]: ciVisualConfig,
  [TestMode.CIFull]: ciFullConfig,
  [TestMode.CILightweight]: ciLightweightConfig,
};

/**
 * Gets the current test mode based on environment and settings
 *
 * Selection logic:
 * 1. Use TEST_MODE environment variable if set
 * 2. In CI, use CIFunctional as default mode
 * 3. In local, use LocalDevelopment as default mode
 *
 * @returns The current test mode
 */
export function getCurrentTestMode(): TestMode {
  // First, check for explicitly set mode via environment variable
  const explicitMode = process.env.TEST_MODE as TestMode;
  if (explicitMode && Object.values(TestMode).includes(explicitMode)) {
    return explicitMode;
  }

  // Check if we're in CI
  if (isRunningInCI()) {
    // Check for visual-only testing
    if (
      process.env.PLAYWRIGHT_TEST_GREP === "@visual" ||
      process.env.VISUAL_TESTS_ENABLED_IN_CI === "1"
    ) {
      return TestMode.CIVisual;
    }

    // Check for lightweight testing
    if (process.env.LIGHTWEIGHT_TESTS === "true") {
      return TestMode.CILightweight;
    }

    // Check for full testing
    if (process.env.RUN_ALL_BROWSERS === "1") {
      return TestMode.CIFull;
    }

    // Default CI mode
    return TestMode.CIFunctional;
  }

  // Default to local development mode
  return TestMode.LocalDevelopment;
}

/**
 * Gets the configuration for the current test mode
 * @returns Configuration for the current test mode
 */
export function getTestModeConfig(): TestModeConfig {
  const mode = getCurrentTestMode();
  return TEST_MODE_CONFIGS[mode];
}

/**
 * Gets configuration for a specific test mode
 * @param mode The test mode to get configuration for
 * @returns Configuration for the specified test mode
 */
export function getConfigForMode(mode: TestMode): TestModeConfig {
  return TEST_MODE_CONFIGS[mode];
}

/**
 * Checks if a specific test mode is active
 * @param mode The test mode to check
 * @returns True if the specified mode is active
 */
export function isInMode(mode: TestMode): boolean {
  return getCurrentTestMode() === mode;
}

/**
 * Checks if the current mode is a CI mode
 * @returns True if the current mode is a CI mode
 */
export function isInCIMode(): boolean {
  const mode = getCurrentTestMode();
  return (
    mode === TestMode.CIFunctional ||
    mode === TestMode.CIVisual ||
    mode === TestMode.CIFull ||
    mode === TestMode.CILightweight
  );
}

/**
 * Applies the environment variables from the current test mode configuration
 * This can be called in setup scripts to ensure the correct environment is set
 */
export function applyTestModeEnvironment(): void {
  const config = getTestModeConfig();

  // Apply environment variables from the config
  Object.entries(config.environmentVariables).forEach(([key, value]) => {
    process.env[key] = value;
  });

  // Set an environment variable to indicate the current test mode
  process.env.TEST_MODE = config.mode;

  // Apply other key settings as environment variables for tools that need them
  process.env.PLAYWRIGHT_RETRIES = config.retries.toString();
  process.env.PLAYWRIGHT_TIMEOUT = config.testTimeout.toString();
  process.env.PLAYWRIGHT_ACTION_TIMEOUT = config.actionTimeout.toString();
  process.env.PLAYWRIGHT_NAVIGATION_TIMEOUT =
    config.navigationTimeout.toString();
}

/**
 * Gets a detailed summary of the current test mode configuration
 * Useful for logging and debugging
 *
 * @returns Object with detailed information about the current test mode
 */
export function getTestModeSummary() {
  const mode = getCurrentTestMode();
  const config = getTestModeConfig();
  const os = detectOperatingSystem();

  return {
    mode,
    description: config.description,
    isCI: isRunningInCI(),
    os,
    browsers: config.browsers,
    visualTesting: config.visualTestingEnabled ? "enabled" : "disabled",
    retries: config.retries,
    timeouts: {
      test: config.testTimeout,
      action: config.actionTimeout,
      navigation: config.navigationTimeout,
    },
    includeTags: config.includeTags,
    excludeTags: config.excludeTags,
    environmentVariables: config.environmentVariables,
  };
}
