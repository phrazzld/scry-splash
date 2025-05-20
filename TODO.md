# TODO

## Testing Infrastructure

### E2E Testing Tasks

- [x] CI-T001: Add splash page tests for component visibility ✅ 
- [x] CI-T002: Add CTA flow tests for form submission ✅
- [x] CI-T003: Add visual regression tests ✅
- [x] CI-T004: Set up automated test runs in GitHub Actions ✅
- [x] CI-T005: Add test reports to GitHub Actions ✅
- [x] CI-T006: Implement enhanced debugging for test failures ✅
- [x] CI-T007: Add data-testid attributes for reliable element selection ✅
- [x] CI-T008: Implement full-page testing with component navigation ✅
- [x] CI-T009: Add dependency caching to CI workflow ✅
- [x] CI-T010: Create test setup module for E2E tests ✅

### CI Failure Resolution Tasks

- [ ] CI-T011: Fix debug directory handling in CI environment
  - Create common module for directory validation that works reliably in both local and CI environments
  - Add explicit checks for directory existence and permissions before each operation
  - Implement directory verification steps before and after test execution
  - Add file listing output for debugging artifact collection issues

- [ ] CI-T012: Refactor test utility modules to eliminate duplication
  - Establish clear separation of concerns between test setup, debug helpers, and enhanced testing
  - Remove duplicate implementations of directory creation and file saving functions
  - Create proper dependency hierarchy between utility modules
  - Add clear documentation for module responsibilities and usage patterns

- [ ] CI-T013: Fix visual testing configuration for CI environment
  - Adjust screenshot comparison thresholds to account for CI rendering differences
  - Implement more robust waiting for animations and content loading
  - Add viewport-specific baseline generation
  - Create CI-specific screenshot baselines if needed

- [ ] CI-T014: Enhance GitHub Actions workflow configuration
  - Restructure workflow steps for proper coordination with test setup
  - Add validation steps to verify artifact paths
  - Implement improved retry mechanisms for flaky tests
  - Add explicit checks to ensure setup steps completed successfully

- [ ] CI-T015: Implement enhanced debugging for CI-specific issues
  - Add environment detection to customize behavior in CI
  - Implement filesystem permission and path validation
  - Add browser metrics collection for CI runs
  - Create comprehensive environment information capture for failures

## UI Development

- [ ] UI-001: Implement dark mode toggle
- [ ] UI-002: Add responsive design for mobile devices
- [ ] UI-003: Improve accessibility for screen readers

## Feature Development

- [ ] FT-001: Add user authentication system
- [ ] FT-002: Implement dashboard page
- [ ] FT-003: Create user profile functionality