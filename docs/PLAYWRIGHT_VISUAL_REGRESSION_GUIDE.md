# Playwright Visual Regression Testing Guide

This guide provides comprehensive documentation for end-to-end visual regression testing using Playwright, including platform-specific snapshot management, CI integration, and troubleshooting.

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Local Development Workflow](#local-development-workflow)
- [CI Integration](#ci-integration)
- [Snapshot Management](#snapshot-management)
- [Writing Visual Tests](#writing-visual-tests)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

Playwright visual testing captures screenshots of real application pages and compares them against baseline images to detect visual regressions. Our implementation handles platform differences between local development (macOS) and CI environments (Linux).

### Key Features

- **Platform-Aware Snapshots**: Separate snapshots for different operating systems
- **Environment-Specific Thresholds**: Adjusted comparison thresholds for CI vs local
- **Conditional CI Execution**: Visual tests can be enabled/disabled in CI
- **Comprehensive Artifact Collection**: Debug screenshots and failure artifacts
- **Multiple Update Modes**: Flexible snapshot updating strategies

## Configuration

### Environment Variables

The visual testing system is controlled by several environment variables:

#### `VISUAL_TESTS_ENABLED_IN_CI`
Controls whether visual tests run in CI environments.
- **Default**: `0` (disabled)
- **To enable**: Set to `1`
- **Usage**: `VISUAL_TESTS_ENABLED_IN_CI=1`

#### `PLAYWRIGHT_UPDATE_SNAPSHOTS`
Controls snapshot update behavior.
- **Values**:
  - `missing`: Only create snapshots that don't exist
  - `on-failure`: Update snapshots for failing tests
  - `all`: Replace all existing snapshots
- **Usage**: `PLAYWRIGHT_UPDATE_SNAPSHOTS=missing`

#### `PLAYWRIGHT_TEST_GREP` / `PLAYWRIGHT_TEST_GREP_INVERT`
Filter tests based on tags or patterns.
- **Visual tests only**: `PLAYWRIGHT_TEST_GREP="@visual"`
- **Skip visual tests**: `PLAYWRIGHT_TEST_GREP_INVERT="@visual"`

### Playwright Configuration

Visual testing configuration is centralized in `e2e/config/ci-config.ts`:

```typescript
// Screenshot comparison thresholds
expect: {
  toHaveScreenshot: {
    threshold: isInCIMode() ? 0.35 : 0.2,
    maxDiffPixelRatio: isInCIMode() ? 0.05 : 0.01,
  },
}
```

### Snapshot Directory Structure

Snapshots are stored with platform-specific naming:

```
e2e/tests/
├── {test-spec}-snapshots/
│   ├── test-name-desktop-darwin.png       # macOS local
│   ├── test-name-desktop-linux-ci.png     # Linux CI
│   ├── test-name-mobile-darwin.png
│   └── test-name-mobile-linux-ci.png
```

## Local Development Workflow

### Running Visual Tests Locally

#### Run All Visual Tests
```bash
# Run all tests tagged with @visual
pnpm e2e --grep "@visual"

# Run visual tests in UI mode for debugging
pnpm e2e:ui --grep "@visual"
```

#### Run Specific Visual Test
```bash
# Run specific test file
pnpm e2e e2e/theme/theme-visual.spec.ts

# Run specific test by name
pnpm e2e --grep "should apply correct styles in dark theme"
```

### Generating Local Snapshots

#### Create Missing Snapshots
```bash
# Generate only missing snapshots (recommended for new tests)
PLAYWRIGHT_UPDATE_SNAPSHOTS=missing pnpm e2e --grep "@visual"
```

#### Update All Snapshots
```bash
# Regenerate all visual snapshots (use when design changes)
PLAYWRIGHT_UPDATE_SNAPSHOTS=all pnpm e2e --grep "@visual"
```

#### Update Failed Snapshots
```bash
# Update only snapshots for currently failing tests
PLAYWRIGHT_UPDATE_SNAPSHOTS=on-failure pnpm e2e --grep "@visual"
```

### Reviewing Visual Changes

After running visual tests locally:

1. **Review Generated Images**: Check `e2e/tests/{test}-snapshots/` directory
2. **Compare Differences**: Use test report to see visual diffs
3. **View Test Report**: `pnpm e2e:report` opens detailed results
4. **Debug Artifacts**: Check `test-results/e2e-artifacts/screenshots/` for debug images

## CI Integration

### CI Workflow Configuration

Visual tests in CI are controlled by the GitHub Actions workflow (`.github/workflows/e2e.yml`):

#### Default Behavior (Visual Tests Disabled)
```yaml
- name: Run functional tests (non-visual)
  run: pnpm playwright test --grep-invert "@visual"
  env:
    PLAYWRIGHT_TEST_GREP_INVERT: "@visual"
```

#### Manual Visual Test Execution
```yaml
- name: Run visual tests (if explicitly enabled)
  if: ${{ github.event_name == 'workflow_dispatch' }}
  run: pnpm playwright test --grep "@visual"
  env:
    VISUAL_TESTS_ENABLED_IN_CI: '1'
    PLAYWRIGHT_TEST_GREP: "@visual"
```

### Triggering Visual Tests in CI

#### Method 1: Workflow Dispatch (Recommended)
1. Go to GitHub Actions tab
2. Select "E2E Tests" workflow
3. Click "Run workflow"
4. Optionally enable "Run tests on all browsers"
5. This automatically enables visual tests

#### Method 2: Environment Variable Override
Add to workflow file or set via GitHub repository variables:
```yaml
env:
  VISUAL_TESTS_ENABLED_IN_CI: '1'
```

### Generating CI Snapshots

To generate or update snapshots for the CI environment:

1. **Trigger Workflow Dispatch** with visual tests enabled
2. **Set Update Mode** via environment variable:
   ```yaml
   env:
     PLAYWRIGHT_UPDATE_SNAPSHOTS: 'missing'  # or 'all', 'on-failure'
   ```
3. **Download Artifacts** from CI run to get updated snapshots
4. **Commit Updated Snapshots** to repository

### CI Artifact Collection

CI automatically collects visual testing artifacts:

- **Screenshots**: Success and failure images
- **Visual Diffs**: Comparison images showing differences
- **Debug Artifacts**: Additional debugging information
- **Test Reports**: HTML reports with visual comparison details

Access artifacts via:
1. GitHub Actions run page
2. "Artifacts" section at bottom of run
3. Download "e2e-artifacts" and "playwright-report"

## Snapshot Management

### Platform-Specific Snapshots

Our system maintains separate snapshots for different platforms:

#### Naming Convention
```
{testName}-{viewport}-{platform}[-{environment}].png
```

Examples:
- `theme-dark-desktop-darwin.png` (macOS local)
- `theme-dark-desktop-linux-ci.png` (Linux CI)
- `splash-page-mobile-darwin.png` (macOS mobile)

#### Generation Strategy

**Local Development (macOS)**:
- Run tests locally to generate macOS-specific snapshots
- Commit these for local development consistency
- Used by team members developing on macOS

**CI Environment (Linux)**:
- Generate via workflow dispatch or CI runs
- Download from CI artifacts
- Commit these for CI validation consistency

### Snapshot Update Workflows

#### Scenario 1: Adding New Visual Test
```bash
# 1. Write test with @visual tag
# 2. Generate local snapshots
PLAYWRIGHT_UPDATE_SNAPSHOTS=missing pnpm e2e --grep "@visual"

# 3. Generate CI snapshots via workflow dispatch
# 4. Download and commit CI snapshots
```

#### Scenario 2: Intentional Design Changes
```bash
# 1. Update local snapshots
PLAYWRIGHT_UPDATE_SNAPSHOTS=all pnpm e2e --grep "@visual"

# 2. Update CI snapshots via workflow dispatch with PLAYWRIGHT_UPDATE_SNAPSHOTS=all
# 3. Download and commit updated snapshots
```

#### Scenario 3: Dependency Update Causing Visual Changes
```bash
# 1. Check if changes are expected
PLAYWRIGHT_UPDATE_SNAPSHOTS=on-failure pnpm e2e --grep "@visual"

# 2. Review changes carefully
# 3. If acceptable, update CI snapshots
# 4. Commit updated snapshots with clear explanation
```

## Writing Visual Tests

### Test Structure

Visual tests should follow this structure:

```typescript
import { visualTest } from '../utils/test-segmentation';
import { expectScreenshot, StandardViewport } from '../utils/visual-testing';

visualTest.describe('Component Visual Tests', () => {
  visualTest('should render correctly', async ({ page }, testInfo) => {
    // Setup: Navigate and prepare page
    await page.goto('/your-page');
    
    // Wait for stability
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await expectScreenshot(page, testInfo, 'component-state', {
      viewport: StandardViewport.Desktop,
      thresholdPreset: 'default'
    });
  });
});
```

### Required Test Tags

All visual tests must include the `@visual` tag for proper CI filtering:

```typescript
// Option 1: In test title
visualTest('should render correctly @visual', async ({ page }, testInfo) => {
  // test implementation
});

// Option 2: Using test.describe with tag
visualTest.describe('Visual Tests @visual', () => {
  // tests here are automatically tagged
});
```

### Viewport Management

Use standard viewports for consistency:

```typescript
import { StandardViewport } from '../utils/visual-testing';

// Single viewport
await expectScreenshot(page, testInfo, 'test-name', {
  viewport: StandardViewport.Desktop
});

// Multiple viewports
const viewports = [StandardViewport.Mobile, StandardViewport.Tablet, StandardViewport.Desktop];
for (const viewport of viewports) {
  await expectScreenshot(page, testInfo, `test-name-${viewport}`, {
    viewport
  });
}
```

### Stability and Timing

Ensure stable screenshots by waiting for:

```typescript
// Network requests to complete
await page.waitForLoadState('networkidle');

// Animations to finish
await page.waitForSelector('[data-animation-complete]');

// Custom timing
await expectScreenshot(page, testInfo, 'test-name', {
  animationTimeout: 5000,
  stabilityDelay: 1000
});
```

### Masking Dynamic Content

Hide elements that change between runs:

```typescript
await expectScreenshot(page, testInfo, 'test-name', {
  mask: [
    page.locator('[data-testid="current-time"]'),
    page.locator('.loading-spinner'),
    page.locator('[data-dynamic]')
  ]
});
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: Visual tests failing in CI but passing locally

**Cause**: Platform differences between macOS (local) and Linux (CI)

**Solution**: 
1. Generate CI-specific snapshots via workflow dispatch
2. Download and commit Linux snapshots
3. Verify both platform snapshots exist in repository

#### Issue: Flaky visual tests

**Causes and Solutions**:
- **Animations**: Increase `animationTimeout` or wait for specific elements
- **Network requests**: Use `waitForLoadState('networkidle')`
- **Font loading**: Wait for fonts to load or mask text elements
- **Timing**: Increase `stabilityDelay`

#### Issue: Visual differences due to minor pixel variations

**Solution**: Adjust threshold presets:
```typescript
// More lenient for dynamic content
await expectScreenshot(page, testInfo, 'test-name', {
  thresholdPreset: 'lenient'
});

// Stricter for static content
await expectScreenshot(page, testInfo, 'test-name', {
  thresholdPreset: 'strict'
});
```

#### Issue: Cannot generate CI snapshots

**Troubleshooting Steps**:
1. Verify `VISUAL_TESTS_ENABLED_IN_CI=1` is set
2. Check that tests are tagged with `@visual`
3. Ensure workflow dispatch is used (not push trigger)
4. Check CI logs for specific error messages

#### Issue: Snapshots not updating despite setting update mode

**Possible Causes**:
1. Environment variable not properly set
2. Tests not running (filtered out)
3. Test failures preventing snapshot creation

**Solutions**:
1. Verify environment variable syntax
2. Check test filtering configuration
3. Fix test failures before updating snapshots

### Debugging Visual Tests

#### Local Debugging
```bash
# Run with UI mode for step-by-step debugging
pnpm e2e:ui --grep "@visual"

# Generate debug screenshots
# (automatically saved to test-results/e2e-artifacts/screenshots/)
```

#### CI Debugging
1. Check CI logs for error messages
2. Download artifacts from failed runs
3. Review `debug-*` screenshots in artifacts
4. Compare expected vs actual images in artifacts

#### Test Report Analysis
```bash
# Open detailed test report
pnpm e2e:report
```

The report includes:
- Visual diff images
- Test execution timeline
- Error messages and stack traces
- Debug artifact links

## Best Practices

### Test Design
1. **Single Responsibility**: One visual aspect per test
2. **Descriptive Names**: Clear test and screenshot names
3. **Viewport Consistency**: Use standard viewport sizes
4. **Stable Selectors**: Avoid fragile CSS selectors

### Snapshot Management
1. **Regular Updates**: Keep snapshots current with design changes
2. **Platform Awareness**: Maintain both local and CI snapshots
3. **Review Changes**: Always review visual diffs before committing
4. **Clean Repository**: Remove orphaned snapshots

### CI Integration
1. **Minimal CI Load**: Keep visual tests disabled by default
2. **Explicit Triggers**: Use workflow dispatch for snapshot updates
3. **Artifact Collection**: Always collect artifacts for debugging
4. **Clear Documentation**: Document when and why snapshots change

### Performance
1. **Parallel Execution**: Use Playwright's parallel capabilities
2. **Efficient Waiting**: Use specific waits instead of arbitrary timeouts
3. **Selective Testing**: Use filters to run only necessary tests
4. **Resource Management**: Clean up after tests

## Command Reference

### Local Development
```bash
# Run all visual tests
pnpm e2e --grep "@visual"

# Update missing snapshots
PLAYWRIGHT_UPDATE_SNAPSHOTS=missing pnpm e2e --grep "@visual"

# Update all snapshots
PLAYWRIGHT_UPDATE_SNAPSHOTS=all pnpm e2e --grep "@visual"

# Debug mode
pnpm e2e:ui --grep "@visual"

# View results
pnpm e2e:report
```

### CI Workflow Dispatch
1. Navigate to GitHub Actions
2. Select "E2E Tests" workflow
3. Click "Run workflow"
4. Configure options as needed

### Environment Variables
```bash
# Enable visual tests in CI
VISUAL_TESTS_ENABLED_IN_CI=1

# Update modes
PLAYWRIGHT_UPDATE_SNAPSHOTS=missing
PLAYWRIGHT_UPDATE_SNAPSHOTS=on-failure
PLAYWRIGHT_UPDATE_SNAPSHOTS=all

# Test filtering
PLAYWRIGHT_TEST_GREP="@visual"
PLAYWRIGHT_TEST_GREP_INVERT="@visual"
```

---

**Last Updated**: December 2024  
**Document Owner**: Engineering Team  
**Review Cycle**: When Playwright version is updated or CI environment changes

For questions or issues not covered in this guide, please check:
- [VISUAL_TESTING_STRATEGY.md](./VISUAL_TESTING_STRATEGY.md) - Overall strategy
- [TESTING.md](./TESTING.md) - General testing documentation
- [Playwright Documentation](https://playwright.dev/docs/test-screenshots) - Official Playwright docs