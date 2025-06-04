# Playwright Visual Regression Testing

This document explains how we use Playwright for end-to-end visual regression testing in the Scry Splash project.

## Overview

In addition to component-level visual testing with Chromatic, we use Playwright for full-page visual regression testing. This helps catch layout issues, component integration problems, and other visual changes that might not be apparent when testing components in isolation.

## Platform-Specific Snapshots

Playwright automatically generates and compares platform-specific snapshots, as rendering can differ between operating systems.

### Snapshot Naming Convention

Snapshots follow this naming pattern:

```
{test-name}-{browser}-{platform}.png
```

Example:

```
splash-page-stable-chromium-darwin.png  # macOS snapshot
splash-page-stable-chromium-linux.png   # Linux snapshot
```

### Snapshot Storage

Snapshots are stored in the test directory with a `-snapshots` suffix:

```
e2e/tests/splash-page-load.spec.ts-snapshots/
```

## Running Visual Tests

### Locally (macOS)

Run the tests and verify against existing snapshots:

```bash
pnpm playwright test
```

Update snapshots if you've made intentional UI changes:

```bash
pnpm playwright test --update-snapshots
```

### CI Environment (Linux)

Tests run automatically on GitHub Actions for each pull request and push to tracked branches. The workflow is configured in `.github/workflows/e2e.yml`.

## Managing Platform Differences

### Cross-Platform Testing

For robust testing across environments:

1. **Maintain both sets of snapshots**

   - macOS (darwin) snapshots for local development
   - Linux snapshots for CI

2. **When making UI changes**:
   - Generate both sets of snapshots
   - Commit both to ensure tests pass in all environments

### Updating Snapshots

#### For macOS (Local Development)

```bash
pnpm playwright test --update-snapshots
git add e2e/tests/splash-page-load.spec.ts-snapshots/*-darwin.png
git commit -m "test(visual): update macOS visual snapshots"
```

#### For Linux (CI Environment)

1. Temporarily modify `.github/workflows/e2e.yml` to update and save snapshots:

   ```yaml
   - name: Run E2E tests
     run: pnpm playwright test --update-snapshots
   ```

2. Push this change to trigger the workflow
3. Download the snapshot artifacts from GitHub Actions
4. Add the Linux snapshots to your local repository:

   ```bash
   git add e2e/tests/splash-page-load.spec.ts-snapshots/*-linux.png
   git commit -m "test(visual): update Linux visual snapshots"
   ```

5. Revert the CI workflow change:
   ```yaml
   - name: Run E2E tests
     run: pnpm playwright test
   ```

## Best Practices

1. **Reduce Flakiness**:

   - Add appropriate waits for animations to complete
   - Ensure consistent initial state before taking snapshots
   - Consider disabling animations with CSS when possible

2. **Review Differences Carefully**:

   - Minor pixel differences may be expected between platforms
   - Focus on meaningful layout and content changes

3. **Update Both Platforms Together**:

   - Always update both macOS and Linux snapshots when making UI changes
   - Commit both sets of snapshots in the same PR

4. **Handle Font Rendering**:
   - Be aware that font rendering differs between platforms
   - Focus on layout rather than exact pixel matching
   - Consider font-smoothing settings for consistency

## Troubleshooting

### Common Issues

1. **Snapshots Failing in CI but Passing Locally**:

   - OS-specific rendering differences (Linux vs macOS)
   - Missing or outdated Linux snapshots
   - Solution: Update Linux snapshots following the process above

2. **Inconsistent Snapshots**:

   - Dynamic content changing between runs
   - Animations or transitions not fully completed
   - Solution: Add wait times or stabilize dynamic content

3. **Text Rendering Differences**:
   - Font availability differences between environments
   - Font rendering differences (anti-aliasing, hinting)
   - Solution: Focus on layout over pixel-perfect matching

## Future Considerations

For more consistent environments across local and CI testing, consider:

1. **Docker-Based Testing**: Run tests in the same container environment locally and in CI
2. **Custom Snapshot Comparison**: Implement tolerance thresholds for minor differences
3. **Component-Specific Settings**: Add configuration for specific components that need special handling

## Resources

- [Playwright Visual Comparisons Documentation](https://playwright.dev/docs/test-snapshots)
- [Handling Visual Regression Testing Challenges](https://www.ministryoftesting.com/articles/a1168e05)
- [Cross-Platform Testing Best Practices](https://css-tricks.com/cross-browser-testing-is-becoming-increasingly-challenging/)
