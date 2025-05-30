# CI Fix Tasks

## Visual Testing Tasks

 - [x] 1. **ci-visual-001:** Generate and commit Linux-specific snapshots for CI
   - Priority: High
   - Use the generate-linux-snapshots.yml workflow to create Linux-specific snapshot files
   - Commit the generated snapshot files to the repository
   - Ensure proper file paths: e.g., `splash-page-responsive-tablet-linux-ci-chromium-linux.png`

- [x] 2. **ci-visual-002:** ✅ Update visual test configuration to completely disable visual tests in CI until snapshots are generated
   - Priority: High
   - Implement a conditional skip for visual tests when running in CI environment
   - Add a environment variable flag to explicitly enable visual tests in CI when needed

 - [x] 3. **ci-visual-003:** Fix environment variable handling in visual-testing.ts
   - Priority: Medium
   - Ensure the `PLAYWRIGHT_UPDATE_SNAPSHOTS` environment variable is properly set
   - Update the code to handle 'on-failure', 'missing', and 'all' modes

 - [x] 4. **ci-visual-004:** Create separate test groups for visual tests
   - Priority: Medium
   - Separate visual tests from functional tests
   - Add tags like `@visual` to make them easier to exclude in CI

## Browser Installation Tasks

 - [x] 5. **ci-browser-001:** Add explicit verification step for Chromium installation
   - Priority: Medium
   - Add a dedicated verification step after browser installation
   - Report detailed diagnostic information about the Playwright browsers

 - [x] 6. **ci-browser-002:** Create fallback browser installation mechanism
   - Priority: Low
   - Implement a retry mechanism for browser installation
   - Add explicit verification steps after each installation attempt

## General CI Improvements

 - [x] 7. **ci-general-001:** Set up specific CI testing mode
   - Priority: Medium
   - Create a dedicated CI testing configuration
   - Allow tests to adapt their behavior based on the CI environment

 - [x] 8. **ci-general-002:** Improve CI debugging information
   - Priority: Low
   - Add more comprehensive debug information for CI failures
   - Create debug artifact collection for failed tests

## Documentation

 - [x] 9. **ci-docs-001:** Document visual testing strategy for CI
   - Priority: Medium
   - Explain the approach for handling visual tests in CI
   - Document how to generate and maintain platform-specific snapshots

## Current CI Failures (Latest Branch)

 - [x] 10. **ci-e2e-001:** Fix CTA Flow form visibility timeouts
   - Priority: High
   - **Issue**: E2E tests for CTA flow are failing with timeout errors when waiting for form elements to be visible
   - **Failing Tests**:
     - `CTA Flow @stable › happy path - successful email submission`
     - `CTA Flow @stable › client-side invalid email validation`
     - `CTA Flow @stable › server error - displays error message`
   - **Error**: `TimeoutError: locator.waitFor: Timeout 15000ms exceeded` when waiting for `form input, form button` to be visible
   - **Root Cause**: Locator is resolving to hidden honeypot field `<input type="text" tabindex="-1" name="_gotcha" autocomplete="off"/>` instead of visible form inputs
   - **Action Required**: Update test selectors to exclude honeypot fields and target visible form elements specifically
   - **COMPLETED**: Added data-testid attributes to CTA form elements (email input, submit button, success/error messages) and updated selectors to use them instead of generic selectors that were matching honeypot fields

 - [x] 11. **ci-e2e-002:** Improve CTA form test selectors
   - Priority: High
   - **Issue**: Test selectors are too generic and matching hidden form elements
   - **Action Required**: 
     - Use more specific selectors that exclude `tabindex="-1"` or `name="_gotcha"` elements
     - Add `data-testid` attributes to actual form inputs for reliable targeting
     - Update page object models to use the new selectors
   - **COMPLETED**: Added data-testid attributes to HeroSection and Footer components, updated Page Object Models to use data-testid selectors, updated E2E tests to use POM methods, fixed unit test mocks
   - **Note**: Found additional files (theme-visual.spec.ts, splash-page.spec.ts) still using generic selectors - created follow-up task

 - [x] 12. **ci-e2e-003:** Stabilize E2E test execution in CI environment
   - Priority: Medium
   - **Issue**: Tests pass locally but fail in CI due to timing/environment differences
   - **Action Required**:
     - Increase timeout values for CI environment
     - Add proper wait conditions before interacting with form elements
     - Ensure form is fully loaded and interactive before running tests
   - **COMPLETED**: Implemented comprehensive environment-aware timeout configuration system:
     - Created `timeout-config.ts` with CI-specific timeouts (2.5x longer for standard CI, 3x for CI-full)
     - Added CI-aware wait functions: `waitForFormReadyCI`, `retryClickCI`, `retryFillCI`, `retryNavigationCI`
     - Updated Page Object Models (CtaForm, SplashPage) to use CI-aware timeouts by default
     - Integrated with existing CI configuration and test modes
     - Maintained fast local development timeouts while extending CI timeouts for reliability

