/**
 * Environment-aware timeout configuration for E2E tests
 *
 * This module provides centralized timeout management that adapts to different
 * execution environments (local development vs CI) to ensure reliable test execution
 * while maintaining fast feedback loops in development.
 */

import { isRunningInCI } from "../utils/environment-detector";
import { getCurrentTestMode, TestMode } from "../utils/test-modes";

/**
 * Timeout configuration interface
 */
export interface TimeoutConfig {
  /** Timeout for waiting for elements to appear/be interactable */
  elementWait: number;

  /** Timeout for forms to be ready for interaction */
  formReady: number;

  /** Timeout for network activity to settle */
  networkIdle: number;

  /** Timeout for page navigation to complete */
  navigation: number;

  /** Timeout for API calls to complete */
  apiCall: number;

  /** Timeout for element visual stability */
  elementStability: number;
}

/**
 * Standard timeout operations for more granular control
 */
export enum TimeoutOperation {
  ElementWait = "elementWait",
  FormReady = "formReady",
  FormInteraction = "formReady", // Alias for form operations
  NetworkIdle = "networkIdle",
  Navigation = "navigation",
  ApiCall = "apiCall",
  ElementStability = "elementStability",
}

/**
 * Base timeout values in milliseconds
 * These are the baseline timeouts for local development
 */
const BASE_TIMEOUTS: TimeoutConfig = {
  elementWait: 10000, // 10 seconds
  formReady: 15000, // 15 seconds
  networkIdle: 20000, // 20 seconds
  navigation: 30000, // 30 seconds
  apiCall: 15000, // 15 seconds
  elementStability: 5000, // 5 seconds
};

/**
 * Environment-specific timeout multipliers
 */
const TIMEOUT_MULTIPLIERS = {
  local: 1.0,
  ci: 2.5, // 2.5x longer timeouts in standard CI
  ciLightweight: 2.0, // 2x longer for lightweight CI runs
  ciFull: 3.0, // 3x longer for comprehensive CI runs
};

/**
 * Maximum timeout bounds to prevent excessively long waits
 */
const MAX_TIMEOUTS: TimeoutConfig = {
  elementWait: 60000, // 1 minute max
  formReady: 90000, // 1.5 minutes max
  networkIdle: 120000, // 2 minutes max
  navigation: 120000, // 2 minutes max
  apiCall: 60000, // 1 minute max
  elementStability: 30000, // 30 seconds max
};

/**
 * Determine the appropriate timeout multiplier based on current environment
 */
function getTimeoutMultiplier(): number {
  if (!isRunningInCI()) {
    return TIMEOUT_MULTIPLIERS.local;
  }

  const testMode = getCurrentTestMode();

  switch (testMode) {
    case TestMode.CILightweight:
      return TIMEOUT_MULTIPLIERS.ciLightweight;

    case TestMode.CIFull:
      return TIMEOUT_MULTIPLIERS.ciFull;

    case TestMode.CIFunctional:
    case TestMode.CIVisual:
    default:
      return TIMEOUT_MULTIPLIERS.ci;
  }
}

/**
 * Calculate timeout for a specific operation with environment awareness
 *
 * @param operation The type of operation needing a timeout
 * @param customMultiplier Optional custom multiplier override
 * @returns Calculated timeout in milliseconds
 */
export function calculateTimeout(
  operation: TimeoutOperation,
  customMultiplier?: number,
): number {
  const baseTimeout = BASE_TIMEOUTS[operation];
  const multiplier = customMultiplier ?? getTimeoutMultiplier();
  const calculatedTimeout = Math.round(baseTimeout * multiplier);
  const maxTimeout = MAX_TIMEOUTS[operation];

  // Ensure we don't exceed maximum bounds
  return Math.min(calculatedTimeout, maxTimeout);
}

/**
 * Get complete timeout configuration for current environment
 *
 * @returns TimeoutConfig object with all timeouts calculated for current environment
 */
export function getEnvironmentTimeouts(): TimeoutConfig {
  const multiplier = getTimeoutMultiplier();

  const config: TimeoutConfig = {
    elementWait: calculateTimeout(TimeoutOperation.ElementWait, multiplier),
    formReady: calculateTimeout(TimeoutOperation.FormReady, multiplier),
    networkIdle: calculateTimeout(TimeoutOperation.NetworkIdle, multiplier),
    navigation: calculateTimeout(TimeoutOperation.Navigation, multiplier),
    apiCall: calculateTimeout(TimeoutOperation.ApiCall, multiplier),
    elementStability: calculateTimeout(
      TimeoutOperation.ElementStability,
      multiplier,
    ),
  };

  return config;
}

/**
 * Get timeout for a specific operation in current environment
 * Convenience function for common use cases
 *
 * @param operation The operation type
 * @returns Timeout in milliseconds
 */
export function getTimeout(operation: TimeoutOperation): number {
  return calculateTimeout(operation);
}

/**
 * Check if we're in a CI environment and should use extended timeouts
 *
 * @returns true if CI timeouts should be used
 */
export function shouldUseExtendedTimeouts(): boolean {
  return isRunningInCI();
}

/**
 * Get a timeout value with CI awareness for backward compatibility
 *
 * @param baseTimeout The base timeout value
 * @param ciMultiplier Optional CI multiplier (defaults to environment multiplier)
 * @returns Adjusted timeout value
 */
export function getAdjustedTimeout(
  baseTimeout: number,
  ciMultiplier?: number,
): number {
  if (!isRunningInCI()) {
    return baseTimeout;
  }

  const multiplier = ciMultiplier ?? getTimeoutMultiplier();
  const adjustedTimeout = Math.round(baseTimeout * multiplier);

  // Apply reasonable maximum (2 minutes for any individual operation)
  return Math.min(adjustedTimeout, 120000);
}

/**
 * Create a timeout configuration for specific test requirements
 *
 * @param overrides Specific timeout overrides
 * @returns Custom timeout configuration
 */
export function createCustomTimeoutConfig(
  overrides: Partial<TimeoutConfig>,
): TimeoutConfig {
  const baseConfig = getEnvironmentTimeouts();

  return {
    ...baseConfig,
    ...overrides,
  };
}

/**
 * Log current timeout configuration for debugging
 */
export function logTimeoutConfiguration(): void {
  const config = getEnvironmentTimeouts();
  const multiplier = getTimeoutMultiplier();
  const isCI = isRunningInCI();
  const mode = getCurrentTestMode();

  console.log("=== Timeout Configuration ===");
  console.log(`Environment: ${isCI ? "CI" : "Local"}`);
  console.log(`Test Mode: ${mode}`);
  console.log(`Multiplier: ${multiplier}x`);
  console.log("Timeouts:");

  Object.entries(config).forEach(([key, value]) => {
    const baseValue = BASE_TIMEOUTS[key as keyof TimeoutConfig];
    console.log(`  ${key}: ${value}ms (base: ${baseValue}ms)`);
  });

  console.log("==============================");
}
