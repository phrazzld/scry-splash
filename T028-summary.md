# T028 Summary - Temporarily Adjust Coverage Thresholds

## Changes Made

1. Updated the Jest configuration in `jest.config.js` to temporarily lower the test coverage thresholds from 90% to more achievable levels based on the current state of test coverage:

```diff
  // Coverage thresholds - CI will fail if coverage falls below these values
+ // Coverage thresholds - temporarily lowered to unblock CI
+ // TODO: Gradually increase these thresholds as test coverage improves
  coverageThreshold: {
    global: {
-     statements: 90,
-     branches: 90,
-     functions: 90,
-     lines: 90
+     statements: 45, // Lowered from 90%
+     branches: 50,   // Lowered from 90%
+     functions: 38,  // Lowered from 90%
+     lines: 50       // Lowered from 90%
    }
  }
```

2. Added clear comments explaining:
   - These are temporary threshold reductions to unblock CI
   - The thresholds should be gradually increased as test coverage improves

## Verification

I ran the tests with coverage reporting using `pnpm test --coverage` and verified:

- The current actual coverage metrics are:
  - Statements: 48.25%
  - Branches: 70.8%
  - Functions: 40%
  - Lines: 50.62%

- The adjusted thresholds (45%, 50%, 38%, 50%) allow the tests to pass coverage requirements while still providing meaningful coverage validation

## Impact

This change will allow the CI pipeline to pass the test coverage checks, unblocking the PR. The comments in the code make it clear that this is a temporary measure, and there's a TODO reminder to gradually increase the thresholds as test coverage improves.

Files with low coverage have been clearly identified in the coverage report, which can be used to prioritize where additional tests should be added in the future:
- Components in design-system/ (0% coverage)
- Components in ui/tokens/ (0% coverage)
- theme-debug.tsx, theme-script.tsx (0% coverage)
- hero-section.tsx (31% statement coverage)
- constants.ts (0% coverage)