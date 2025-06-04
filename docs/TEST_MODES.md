# Test Modes

This document describes the test mode system implemented in the Scry Splash project. The test mode system allows tests to adapt their behavior based on the environment and testing requirements.

## Overview

The test mode system provides different configurations for different testing scenarios, enabling tests to run optimally in various environments from local development to CI pipelines.

## Available Test Modes

### 1. Local Development (`local-development`)

**Description**: Full testing capabilities for local development

**Characteristics**:

- All test types enabled (functional, visual, performance)
- No retries (fail fast for immediate feedback)
- Screenshots only on failure
- No videos or traces (for performance)
- Lower visual test thresholds (more sensitive)
- Standard timeouts

**Usage**:

```bash
pnpm e2e:local
# or
TEST_MODE=local-development pnpm e2e
```

### 2. CI Functional (`ci-functional`)

**Description**: CI mode focused on functional tests (default CI mode)

**Characteristics**:

- Excludes visual tests
- 1 retry for flaky test tolerance
- Screenshots on failure, videos on retry
- Always captures traces
- Higher performance thresholds (CI environment tolerance)
- Extended timeouts for CI environment
- Chromium browser only

**Usage**:

```bash
pnpm e2e:ci-functional
# or
TEST_MODE=ci-functional pnpm e2e
```

### 3. CI Visual (`ci-visual`)

**Description**: CI mode for visual regression testing

**Characteristics**:

- Only runs visual tests
- 1 retry for visual test stability
- Screenshots on success and failure
- Videos and traces captured
- Higher visual test thresholds (CI rendering differences)
- Snapshot update mode: 'missing'
- Extended timeouts

**Usage**:

```bash
pnpm e2e:ci-visual
# or
TEST_MODE=ci-visual pnpm e2e
```

### 4. CI Full (`ci-full`)

**Description**: Complete test suite for comprehensive CI runs

**Characteristics**:

- All test types enabled
- 2 retries for maximum stability
- Screenshots on failure, videos and traces always
- All browsers (Chromium, Firefox, WebKit)
- Higher performance thresholds
- Extended timeouts
- Visual testing enabled with CI thresholds

**Usage**:

```bash
pnpm e2e:ci-full
# or
TEST_MODE=ci-full pnpm e2e
```

### 5. CI Lightweight (`ci-lightweight`)

**Description**: Minimal test suite for quick CI feedback

**Characteristics**:

- Only functional tests (excludes visual, performance, flaky)
- 1 retry for basic stability
- Minimal artifact capture
- Chromium browser only
- Fastest timeouts
- Reduced logging
- Higher performance thresholds

**Usage**:

```bash
pnpm e2e:ci-lightweight
# or
TEST_MODE=ci-lightweight pnpm e2e
```

## Test Tags and Categories

The test mode system works with test tags to categorize tests:

- `@visual` - Visual regression tests
- `@functional` - Functional behavior tests
- `@performance` - Performance measurement tests
- `@a11y` - Accessibility tests
- `@flaky` - Tests that may be unstable in CI
- `@slow` - Tests that take longer to execute
- `@critical` - Critical business flow tests

## Mode Selection Logic

The system automatically selects the appropriate test mode based on:

1. **Explicit mode**: `TEST_MODE` environment variable
2. **CI detection**: Automatically uses CI modes when `CI=true`
3. **Visual test flags**: Switches to visual mode when visual tests are enabled
4. **Lightweight flag**: Uses lightweight mode when `LIGHTWEIGHT_TESTS=true`
5. **Browser flags**: Uses full mode when `RUN_ALL_BROWSERS=1`
6. **Default fallback**: Uses `local-development` for local, `ci-functional` for CI

## Using Test Modes in Code

### Basic Test Fixtures

```typescript
import {
  enhancedTest,
  visualTest,
  performanceTest,
  criticalTest,
} from "../utils/test-segmentation";

// Standard test - runs in all modes
enhancedTest("basic functionality", async ({ page }) => {
  await page.goto("/");
  // test logic
});

// Visual test - only runs when visual testing is enabled
visualTest("visual appearance", async ({ page }) => {
  await page.goto("/");
  // visual test logic
});

// Performance test - skipped in lightweight mode
performanceTest("page load performance", async ({ page }) => {
  await page.goto("/");
  // performance test logic
});
```

