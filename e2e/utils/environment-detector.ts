/**
 * Environment Detector
 *
 * Advanced environment detection utilities to identify CI environments,
 * browser capabilities, system resources, and customize test behavior.
 *
 * This module extends beyond the basic isRunningInCI() check to provide
 * detailed information about the current execution environment.
 */

import os from "os";
import { execSync } from "child_process";

/**
 * CI provider types that can be detected
 */
export enum CIProvider {
  Unknown = "unknown",
  GitHubActions = "github-actions",
  CircleCI = "circle-ci",
  Jenkins = "jenkins",
  Travis = "travis",
  AzurePipelines = "azure-pipelines",
  Local = "local",
}

/**
 * Operating system types
 */
export enum OperatingSystem {
  Windows = "windows",
  MacOS = "macos",
  Linux = "linux",
  Other = "other",
}

/**
 * Browser types that may be running the tests
 */
export enum BrowserType {
  Chromium = "chromium",
  Firefox = "firefox",
  WebKit = "webkit",
  Unknown = "unknown",
}

/**
 * Detailed environment information
 */
export interface EnvironmentInfo {
  // CI information
  isCI: boolean;
  ciProvider: CIProvider;
  ciPipelineId?: string;
  ciJobId?: string;

  // System information
  os: OperatingSystem;
  hostname: string;
  cpuCores: number;
  totalMemory: number;
  freeMemory: number;
  nodeVersion: string;

  // Runtime information
  startTime: Date;
  runId: string;

  // Browser information (may be undefined in some contexts)
  browserType?: BrowserType;
  browserVersion?: string;

  // Additional CI-specific environment variables
  environmentVariables: Record<string, string>;
}

/**
 * Environment behavior configuration that can be adjusted based on the execution environment
 */
export interface EnvironmentConfig {
  // Artifact collection settings
  captureScreenshotsOnFailure: boolean;
  captureScreenshotsOnSuccess: boolean;
  screenshotQuality: "low" | "medium" | "high";
  captureVideos: boolean;

  // Debug information settings
  verboseLogging: boolean;
  captureNetworkTraffic: boolean;
  captureConsoleMessages: boolean;

  // Performance settings
  collectPerformanceMetrics: boolean;
  performanceMetricsInterval: number;

  // Test behavior settings
  retryFailedTests: boolean;
  maxRetries: number;
  testTimeout: number;

  // Filesystem settings
  artifactPath: string;
  useCompression: boolean;
}

// Default configuration for different environments
const DEFAULT_LOCAL_CONFIG: EnvironmentConfig = {
  captureScreenshotsOnFailure: true,
  captureScreenshotsOnSuccess: false,
  screenshotQuality: "high",
  captureVideos: false,
  verboseLogging: true,
  captureNetworkTraffic: true,
  captureConsoleMessages: true,
  collectPerformanceMetrics: false,
  performanceMetricsInterval: 5000,
  retryFailedTests: false,
  maxRetries: 0,
  testTimeout: 30000,
  artifactPath: "./test-results/e2e-artifacts",
  useCompression: false,
};

const DEFAULT_CI_CONFIG: EnvironmentConfig = {
  captureScreenshotsOnFailure: true,
  captureScreenshotsOnSuccess: true,
  screenshotQuality: "medium",
  captureVideos: true,
  verboseLogging: true,
  captureNetworkTraffic: true,
  captureConsoleMessages: true,
  collectPerformanceMetrics: true,
  performanceMetricsInterval: 1000,
  retryFailedTests: true,
  maxRetries: 2,
  testTimeout: 60000,
  artifactPath: "test-results/e2e-artifacts",
  useCompression: true,
};

// Singleton instance of environment info
let environmentInfo: EnvironmentInfo | null = null;

// Singleton instance of environment config
let environmentConfig: EnvironmentConfig | null = null;

/**
 * Detect if running in a CI environment
 * @returns true if running in a CI environment
 */
export function isRunningInCI(): boolean {
  return (
    process.env.CI === "true" ||
    process.env.CI === "1" ||
    !!process.env.GITHUB_ACTIONS
  );
}

/**
 * Detect the current CI provider
 * @returns The detected CI provider
 */
