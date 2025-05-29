/**
 * API Mocking Utilities for E2E Tests
 * 
 * Provides reusable utilities for mocking external API responses in E2E tests.
 * Currently focused on FormSpark API but designed to be extensible for other APIs.
 * 
 * Key Features:
 * - Environment-aware URL construction matching production logic
 * - Configurable response scenarios (success, error, network failure)
 * - Request verification and logging
 * - Consistent with development philosophy: mock only external boundaries
 * 
 * ## Usage Guide
 * 
 * ### Basic Usage
 * ```typescript
 * // Mock successful submission
 * await mockFormSparkAPI(page, { success: true });
 * 
 * // Mock error response
 * await mockFormSparkAPI(page, { success: false, statusCode: 400 });
 * 
 * // Mock network failure
 * await mockFormSparkNetworkFailure(page);
 * ```
 * 
 * ### Verification
 * ```typescript
 * // Verify mock was called
 * const result = verifyMockWasCalled();
 * expect(result.wasCalled).toBe(true);
 * 
 * // Get comprehensive report
 * const report = await createMockVerificationReport(page);
 * expect(report.summary.success).toBe(true);
 * ```
 * 
 * ### Extending for Other APIs
 * ```typescript
 * // Use the same pattern for other external APIs:
 * // 1. Define mock options interface extending BaseMockOptions
 * // 2. Create mock setup function using page.route()
 * // 3. Add verification utilities
 * // 4. Create convenience functions for common scenarios
 * ```
 */

import { type Page, type Route, type Request } from '@playwright/test';
import { FORMSPARK } from '../../lib/constants';

/**
 * Base configuration for all API mocks
 */
export interface BaseMockOptions {
  /** Delay in milliseconds before responding */
  delay?: number;
  
  /** Enable detailed logging of mock interactions */
  enableLogging?: boolean;
}

/**
 * Common network failure scenarios
 * Using Playwright's valid error codes for route.abort()
 */
export enum NetworkFailureType {
  /** Connection refused/unreachable */
  CONNECTION_REFUSED = 'connectionrefused',
  
  /** Request timeout */
  TIMEOUT = 'timedout',
  
  /** DNS lookup failure */
  DNS_FAILURE = 'namenotresolved',
  
  /** Connection aborted */
  ABORTED = 'aborted'
}

/**
 * Configuration options for FormSpark API mocking
 */
export interface FormSparkMockOptions extends BaseMockOptions {
  /** Whether the mock should simulate a successful response */
  success?: boolean;
  
  /** Custom error message for error responses */
  errorMessage?: string;
  
  /** HTTP status code for the response */
  statusCode?: number;
  
  /** Simulate network failure instead of HTTP response */
  networkFailure?: NetworkFailureType;
}

/**
 * Default configuration for FormSpark mocks
 */
const DEFAULT_MOCK_OPTIONS: Omit<Required<FormSparkMockOptions>, 'networkFailure'> = {
  success: true,
  errorMessage: 'Submission failed',
  statusCode: 200,
  delay: 0,
  enableLogging: true
};

/**
 * Tracking state for mock verification
 */
interface MockState {
  callCount: number;
  lastRequestBody: any;
  lastRequestHeaders: Record<string, string>;
  mockSetup: boolean;
}

// Global mock state for verification
const mockState: MockState = {
  callCount: 0,
  lastRequestBody: null,
  lastRequestHeaders: {},
  mockSetup: false
};

/**
 * Get the FormSpark submit URL using the same logic as the application
 * This ensures mocks intercept the correct URL regardless of environment
 */
export function getFormSparkSubmitURL(): string {
  return FORMSPARK.SUBMIT_URL;
}

/**
 * Get FormSpark form ID from environment or fallback
 */
export function getFormSparkFormID(): string {
  return FORMSPARK.FORM_ID;
}

/**
 * Reset mock state for clean test isolation
 */
export function resetMockState(): void {
  mockState.callCount = 0;
  mockState.lastRequestBody = null;
  mockState.lastRequestHeaders = {};
  mockState.mockSetup = false;
}

