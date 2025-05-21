# CI E2E Test Fix Summary

## Issue Identified
The CI workflow for E2E tests was failing because it was looking for tests tagged with the `@stable` tag, but none of the tests in the codebase had this tag.

### Root Cause Analysis
1. The workflow was trying to run stable tests with: `pnpm playwright test --grep "@stable"`
2. The workflow was also running flaky tests with: `pnpm playwright test --grep-invert "@stable"`
3. The tests were using the `enhancedTest`, `enhancedModeratelyFlakyTest`, and `enhancedHighlyFlakyTest` fixtures, but they weren't actually tagged with the `@stable` keyword that the workflow was looking for.

### Solution Implemented
Added the `@stable` tag to test describe blocks in the following test files:
- `e2e/tests/splash-page-load.spec.ts`
- `e2e/tests/cta-flow.spec.ts`

This ensures that these tests will be properly identified by the `--grep "@stable"` argument in the CI workflow.

### How the Fix Works
1. When the CI workflow runs `pnpm playwright test --grep "@stable"`, it will now correctly find the tagged tests in the above files.
2. The workflow will separate stable and flaky tests based on these tags, running the stable tests first.
3. If all stable tests pass, the workflow will consider the build successful even if some flaky tests fail.

## Other Considerations
- Ensure all new tests are properly tagged as either `@stable` or intentionally left untagged (to be treated as flaky)
- The test segmentation approach using different fixtures (`enhancedTest` vs `enhancedModeratelyFlakyTest`) could be better aligned with the tagging system

## Implementation Details
- Modified e2e/tests/splash-page-load.spec.ts: Added `@stable` tag to the test describe block
- Modified e2e/tests/cta-flow.spec.ts: Added `@stable` tag to the test describe block

This fix maintains the integrity of the testing infrastructure while ensuring the stable tests are properly identified and run in the CI workflow.