export function detectCIProvider(): CIProvider {
  if (!isRunningInCI()) {
    return CIProvider.Local;
  }

  // GitHub Actions
  if (process.env.GITHUB_ACTIONS) {
    return CIProvider.GitHubActions;
  }

  // CircleCI
  if (process.env.CIRCLECI) {
    return CIProvider.CircleCI;
  }

  // Jenkins
  if (process.env.JENKINS_URL) {
    return CIProvider.Jenkins;
  }

  // Travis CI
  if (process.env.TRAVIS) {
    return CIProvider.Travis;
  }

  // Azure Pipelines
  if (process.env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI) {
    return CIProvider.AzurePipelines;
  }

  return CIProvider.Unknown;
}

/**
 * Detect the current operating system
 * @returns The detected operating system
 */
export function detectOperatingSystem(): OperatingSystem {
  const platform = process.platform;

  if (platform === "win32") {
    return OperatingSystem.Windows;
  }

  if (platform === "darwin") {
    return OperatingSystem.MacOS;
  }

  if (platform === "linux") {
    return OperatingSystem.Linux;
  }

  return OperatingSystem.Other;
}

/**
 * Get system resource information
 * @returns Object containing system resource information
 */
export function getSystemResources() {
  return {
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpuCores: os.cpus().length,
    hostname: os.hostname(),
  };
}

/**
 * Get a unique run ID for the current test run
 * @returns A unique run ID
 */
export function generateRunId(): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `run-${timestamp}-${random}`;
}

/**
 * Get all relevant environment variables for debugging
 * @returns Record of environment variables
 */
export function getEnvironmentVariables(): Record<string, string> {
  const relevantVarNames = [
    // CI-related
    "CI",
    "GITHUB_ACTIONS",
    "GITHUB_WORKFLOW",
    "GITHUB_RUN_ID",
    "GITHUB_SHA",
    "CIRCLE_BRANCH",
    "CIRCLE_BUILD_NUM",
    "CIRCLE_JOB",
    "TRAVIS_BUILD_ID",
    "TRAVIS_JOB_ID",

    // Node-related
    "NODE_ENV",
    "NODE_PATH",
    "NODE_OPTIONS",

    // Playwright-related
    "PLAYWRIGHT_BROWSERS_PATH",
    "PWDEBUG",
    "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD",

    // Custom project variables
    "NEXT_PUBLIC_FORMSPARK_FORM_ID",
    "RUN_ALL_BROWSERS",
  ];

  const envVars: Record<string, string> = {};

  for (const varName of relevantVarNames) {
    const value = process.env[varName];
    if (value !== undefined) {
      envVars[varName] = value;
    }
  }

  return envVars;
}

/**
 * Get Node.js version information
 * @returns Node.js version string
 */
export function getNodeVersion(): string {
  return process.version;
}

/**
 * Get CI specific IDs (pipeline, job, etc.)
 * @returns Object containing CI specific IDs
 */
export function getCIIds() {
  const ciProvider = detectCIProvider();

  switch (ciProvider) {
    case CIProvider.GitHubActions:
      return {
        ciPipelineId: process.env.GITHUB_RUN_ID,
        ciJobId: process.env.GITHUB_JOB,
      };
    case CIProvider.CircleCI:
      return {
        ciPipelineId: process.env.CIRCLE_WORKFLOW_ID,
        ciJobId: process.env.CIRCLE_BUILD_NUM,
      };
    case CIProvider.Jenkins:
      return {
        ciPipelineId: process.env.BUILD_TAG,
        ciJobId: process.env.BUILD_NUMBER,
      };
    case CIProvider.Travis:
      return {
        ciPipelineId: process.env.TRAVIS_BUILD_ID,
        ciJobId: process.env.TRAVIS_JOB_ID,
      };
    case CIProvider.AzurePipelines:
      return {
        ciPipelineId: process.env.BUILD_BUILDID,
        ciJobId: process.env.SYSTEM_JOBID,
      };
    default:
      return {
        ciPipelineId: undefined,
        ciJobId: undefined,
      };
  }
}

/**
 * Generate full environment information
 * @returns Comprehensive environment information
 */
