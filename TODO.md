# TODO

## CI E2E Test Fixes (CI-FIX-001)

- [x] **CI-T006 · Fix · P0: fix form element detection in `waitForFormReady` function**
    - **Context:** CTA flow tests in CI failing with `TimeoutError: page.waitForFunction: Timeout 30000ms exceeded`
    - **Action:**
        1. Refactor `waitForFormReady` in enhanced-testing.ts to use simpler `waitForSelector` approach
        2. Add explicit existence check before waiting
        3. Add detailed debugging when form not found
        4. Reduce complexity of DOM traversal in waiting logic
    - **Done‑when:**
        1. Form elements are reliably detected in CI environment
        2. No more timeout errors on form element detection
    - **Verification:**
        1. CTA form tests pass consistently in CI
        2. Debug information is captured when element detection fails
    - **Depends‑on:** none
    
- [x] **CI-T007 · Fix · P0: generate and commit missing Linux visual snapshots**
    - **Context:** Visual tests failing with `A snapshot doesn't exist at /home/runner/work/scry-splash/scry-splash/e2e/tests/splash-page-load.spec.ts-snapshots/splash-page-stable-webkit-linux.png`
    - **Action:**
        1. Create dedicated workflow to generate Linux snapshots
        2. Run workflow and download generated snapshots
        3. Commit the Linux snapshots to the repository
        4. Document snapshot generation process
    - **Done‑when:**
        1. All required Linux snapshots exist in repository
        2. Visual regression tests pass in CI environment
    - **Verification:**
        1. Visual tests pass consistently in CI
        2. No more "snapshot doesn't exist" errors
    - **Depends‑on:** none

- [x] **CI-T008 · Optimization · P1: reduce CI execution time for E2E tests**
    - **Context:** E2E tests take 18+ minutes to run in CI, slowing down development
    - **Action:**
        1. Reduce test timeouts in playwright.config.ts
        2. Update CI to run only Chromium tests by default
        3. Configure Firefox/WebKit to run only when explicitly requested
        4. Increase worker count for parallel test execution
        5. Reduce retry attempts from 2 to 1
    - **Done‑when:**
        1. CI execution time is reduced by at least 50%
        2. Tests remain reliable with reduced timeouts
    - **Verification:**
        1. PR checks complete significantly faster
        2. Tests still pass consistently with new settings
    - **Depends‑on:** none

- [ ] **CI-T009 · Enhancement · P1: add dependency caching to CI workflow**
    - **Context:** CI spends significant time installing dependencies on each run
    - **Action:**
        1. Add Node modules caching to CI workflow
        2. Add Playwright browsers caching
        3. Use pnpm's frozen lockfile for deterministic installs
    - **Done‑when:**
        1. CI setup time is significantly reduced
        2. Browsers don't need to be downloaded on every run
    - **Verification:**
        1. Check CI logs for cache hits
        2. Verify faster dependency installation
    - **Depends‑on:** none

- [ ] **CI-T010 · Enhancement · P2: create test setup module for E2E tests**
    - **Context:** Debug directories may not exist when tests run in CI
    - **Action:**
        1. Create e2e/test-setup.ts module
        2. Add function to ensure debug directories exist
        3. Update tests to use this setup module
        4. Ensure CI properly handles debug artifacts
    - **Done‑when:**
        1. Debug directories are reliably created in CI
        2. Debug artifacts are properly stored and uploaded
    - **Verification:**
        1. Debug screenshots and logs are available in CI
        2. No errors about missing directories
    - **Depends‑on:** none

- [x] **CI-T005 · Fix · P0: fix URL construction in navigation helper**
    - **Context:** All E2E tests failing in CI with `TypeError: Invalid URL` error
    - **Action:**
        1. Update `navigateTo` method in BasePage to handle empty/invalid page URLs
        2. Add fallback to baseURL from configuration when page URL is unavailable
        3. Add better error handling and logging for URL construction
        4. Test navigation with both relative and absolute paths
    - **Done‑when:**
        1. E2E tests pass in CI environment
        2. Navigation works reliably across all browsers
    - **Verification:**
        1. All E2E tests pass in CI for all browsers
        2. No `TypeError: Invalid URL` errors in logs
    - **Depends‑on:** none

- [x] **CI-T001 · Debug · P0: debug form submission test failures**
    - **Context:** Form submission tests fail to find success/error messages in CI
    - **Action:**
        1. Add debug logging to CTA form tests to capture actual page content
        2. Add console.log before and after form submission
        3. Capture page HTML when test fails
        4. Check network tab for actual API responses
    - **Done‑when:**
        1. Debug information is captured in test failures
        2. Root cause of missing messages is identified
    - **Verification:**
        1. Run tests locally with debug mode
        2. Review CI logs for diagnostic information
    - **Depends‑on:** none

- [x] **CI-T002 · Fix · P0: fix form submission message detection**
    - **Context:** Success and error messages not being detected by tests
    - **Action:**
        1. Update message selectors to use data-testid attributes
        2. Add explicit wait conditions for message appearance
        3. Increase timeout for message detection
        4. Consider using partial text matching
    - **Done‑when:**
        1. Form submission tests pass in CI
        2. Success and error messages are reliably detected
    - **Verification:**
        1. E2E tests pass in CI for all browsers
        2. No timeout errors for message detection
    - **Depends‑on:** [CI-T001]

- [x] **CI-T003 · Fix · P1: update visual regression snapshots for Linux**
    - **Context:** Visual tests fail due to missing Linux baseline snapshots
    - **Action:**
        1. Add platform-specific snapshot directories
        2. Update CI workflow to generate snapshots on Linux
        3. Consider using Docker for consistent rendering
        4. Update snapshot comparison logic for cross-platform
    - **Done‑when:**
        1. Visual regression tests pass in CI
        2. Platform-specific snapshots are managed correctly
    - **Verification:**
        1. Visual tests pass on both local and CI environments
        2. Snapshots are stored in platform-specific directories
    - **Depends‑on:** none

- [x] **CI-T004 · Enhancement · P2: improve test reliability and debugging**
    - **Context:** Tests need better error reporting and stability
    - **Action:**
        1. Add comprehensive error screenshots and HTML dumps
        2. Implement retry logic for flaky operations
        3. Add more specific wait conditions
        4. Improve test logging and error messages
    - **Done‑when:**
        1. Test failures provide clear diagnostic information
        2. Flaky tests are eliminated or minimized
    - **Verification:**
        1. Review test failure outputs for clarity
        2. Monitor test stability over multiple runs
    - **Depends‑on:** [CI-T002, CI-T003]

## Completed Tasks

### E2E Testing Setup (TEST-002)
- [x] **T001 · Chore · P1: install playwright and browser binaries**
- [x] **T002 · Chore · P1: configure playwright (`playwright.config.ts`)**
- [x] **T003 · Chore · P1: establish e2e directory structure**
- [x] **T004 · Feature · P1: implement `SplashPage.pom.ts`**
- [x] **T005 · Feature · P1: implement `CtaForm.pom.ts`**
- [x] **T006 · Test · P1: implement splash page load and visual regression test**
- [x] **T007 · Test · P1: implement cta flow happy path test**
- [x] **T008 · Test · P1: implement cta flow client-side invalid email test**
- [x] **T009 · Test · P1: implement cta flow mocked server error test**
- [x] **T010 · Chore · P1: add e2e scripts to `package.json`**
- [x] **T011 · Feature · P1: integrate e2e tests into ci workflow**
- [x] **T012 · Chore · P2: create/update `e2e/README.md` with comprehensive documentation**
- [x] **T013 · Chore · P2: update main project documentation to reference e2e testing**