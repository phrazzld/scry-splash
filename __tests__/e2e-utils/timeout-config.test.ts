/**
 * Tests for environment-aware timeout configuration
 */

// Import the functions we're about to implement
import { 
  getEnvironmentTimeouts, 
  calculateTimeout,
  TimeoutOperation 
} from '../../e2e/config/timeout-config';

describe('Timeout Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('getEnvironmentTimeouts', () => {
    it('should return local timeouts for local environment', () => {
      // Arrange: Set up local environment by deleting CI variables
      delete process.env.CI;
      delete process.env.GITHUB_ACTIONS;
      delete process.env.TEST_MODE;

      // Act
      const timeouts = getEnvironmentTimeouts();

      // Assert
      expect(timeouts.elementWait).toBe(10000); // 10s for local
      expect(timeouts.formReady).toBe(15000); // 15s for local
      expect(timeouts.navigation).toBe(30000); // 30s for local
    });

    it('should return CI timeouts for CI environment', () => {
      // Arrange: Set up CI environment
      process.env.CI = 'true';
      process.env.GITHUB_ACTIONS = 'true';

      // Act
      const timeouts = getEnvironmentTimeouts();

      // Assert
      expect(timeouts.elementWait).toBe(25000); // 2.5x longer for CI
      expect(timeouts.formReady).toBe(37500); // 2.5x longer for CI
      expect(timeouts.navigation).toBe(75000); // 2.5x longer for CI
    });

    it('should handle different CI modes correctly', () => {
      // Arrange: Set up CI environment with specific mode
      process.env.CI = 'true';
      process.env.TEST_MODE = 'ci-full';

      // Act
      const timeouts = getEnvironmentTimeouts();

      // Assert: ci-full should use 3x multiplier
      expect(timeouts.elementWait).toBe(30000); // 3x longer for ci-full
      expect(timeouts.formReady).toBe(45000); // 3x longer for ci-full
    });

    it('should use lightweight timeouts for ci-lightweight mode', () => {
      // Arrange
      process.env.CI = 'true';
      process.env.TEST_MODE = 'ci-lightweight';

      // Act
      const timeouts = getEnvironmentTimeouts();

      // Assert: ci-lightweight should use 2x multiplier
      expect(timeouts.elementWait).toBe(20000); // 2x longer
      expect(timeouts.formReady).toBe(30000); // 2x longer
    });
  });

  describe('calculateTimeout', () => {
    it('should calculate timeout for specific operation in local environment', () => {
      // Arrange
      process.env.CI = undefined;

      // Act
      const timeout = calculateTimeout(TimeoutOperation.FormInteraction);

      // Assert
      expect(timeout).toBe(15000); // Base form interaction timeout
    });

    it('should calculate timeout for specific operation in CI environment', () => {
      // Arrange
      process.env.CI = 'true';

      // Act
      const timeout = calculateTimeout(TimeoutOperation.FormInteraction);

      // Assert
      expect(timeout).toBe(37500); // 2.5x longer in CI
    });

    it('should accept custom multipliers', () => {
      // Arrange
      process.env.CI = undefined;

      // Act
      const timeout = calculateTimeout(TimeoutOperation.ElementWait, 2.0);

      // Assert
      expect(timeout).toBe(20000); // 2x custom multiplier
    });

    it('should have reasonable upper bounds for timeouts', () => {
      // Arrange
      process.env.CI = 'true';
      process.env.TEST_MODE = 'ci-full';

      // Act
      const timeout = calculateTimeout(TimeoutOperation.Navigation);

      // Assert: Should not exceed 2 minutes for any operation
      expect(timeout).toBeLessThanOrEqual(120000);
    });
  });

  describe('TimeoutConfig interface', () => {
    it('should have all required timeout properties', () => {
      // Arrange
      process.env.CI = undefined;

      // Act
      const config = getEnvironmentTimeouts();

      // Assert: Verify all expected properties exist
      expect(config).toHaveProperty('elementWait');
      expect(config).toHaveProperty('formReady');
      expect(config).toHaveProperty('networkIdle');
      expect(config).toHaveProperty('navigation');
      expect(config).toHaveProperty('apiCall');
      expect(config).toHaveProperty('elementStability');

      // Verify all are numbers
      Object.values(config).forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });

    it('should have consistent timeout ordering', () => {
      // Arrange
      const config = getEnvironmentTimeouts();

      // Assert: Verify logical timeout ordering
      expect(config.elementStability).toBeLessThan(config.elementWait);
      expect(config.elementWait).toBeLessThan(config.formReady);
      expect(config.apiCall).toBeLessThan(config.navigation);
    });
  });

  describe('Environment detection edge cases', () => {
    it('should handle missing environment variables gracefully', () => {
      // Arrange: Clear all environment variables
      delete process.env.CI;
      delete process.env.GITHUB_ACTIONS;
      delete process.env.TEST_MODE;

      // Act & Assert: Should not throw
      expect(() => getEnvironmentTimeouts()).not.toThrow();
      
      const timeouts = getEnvironmentTimeouts();
      expect(timeouts).toBeDefined();
      expect(timeouts.elementWait).toBe(10000); // Should use local timeouts when no CI env vars
    });

    it('should handle invalid TEST_MODE values', () => {
      // Arrange
      process.env.CI = 'true';
      process.env.TEST_MODE = 'invalid-mode';

      // Act & Assert: Should fall back to default CI timeouts
      const timeouts = getEnvironmentTimeouts();
      expect(timeouts.elementWait).toBe(25000); // Default CI multiplier
    });

    it('should handle string boolean values correctly', () => {
      // Arrange: Test different CI string values  
      const testCases = ['true', '1'];
      
      testCases.forEach(ciValue => {
        // Clear other CI variables first
        delete process.env.GITHUB_ACTIONS;
        delete process.env.TEST_MODE;
        process.env.CI = ciValue;
        
        // Act
        const timeouts = getEnvironmentTimeouts();
        
        // Assert: Should recognize as CI environment (elementWait should be 25000 for CI)
        expect(timeouts.elementWait).toBe(25000);
      });
    });
  });
});