export function getEnvironmentInfo(): EnvironmentInfo {
  // Return cached info if available
  if (environmentInfo) {
    return environmentInfo;
  }

  const isCI = isRunningInCI();
  const ciProvider = detectCIProvider();
  const { ciPipelineId, ciJobId } = getCIIds();
  const os = detectOperatingSystem();
  const { cpuCores, freeMemory, totalMemory, hostname } = getSystemResources();
  const nodeVersion = getNodeVersion();
  const environmentVariables = getEnvironmentVariables();

  // Create and cache the environment info
  environmentInfo = {
    isCI,
    ciProvider,
    ciPipelineId,
    ciJobId,
    os,
    hostname,
    cpuCores,
    totalMemory,
    freeMemory,
    nodeVersion,
    startTime: new Date(),
    runId: generateRunId(),
    environmentVariables,
  };

  return environmentInfo;
}

/**
 * Update browser information in the environment info
 * This should be called once the browser context is available
 * @param browserType The detected browser type
 * @param browserVersion The browser version
 */
export function updateBrowserInfo(
  browserType: BrowserType,
  browserVersion: string,
): void {
  const info = getEnvironmentInfo();
  info.browserType = browserType;
  info.browserVersion = browserVersion;
}

/**
 * Get the appropriate environment configuration based on the current environment
 * @param overrides Optional configuration overrides
 * @returns Environment configuration
 */
export function getEnvironmentConfig(
  overrides?: Partial<EnvironmentConfig>,
): EnvironmentConfig {
  // Return cached config if available and no overrides
  if (environmentConfig && !overrides) {
    return environmentConfig;
  }

  const isCI = isRunningInCI();
  const baseConfig = isCI ? DEFAULT_CI_CONFIG : DEFAULT_LOCAL_CONFIG;

  // Apply any overrides
  const config = {
    ...baseConfig,
    ...overrides,
  };

  // Cache the config if no overrides
  if (!overrides) {
    environmentConfig = config;
  }

  return config;
}

/**
 * Helper: Detect if running in a headless browser
 * @returns True if running in a headless browser
 */
export function isRunningHeadless(): boolean {
  return (
    isRunningInCI() ||
    process.env.HEADLESS === "true" ||
    process.env.HEADLESS === "1"
  );
}

/**
 * Helper: Detect if we should run a heavier or lighter version of the tests
 * @returns True if we should run a lighter version of the tests
 */
export function shouldUseLightweightTests(): boolean {
  return isRunningInCI() && process.env.LIGHTWEIGHT_TESTS === "true";
}

/**
 * Print environment diagnosis information to the console
 * Useful for debugging environment issues
 */
export function printEnvironmentDiagnosis(): void {
  const env = getEnvironmentInfo();
  const config = getEnvironmentConfig();

  console.log("=== Environment Diagnosis ===");
  console.log(`Running in CI: ${env.isCI}`);
  console.log(`CI Provider: ${env.ciProvider}`);
  console.log(`OS: ${env.os}`);
  console.log(`Hostname: ${env.hostname}`);
  console.log(`CPU Cores: ${env.cpuCores}`);
  console.log(
    `Memory: ${Math.round(env.freeMemory / 1024 / 1024)}MB free / ${Math.round(env.totalMemory / 1024 / 1024)}MB total`,
  );
  console.log(`Node Version: ${env.nodeVersion}`);
  console.log(`Run ID: ${env.runId}`);
  console.log(`Start Time: ${env.startTime.toISOString()}`);

  if (env.browserType) {
    console.log(`Browser: ${env.browserType} ${env.browserVersion || ""}`);
  }

  console.log("\n=== Configuration ===");
  console.log(`Screenshots on failure: ${config.captureScreenshotsOnFailure}`);
  console.log(`Screenshots on success: ${config.captureScreenshotsOnSuccess}`);
  console.log(`Screenshot quality: ${config.screenshotQuality}`);
  console.log(`Capture videos: ${config.captureVideos}`);
  console.log(`Verbose logging: ${config.verboseLogging}`);
  console.log(`Performance metrics: ${config.collectPerformanceMetrics}`);
  console.log(
    `Retry failed tests: ${config.retryFailedTests} (max: ${config.maxRetries})`,
  );
  console.log(`Test timeout: ${config.testTimeout}ms`);
  console.log(`Artifact path: ${config.artifactPath}`);

  console.log("\n=== Environment Variables ===");
  for (const [key, value] of Object.entries(env.environmentVariables)) {
    console.log(`${key}: ${value}`);
  }

  console.log("\n=== Disk Space ===");
  try {
    const diskInfo = execSync("df -h").toString();
    console.log(diskInfo);
  } catch (error) {
    console.log("Unable to get disk space information");
  }
}