/**
 * Set up FormSpark API mocking with configurable responses
 * 
 * @param page Playwright page instance
 * @param options Mock configuration options
 * @returns Promise that resolves when mock is set up
 * 
 * @example
 * ```typescript
 * // Mock successful submission
 * await mockFormSparkAPI(page, { success: true });
 * 
 * // Mock error response
 * await mockFormSparkAPI(page, { 
 *   success: false, 
 *   errorMessage: "Invalid email", 
 *   statusCode: 400 
 * });
 * ```
 */
export async function mockFormSparkAPI(
  page: Page, 
  options: FormSparkMockOptions = {}
): Promise<void> {
  const config = { ...DEFAULT_MOCK_OPTIONS, ...options };
  const submitURL = getFormSparkSubmitURL();
  
  if (config.enableLogging) {
    console.log(`[API Mock] Setting up FormSpark mock for URL: ${submitURL}`);
    console.log(`[API Mock] Mock config:`, { 
      success: config.success, 
      statusCode: config.statusCode,
      errorMessage: config.errorMessage 
    });
  }

  // Reset state for new mock setup
  resetMockState();
  mockState.mockSetup = true;

  await page.route(submitURL, async (route: Route) => {
    const request = route.request();
    
    // Track mock usage
    mockState.callCount++;
    
    // Capture request details for verification
    try {
      mockState.lastRequestBody = request.postDataJSON();
    } catch (e) {
      mockState.lastRequestBody = request.postData();
    }
    
    mockState.lastRequestHeaders = await request.allHeaders();
    
    if (config.enableLogging) {
      console.log(`[API Mock] Intercepted request #${mockState.callCount}`);
      console.log(`[API Mock] Request body:`, mockState.lastRequestBody);
      console.log(`[API Mock] Request headers:`, mockState.lastRequestHeaders);
    }

    // Apply delay if configured
    if (config.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, config.delay));
    }

    // Handle network failure scenarios
    if (config.networkFailure) {
      if (config.enableLogging) {
        console.log(`[API Mock] Simulating network failure: ${config.networkFailure}`);
      }
      await route.abort(config.networkFailure);
      return;
    }

    // Prepare response based on success/error configuration
    let responseBody: any;
    let statusCode: number;

    if (config.success) {
      statusCode = config.statusCode || 200;
      responseBody = { success: true };
    } else {
      statusCode = config.statusCode || 400;
      responseBody = { error: config.errorMessage };
    }

    if (config.enableLogging) {
      console.log(`[API Mock] Returning response:`, { statusCode, body: responseBody });
    }

    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(responseBody),
    });
  });

  if (config.enableLogging) {
    console.log(`[API Mock] FormSpark mock setup complete`);
  }
}

/**
 * Verify that the FormSpark API mock was called
 * 
 * @returns Object with mock verification details
 * 
 * @example
 * ```typescript
 * const verification = verifyMockWasCalled();
 * expect(verification.wasCalled).toBe(true);
 * expect(verification.callCount).toBe(1);
 * ```
 */
export function verifyMockWasCalled() {
  return {
    wasCalled: mockState.callCount > 0,
    callCount: mockState.callCount,
    lastRequestBody: mockState.lastRequestBody,
    lastRequestHeaders: mockState.lastRequestHeaders,
    mockWasSetup: mockState.mockSetup
  };
}

/**
 * Wait for mock to be called within a timeout period
 * 
 * @param timeoutMs Timeout in milliseconds
 * @returns Promise that resolves when mock is called or rejects on timeout
 */
