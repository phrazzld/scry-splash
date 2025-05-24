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