### Checking Current Mode

```typescript
import {
  getCurrentTestMode,
  getTestModeConfig,
  isInMode,
  TestMode,
} from "../utils/test-modes";

// Get current mode
const mode = getCurrentTestMode();

// Get full configuration
const config = getTestModeConfig();

// Check specific mode
if (isInMode(TestMode.CIVisual)) {
  // Visual testing specific logic
}
```

### Adaptive Test Behavior

```typescript
import { getAdjustedTimeouts } from "../utils/test-segmentation";

enhancedTest("adaptive test", async ({ page }, testInfo) => {
  const timeouts = getAdjustedTimeouts(testInfo);

  // Use mode-appropriate timeouts
  await page.goto("/", { timeout: timeouts.navigation });
  await page.waitForSelector("#content", { timeout: timeouts.action });
});
```

## Environment Variables

### Core Configuration

- `TEST_MODE` - Explicitly set test mode
- `CI` - Indicates CI environment
- `VISUAL_TESTS_ENABLED_IN_CI` - Enable visual tests in CI
- `LIGHTWEIGHT_TESTS` - Enable lightweight mode
- `RUN_ALL_BROWSERS` - Run on all browsers

### Playwright Integration

- `PLAYWRIGHT_TEST_GREP` - Include only matching tests
- `PLAYWRIGHT_TEST_GREP_INVERT` - Exclude matching tests
- `PLAYWRIGHT_UPDATE_SNAPSHOTS` - Snapshot update mode
- `PLAYWRIGHT_RETRIES` - Override retry count
- `PLAYWRIGHT_TIMEOUT` - Override test timeout

## NPM Scripts

The project includes convenient NPM scripts for each test mode:

```bash
# Test mode specific
pnpm e2e:local           # Local development mode
pnpm e2e:ci-functional   # CI functional tests
pnpm e2e:ci-visual       # CI visual tests
pnpm e2e:ci-full         # CI full suite
pnpm e2e:ci-lightweight  # CI lightweight tests

# Test type specific
pnpm e2e:functional      # Only functional tests
pnpm e2e:visual          # Only visual tests
pnpm e2e:performance     # Only performance tests
pnpm e2e:critical        # Only critical tests
```

## Debugging and Information

### View Current Mode Information

```bash
# Show current test mode configuration
ts-node e2e/scripts/test-mode-info.ts

# Show configuration for specific mode
TEST_MODE=ci-visual ts-node e2e/scripts/test-mode-info.ts
```

### Test Mode Attachment

Each test automatically receives a `test-mode.json` attachment containing:

- Current mode
- Mode description
- Browser configuration
- Visual testing status

## Integration with CI

The test mode system integrates seamlessly with GitHub Actions and other CI systems. The CI workflow can specify different modes for different job steps:

```yaml
# Functional tests (default)
- name: Run functional tests
  run: pnpm e2e:ci-functional

# Visual tests (when needed)
- name: Run visual tests
  run: pnpm e2e:ci-visual
  if: github.event_name == 'workflow_dispatch'

# Full test suite (for releases)
- name: Run full test suite
  run: pnpm e2e:ci-full
  if: github.ref == 'refs/heads/main'
```

## Best Practices

1. **Use appropriate test fixtures** - Choose the right test fixture (`enhancedTest`, `visualTest`, etc.) based on test characteristics
2. **Tag tests properly** - Use consistent tags to enable proper filtering
3. **Test mode awareness** - Design tests to work across different modes when possible
4. **Timeout considerations** - Use `getAdjustedTimeouts()` for tests that need mode-specific timeouts
5. **Artifact optimization** - Consider artifact impact when designing tests
6. **CI efficiency** - Use lightweight mode for quick feedback, full mode for comprehensive testing

## Extending the System

To add a new test mode:

1. Add the mode to the `TestMode` enum in `test-modes.ts`
2. Create a configuration object following the `TestModeConfig` interface
3. Add the configuration to the `TEST_MODE_CONFIGS` map
4. Update the mode selection logic in `getCurrentTestMode()`
5. Add NPM scripts for the new mode
6. Update documentation

The system is designed to be extensible and can accommodate new testing requirements as they arise.
