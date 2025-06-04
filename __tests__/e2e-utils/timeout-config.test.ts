/**
 * Tests for environment-aware timeout configuration
 */

// Import the functions we're about to implement
import {
  getEnvironmentTimeouts,
  calculateTimeout,
  TimeoutOperation,
} from "../../e2e/config/timeout-config";

// Mock the environment detector to ensure predictable test behavior
jest.mock("../../e2e/utils/environment-detector", () => ({
  isRunningInCI: jest.fn(),
}));

// Mock the test modes module
jest.mock("../../e2e/utils/test-modes", () => ({
  getCurrentTestMode: jest.fn(() => "functional"), // Default to functional mode
  TestMode: {
    CILightweight: "ci-lightweight",
    CIFull: "ci-full",
    CIFunctional: "ci-functional",
    CIVisual: "ci-visual",
  },
}));

import { isRunningInCI } from "../../e2e/utils/environment-detector";
import { getCurrentTestMode, TestMode } from "../../e2e/utils/test-modes";

// Type the mocked functions
const mockIsRunningInCI = isRunningInCI as jest.MockedFunction<
  typeof isRunningInCI
>;
const mockGetCurrentTestMode = getCurrentTestMode as jest.MockedFunction<
  typeof getCurrentTestMode
>;

describe("Timeout Configuration", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Default to local environment (not CI)
    mockIsRunningInCI.mockReturnValue(false);
    mockGetCurrentTestMode.mockReturnValue(TestMode.CIFunctional);
  });

  describe("getEnvironmentTimeouts", () => {
    it("should return local timeouts for local environment", () => {
      // Arrange: Mock local environment (not CI)
      mockIsRunningInCI.mockReturnValue(false);

      // Act
      const timeouts = getEnvironmentTimeouts();

      // Assert
      expect(timeouts.elementWait).toBe(10000); // 10s for local
      expect(timeouts.formReady).toBe(15000); // 15s for local
      expect(timeouts.navigation).toBe(30000); // 30s for local
    });

    it("should return CI timeouts for CI environment", () => {
      // Arrange: Mock CI environment with default mode
      mockIsRunningInCI.mockReturnValue(true);
      mockGetCurrentTestMode.mockReturnValue(TestMode.CIFunctional);

      // Act
      const timeouts = getEnvironmentTimeouts();

      // Assert
      expect(timeouts.elementWait).toBe(25000); // 2.5x longer for CI
      expect(timeouts.formReady).toBe(37500); // 2.5x longer for CI
      expect(timeouts.navigation).toBe(75000); // 2.5x longer for CI
    });

    it("should handle different CI modes correctly", () => {
      // Arrange: Mock CI environment with ci-full mode
      mockIsRunningInCI.mockReturnValue(true);
      mockGetCurrentTestMode.mockReturnValue(TestMode.CIFull);

      // Act
      const timeouts = getEnvironmentTimeouts();

      // Assert: ci-full should use 3x multiplier
      expect(timeouts.elementWait).toBe(30000); // 3x longer for ci-full
      expect(timeouts.formReady).toBe(45000); // 3x longer for ci-full
    });

    it("should use lightweight timeouts for ci-lightweight mode", () => {
      // Arrange: Mock CI environment with ci-lightweight mode
      mockIsRunningInCI.mockReturnValue(true);
      mockGetCurrentTestMode.mockReturnValue(TestMode.CILightweight);

      // Act
      const timeouts = getEnvironmentTimeouts();

      // Assert: ci-lightweight should use 2x multiplier
      expect(timeouts.elementWait).toBe(20000); // 2x longer
      expect(timeouts.formReady).toBe(30000); // 2x longer
    });
  });

  describe("calculateTimeout", () => {
    it("should calculate timeout for specific operation in local environment", () => {
      // Arrange: Mock local environment
      mockIsRunningInCI.mockReturnValue(false);

      // Act
      const timeout = calculateTimeout(TimeoutOperation.FormInteraction);

      // Assert
      expect(timeout).toBe(15000); // Base form interaction timeout
    });

    it("should calculate timeout for specific operation in CI environment", () => {
      // Arrange: Mock CI environment
      mockIsRunningInCI.mockReturnValue(true);
      mockGetCurrentTestMode.mockReturnValue(TestMode.CIFunctional);

      // Act
      const timeout = calculateTimeout(TimeoutOperation.FormInteraction);

      // Assert
      expect(timeout).toBe(37500); // 2.5x longer in CI
    });

    it("should accept custom multipliers", () => {
      // Arrange: Mock local environment
      mockIsRunningInCI.mockReturnValue(false);

      // Act
      const timeout = calculateTimeout(TimeoutOperation.ElementWait, 2.0);

      // Assert
      expect(timeout).toBe(20000); // 2x custom multiplier
    });

    it("should have reasonable upper bounds for timeouts", () => {
      // Arrange: Mock CI environment with ci-full mode
      mockIsRunningInCI.mockReturnValue(true);
      mockGetCurrentTestMode.mockReturnValue(TestMode.CIFull);

      // Act
      const timeout = calculateTimeout(TimeoutOperation.Navigation);

      // Assert: Should not exceed 2 minutes for any operation
      expect(timeout).toBeLessThanOrEqual(120000);
    });
  });

  describe("TimeoutConfig interface", () => {
    it("should have all required timeout properties", () => {
      // Arrange: Mock local environment
      mockIsRunningInCI.mockReturnValue(false);

      // Act
      const config = getEnvironmentTimeouts();

      // Assert: Verify all expected properties exist
      expect(config).toHaveProperty("elementWait");
      expect(config).toHaveProperty("formReady");
      expect(config).toHaveProperty("networkIdle");
      expect(config).toHaveProperty("navigation");
      expect(config).toHaveProperty("apiCall");
      expect(config).toHaveProperty("elementStability");

      // Verify all are numbers
      Object.values(config).forEach((value) => {
        expect(typeof value).toBe("number");
        expect(value).toBeGreaterThan(0);
      });
    });

    it("should have consistent timeout ordering", () => {
      // Arrange: Mock local environment
      mockIsRunningInCI.mockReturnValue(false);

      // Act
      const config = getEnvironmentTimeouts();

      // Assert: Verify logical timeout ordering
      expect(config.elementStability).toBeLessThan(config.elementWait);
      expect(config.elementWait).toBeLessThan(config.formReady);
      expect(config.apiCall).toBeLessThan(config.navigation);
    });
  });

  describe("Environment detection edge cases", () => {
    it("should handle local environment gracefully", () => {
      // Arrange: Mock local environment (not CI)
      mockIsRunningInCI.mockReturnValue(false);

      // Act & Assert: Should not throw
      expect(() => getEnvironmentTimeouts()).not.toThrow();

      const timeouts = getEnvironmentTimeouts();
      expect(timeouts).toBeDefined();
      expect(timeouts.elementWait).toBe(10000); // Should use local timeouts when not CI
    });

    it("should handle invalid TEST_MODE values", () => {
      // Arrange: Mock CI environment with invalid mode (falls back to default functional)
      mockIsRunningInCI.mockReturnValue(true);
      mockGetCurrentTestMode.mockReturnValue("invalid-mode" as any);

      // Act & Assert: Should fall back to default CI timeouts
      const timeouts = getEnvironmentTimeouts();
      expect(timeouts.elementWait).toBe(25000); // Default CI multiplier
    });

    it("should handle CI environment correctly", () => {
      // Arrange: Mock CI environment
      mockIsRunningInCI.mockReturnValue(true);
      mockGetCurrentTestMode.mockReturnValue(TestMode.CIFunctional);

      // Act
      const timeouts = getEnvironmentTimeouts();

      // Assert: Should recognize as CI environment (elementWait should be 25000 for CI)
      expect(timeouts.elementWait).toBe(25000);
    });
  });
});
