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

 - [~] 10. **ci-e2e-001:** Fix CTA Flow form visibility timeouts
   - Priority: High
   - **Issue**: E2E tests for CTA flow are failing with timeout errors when waiting for form elements to be visible
   - **Failing Tests**:
     - `CTA Flow @stable › happy path - successful email submission`
     - `CTA Flow @stable › client-side invalid email validation`
     - `CTA Flow @stable › server error - displays error message`
   - **Error**: `TimeoutError: locator.waitFor: Timeout 15000ms exceeded` when waiting for `form input, form button` to be visible
   - **Root Cause**: Locator is resolving to hidden honeypot field `<input type="text" tabindex="-1" name="_gotcha" autocomplete="off"/>` instead of visible form inputs
   - **Action Required**: Update test selectors to exclude honeypot fields and target visible form elements specifically

 - [ ] 11. **ci-e2e-002:** Improve CTA form test selectors
   - Priority: High
   - **Issue**: Test selectors are too generic and matching hidden form elements
   - **Action Required**: 
     - Use more specific selectors that exclude `tabindex="-1"` or `name="_gotcha"` elements
     - Add `data-testid` attributes to actual form inputs for reliable targeting
     - Update page object models to use the new selectors

 - [ ] 12. **ci-e2e-003:** Stabilize E2E test execution in CI environment
   - Priority: Medium
   - **Issue**: Tests pass locally but fail in CI due to timing/environment differences
   - **Action Required**:
     - Increase timeout values for CI environment
     - Add proper wait conditions before interacting with form elements
     - Ensure form is fully loaded and interactive before running tests
