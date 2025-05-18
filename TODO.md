# TODO

## CI E2E Test Fixes (CI-FIX-001)

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

- [ ] **CI-T002 · Fix · P0: fix form submission message detection**
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

- [ ] **CI-T003 · Fix · P1: update visual regression snapshots for Linux**
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

- [ ] **CI-T004 · Enhancement · P2: improve test reliability and debugging**
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