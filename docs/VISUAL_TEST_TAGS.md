# Visual Test Tags

This document explains how to use the test tagging system to identify and selectively run visual regression tests.

## Overview

The test tagging system allows us to categorize tests by their type (visual, functional, etc.) and run them selectively. This is particularly useful for visual tests, which can be more environment-sensitive and might need to be skipped in certain CI environments.

## Tags Available

The following tags are available for tests:

- `@visual`: Tests that perform visual regression checks with screenshots
- `@functional`: Tests that check functionality without visual regression
- `@performance`: Tests that measure loading times and performance metrics
- `@a11y`: Accessibility tests

## Writing Visual Tests

To create a visual test that can be easily identified and filtered:

1. Import the `visualTest` fixture:

```typescript
import { visualTest } from "../utils/test-segmentation";
```

2. Use this fixture instead of the regular test fixture:

```typescript
// Before
const myTest = enhancedTest;

// After
const myTest = visualTest.extend(enhancedTest);
```

3. All tests created with this fixture will be automatically tagged with `@visual`.

## Running Tests Selectively

### Command Line

You can use the following commands to run tests selectively:

```bash
# Run only visual tests
pnpm playwright test --grep "@visual"

# Run all tests except visual tests
pnpm playwright test --grep-invert "@visual"
```

### Environment Variables

In CI environments, you can control test execution using environment variables:

```bash
# Run only visual tests
PLAYWRIGHT_TEST_GREP="@visual" pnpm playwright test

# Skip visual tests
PLAYWRIGHT_TEST_GREP_INVERT="@visual" pnpm playwright test
```

## CI Configuration

In our CI workflows, visual tests are:

1. Disabled by default to avoid false negatives due to platform rendering differences
2. Can be explicitly enabled for specific CI runs when needed
3. Automatically run in isolation from functional tests when enabled

To enable visual tests in a CI workflow, set:

```yaml
env:
  VISUAL_TESTS_ENABLED_IN_CI: "1" # Enable visual tests
  PLAYWRIGHT_TEST_GREP: "@visual" # Filter to run only visual tests
```

## Snapshot Management

When running visual tests, you can control snapshot behavior with:

```bash
# Update only missing snapshots (good for CI)
PLAYWRIGHT_UPDATE_SNAPSHOTS=missing pnpm playwright test --grep "@visual"

# Update snapshots for failing tests
PLAYWRIGHT_UPDATE_SNAPSHOTS=on-failure pnpm playwright test --grep "@visual"

# Update all snapshots (careful with this one!)
PLAYWRIGHT_UPDATE_SNAPSHOTS=all pnpm playwright test --grep "@visual"
```

## Best Practices

1. Tag all tests that compare screenshots with `@visual`
2. Keep visual tests focused on appearance, not functionality
3. Create separate tests for functionality that don't use screenshot comparison
4. In CI, generate platform-specific snapshots for reliable visual testing