export async function waitForMockCall(timeoutMs: number = 10000): Promise<void> {
  const startTime = Date.now();
  const initialCallCount = mockState.callCount;
  
  while (Date.now() - startTime < timeoutMs) {
    if (mockState.callCount > initialCallCount) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error(`Mock was not called within ${timeoutMs}ms timeout`);
}

/**
 * Verify that no real API calls were made by checking for any unintercepted requests
 * 
 * @param page Playwright page instance
 * @returns Promise that resolves to true if no real calls were made
 * 
 * @example
 * ```typescript
 * const noRealCalls = await verifyNoRealAPICalls(page);
 * expect(noRealCalls).toBe(true);
 * ```
 */
export async function verifyNoRealAPICalls(page: Page): Promise<boolean> {
  return new Promise((resolve) => {
    let realCallDetected = false;
    const submitURL = getFormSparkSubmitURL();
    
    // Set up a temporary listener to detect any unintercepted requests
    const requestHandler = (request: Request) => {
      if (request.url() === submitURL) {
        console.warn(`[API Mock] WARNING: Real API call detected to ${submitURL}`);
        realCallDetected = true;
      }
    };
    
    page.on('request', requestHandler);
    
    // Clean up listener after a short delay
    setTimeout(() => {
      page.off('request', requestHandler);
      resolve(!realCallDetected);
    }, 1000);
  });
}

/**
 * Create a comprehensive mock verification report
 * 
 * @param page Playwright page instance
 * @returns Promise that resolves to detailed verification report
 */
export async function createMockVerificationReport(page: Page) {
  const mockVerification = verifyMockWasCalled();
  const noRealCalls = await verifyNoRealAPICalls(page);
  
  return {
    mockVerification,
    noRealCalls,
    formSparkConfig: {
      submitURL: getFormSparkSubmitURL(),
      formID: getFormSparkFormID()
    },
    summary: {
      success: mockVerification.wasCalled && noRealCalls,
      issues: [
        ...(!mockVerification.wasCalled ? ['Mock was not called'] : []),
        ...(!noRealCalls ? ['Real API calls detected'] : [])
      ]
    }
  };
}

/**
 * Convenience function to mock FormSpark network failure
 * 
 * @param page Playwright page instance
 * @param failureType Type of network failure to simulate
 * @returns Promise that resolves when mock is set up
 * 
 * @example
 * ```typescript
 * // Simulate connection refused
 * await mockFormSparkNetworkFailure(page);
 * 
 * // Simulate timeout
 * await mockFormSparkNetworkFailure(page, NetworkFailureType.TIMEOUT);
 * ```
 */
export async function mockFormSparkNetworkFailure(
  page: Page,
  failureType: NetworkFailureType = NetworkFailureType.CONNECTION_REFUSED
): Promise<void> {
  return mockFormSparkAPI(page, {
    networkFailure: failureType,
    enableLogging: true
  });
}

/**
 * Convenience function to mock FormSpark timeout
 * 
 * @param page Playwright page instance
 * @param delay Delay before timeout in milliseconds
 * @returns Promise that resolves when mock is set up
 */
export async function mockFormSparkTimeout(
  page: Page,
  delay: number = 30000
): Promise<void> {
  return mockFormSparkAPI(page, {
    networkFailure: NetworkFailureType.TIMEOUT,
    delay,
    enableLogging: true
  });
}

/**
 * Convenience function to mock FormSpark rate limit response
 * 
 * @param page Playwright page instance
 * @returns Promise that resolves when mock is set up
 * 
 * @example
 * ```typescript
 * await mockFormSparkRateLimit(page);
 * // Returns 429 Too Many Requests with appropriate error message
 * ```
 */
export async function mockFormSparkRateLimit(page: Page): Promise<void> {
  return mockFormSparkAPI(page, {
    success: false,
    statusCode: 429,
    errorMessage: 'Too many requests. Please try again later.',
    enableLogging: true
  });
}

/**
 * Example: How to extend these utilities for another API
 * 
 * ```typescript
 * // 1. Define your API's mock options
 * interface StripeAPIMockOptions extends BaseMockOptions {
 *   success?: boolean;
 *   paymentStatus?: 'succeeded' | 'failed' | 'pending';
 *   errorCode?: string;
 * }
 * 
 * // 2. Create mock setup function
 * export async function mockStripeAPI(page: Page, options: StripeAPIMockOptions) {
 *   await page.route('https://api.stripe.com/**', async (route) => {
 *     // Implementation similar to mockFormSparkAPI
 *   });
 * }
 * 
 * // 3. Add convenience functions
 * export async function mockStripePaymentSuccess(page: Page) {
 *   return mockStripeAPI(page, { success: true, paymentStatus: 'succeeded' });
 * }
 * ```
 */