# T026 Summary - Exclude e2e tests from Jest runs

## Changes Made

1. Updated the Jest configuration in `jest.config.js` to exclude the e2e directory from Jest test runs:

```diff
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
+   '<rootDir>/e2e/',  // Exclude Playwright e2e tests from Jest runs
  ],
```

## Verification

I ran the tests with `pnpm test` and confirmed that:
- All Jest tests pass successfully (302 tests in 17 test suites)
- No Playwright-related test errors occur in the output
- The Playwright e2e tests are no longer being included in the Jest test runs

## Impact

This change solves one of the CI failures by properly separating Jest unit/component tests from Playwright e2e tests. Now Jest will no longer attempt to run Playwright e2e tests, which was causing errors in the test coverage workflow.

There are still React act() warnings in the `cta-section.test.tsx` file that should be addressed in a separate task (T027).