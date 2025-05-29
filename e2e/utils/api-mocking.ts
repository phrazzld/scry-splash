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
 */

import { type Page, type Route, type Request } from '@playwright/test';
import { FORMSPARK } from '../../lib/constants';

/**
 * Configuration options for FormSpark API mocking
 */
export interface FormSparkMockOptions {
  /** Whether the mock should simulate a successful response */
  success?: boolean;
  
  /** Custom error message for error responses */
  errorMessage?: string;
  
  /** HTTP status code for the response */
  statusCode?: number;
  
  /** Delay in milliseconds before responding */
  delay?: number;
  
  /** Enable detailed logging of mock interactions */
  enableLogging?: boolean;
}

/**
 * Default configuration for FormSpark mocks
 */
const DEFAULT_MOCK_OPTIONS: Required<FormSparkMockOptions> = {
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