## CI Resolution Tasks (Current Failures)

 - [x] 13. **ci-fix-001:** Fix environment variable isolation in timeout-config unit tests
   - Priority: High
   - **Issue**: Test Coverage failing because timeout-config.test.ts expects local timeouts (15000ms) but receives CI timeouts (37500ms)
   - **Root Cause**: Jest test environment not properly isolated from CI environment detection
   - **Action Required**:
     - Mock environment variables in Jest test setup for timeout-config.test.ts
     - Ensure unit tests run in predictable local context regardless of CI environment
     - Verify timeout calculations work correctly in both local and CI environments
   - **COMPLETED**: Fixed environment isolation by mocking `isRunningInCI()` and `getCurrentTestMode()` functions instead of manipulating environment variables directly. Tests now run reliably in both local and CI contexts with proper isolation.

 - [x] 14. **ci-fix-002:** Add missing data-testid attribute to CTA form component
   - Priority: High  
   - **Issue**: E2E tests failing because CTA form lacks required `data-testid="cta-form"` attribute
   - **Root Cause**: Page Object Model expects `[data-testid="cta-form"]` selector but component doesn't have this attribute
   - **Action Required**:
     - Locate CTA section component (likely in components/molecules/cta-section.tsx)
     - Add `data-testid="cta-form"` attribute to the form element
     - Verify E2E test selectors match actual component structure
     - Ensure all CTA flow E2E tests can locate the form element
   - **COMPLETED**: CTA form component already had `data-testid="cta-form"` attribute. Fixed the actual issue: E2E form readiness check was selecting the hidden honeypot field instead of visible form elements. Updated enhanced-testing.ts to exclude hidden inputs by filtering out `tabindex="-1"` and `name="_gotcha"` elements.

## E2E Test CI Failures - FormSpark API Integration

 - [x] 15. **ci-e2e-fix-001:** Mock FormSpark API responses in E2E tests
   - Priority: High
   - **Issue**: E2E tests failing because form submissions to FormSpark with invalid test form ID never complete
   - **Root Cause**: Tests use `NEXT_PUBLIC_FORMSPARK_FORM_ID=test-form-id` which is not a valid FormSpark form ID, causing real API calls to fail
   - **Action Required**:
     - Add Playwright request interception for FormSpark API endpoint (`https://submit-form.com/*`)
     - Mock successful response for happy path test
     - Mock error response for server error test
     - Ensure mocked responses match FormSpark API format
     - Verify no real API calls are made during tests
   - **COMPLETED**: Implemented comprehensive FormSpark API mocking solution:
     - Created `e2e/utils/api-mocking.ts` with reusable mocking utilities: `mockFormSparkAPI()`, `verifyMockWasCalled()`, `createMockVerificationReport()`
     - Added dynamic URL construction using `getFormSparkSubmitURL()` to match application behavior regardless of environment
     - Updated `cta-flow.spec.ts` to use mocking utilities with proper request interception and verification
     - Successfully tested locally - mock intercepted all requests, no real API calls made, all assertions passed
     - Ensured mocks work in both local (`test-form-id`) and CI environments

 - [x] 16. **ci-e2e-fix-002:** Update CTA flow tests to use mocked API responses
   - Priority: High
   - **Depends on**: ci-e2e-fix-001
   - **Issue**: Tests expect real API responses but should verify UI behavior with mocked responses
   - **Action Required**:
     - Update happy path test to verify success message after mocked success response
     - Update error test to verify error message after mocked error response
     - Ensure client-side validation test continues to work without API calls
     - Add test assertions to verify API mocking is working correctly
   - **COMPLETED**: Verified CTA flow tests properly use mocked API responses from ci-e2e-fix-001:
     - Happy path test correctly mocks success response and verifies success message appears
     - Error test correctly mocks error response and verifies error message appears  
     - Client-side validation test works without API calls (no mocking needed)
     - Mock verification confirms no real API calls are made, only mocked responses used
     - All 4 tests pass: happy path, client validation, server error, and responsive design
     - Tests properly isolated with individual mock setup per test case

 - [x] 17. **ci-e2e-fix-003:** Add E2E test utilities for common API mocking patterns
   - Priority: Medium
   - **Depends on**: ci-e2e-fix-001, ci-e2e-fix-002
   - **Issue**: API mocking logic should be reusable across different E2E tests
   - **Action Required**:
     - Create `e2e/utils/api-mocking.ts` with FormSpark mock utilities
     - Add helper functions for common mock scenarios (success, error, network failure)
     - Document mocking patterns for future E2E test development
     - Ensure mock utilities are easily extensible for other APIs
   - **COMPLETED**: Enhanced existing API mocking utilities with additional scenarios:
     - Added network failure support with NetworkFailureType enum (connection refused, timeout, DNS failure, aborted)
     - Created convenience functions: mockFormSparkNetworkFailure(), mockFormSparkTimeout(), mockFormSparkRateLimit()
     - Enhanced documentation with comprehensive usage guide and examples
     - Improved extensibility with BaseMockOptions interface and example for extending to other APIs
     - Fixed TypeScript types and used correct Playwright error codes for route.abort()
     - All existing E2E tests continue to pass with enhanced utilities
