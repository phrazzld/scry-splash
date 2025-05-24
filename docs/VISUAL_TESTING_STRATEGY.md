# Visual Testing Strategy

This document outlines the comprehensive visual testing strategy for the Scry Splash project, explaining our dual approach to visual regression testing and how to effectively use it in both local development and CI environments.

## Overview

Visual testing ensures that user interface changes don't introduce unintended visual regressions. Our strategy employs two complementary approaches:

1. **Component-Level Visual Testing** with Chromatic + Storybook
2. **End-to-End Visual Testing** with Playwright

Each approach serves different purposes and testing scenarios, providing comprehensive coverage of visual regressions across the application.

## Visual Testing Approaches

### Chromatic + Storybook (Component-Level)

**Purpose**: Test individual components in isolation across multiple viewports and states.

**Best for**:
- Component library development
- Testing component variants and states
- Cross-browser rendering verification
- Design system validation
- Catching component-level regressions

**Execution**: Runs against Storybook stories, testing components in isolation.

### Playwright (End-to-End Visual)

**Purpose**: Test complete user interfaces and workflows in real application context.

**Best for**:
- Full page visual testing
- Theme switching verification
- User journey visual validation
- Integration-level visual testing
- Platform-specific rendering differences

**Execution**: Runs against the live application, testing real user scenarios.

## Decision Matrix: When to Use Each Approach

| Testing Scenario | Chromatic | Playwright | Rationale |
|------------------|-----------|------------|-----------|
| Component variants/states | ✅ | ❌ | Isolated component testing is more efficient |
| Full page layouts | ❌ | ✅ | Real application context needed |
| Cross-browser differences | ✅ | ✅ | Both approaches provide browser testing |
| Theme switching | ❌ | ✅ | Requires full application state management |
| Component interactions | ❌ | ✅ | Real user interactions needed |
| Design system validation | ✅ | ❌ | Component isolation preferred |
| Mobile responsiveness | ✅ | ✅ | Both provide viewport testing |
| CI/CD integration | ✅ | ⚠️ | Chromatic is more CI-friendly; Playwright requires platform considerations |

## Platform-Specific Considerations

### Snapshot Management Challenge

Visual tests generate screenshots that can vary between operating systems due to:
- Font rendering differences
- Browser rendering engine variations
- System-level UI differences (scrollbars, form controls)

### Our Solution: Platform-Aware Snapshots

**Local Development (macOS)**: Generate and maintain macOS-specific snapshots for local development.

**CI Environment (Linux)**: Generate and maintain Linux-specific snapshots for CI validation.

**Naming Convention**: `{test-name}-{viewport}-{platform}-{environment}.png`
- Example: `theme-dark-desktop-darwin.png` (local macOS)
- Example: `theme-dark-desktop-linux-ci.png` (CI Linux)

## CI Integration Strategy

### Chromatic in CI

**Approach**: Fully integrated and platform-agnostic
- Runs automatically on all pull requests
- Provides web-based review interface
- Handles cross-platform differences automatically
- Blocks merges until visual changes are approved

**Configuration**: Managed via `CHROMATIC_PROJECT_TOKEN` and automatic GitHub integration.

### Playwright Visual Tests in CI

**Approach**: Controlled execution with platform awareness
- **Default**: Skipped in CI to avoid platform-specific failures
- **Optional**: Can be enabled with `VISUAL_TESTS_ENABLED_IN_CI=1`
- **Snapshot Updates**: Controlled via `PLAYWRIGHT_UPDATE_SNAPSHOTS` environment variable

**CI Modes**:
- `VISUAL_TESTS_ENABLED_IN_CI=0` (default): Skip visual tests, run functional tests only
- `VISUAL_TESTS_ENABLED_IN_CI=1`: Run visual tests with Linux-specific snapshots

## User Journey Scenarios

### Scenario 1: I'm developing a new component

**Recommended Approach**: Chromatic + Storybook
1. Create Storybook stories for component variants
2. Run `pnpm chromatic` locally to generate initial baselines
3. Review results on Chromatic web interface
4. CI will automatically run Chromatic on pull requests

**Documentation**: See [VISUAL_TESTING.md](./VISUAL_TESTING.md)

### Scenario 2: I'm implementing a new page or theme

**Recommended Approach**: Playwright E2E Visual Testing
1. Add visual test to `e2e/theme/` or appropriate directory
2. Generate local snapshots: `pnpm e2e --grep "@visual"`
3. For CI snapshots: Use workflow dispatch with visual tests enabled
4. Review and commit platform-specific snapshots

**Documentation**: See [PLAYWRIGHT_VISUAL_REGRESSION_GUIDE.md](./PLAYWRIGHT_VISUAL_REGRESSION_GUIDE.md)

### Scenario 3: Visual tests are failing in CI

**For Chromatic Failures**:
1. Check Chromatic web interface URL in CI logs
2. Review visual differences online
3. Approve or reject changes via web interface

**For Playwright Failures**:
1. Download test artifacts from CI
2. Review visual diff images in artifacts
3. Update snapshots if changes are intentional
4. See troubleshooting guide: [PLAYWRIGHT_VISUAL_REGRESSION_GUIDE.md](./PLAYWRIGHT_VISUAL_REGRESSION_GUIDE.md#troubleshooting)

### Scenario 4: I need to update visual snapshots

**For Chromatic**: Approve changes via the web interface

**For Playwright**:
- **Local updates**: `pnpm e2e --grep "@visual" --update-snapshots`
- **CI updates**: Set `PLAYWRIGHT_UPDATE_SNAPSHOTS=on-failure` in workflow dispatch
- **New snapshots**: Set `PLAYWRIGHT_UPDATE_SNAPSHOTS=missing`

## Best Practices

### Component Testing (Chromatic)
1. **Consistent Data**: Use static, deterministic data in stories
2. **State Coverage**: Create stories for all important component states
3. **Viewport Testing**: Leverage automatic multi-viewport testing
4. **Animation Control**: Animations are automatically disabled for consistency

### E2E Visual Testing (Playwright)
1. **Stable Selectors**: Use semantic selectors and data-testids
2. **Animation Handling**: Wait for animations to complete before screenshots
3. **Network Stability**: Ensure network requests are complete
4. **Platform Awareness**: Generate appropriate snapshots for target environment

### CI Integration
1. **Chromatic**: Keep token secure, review changes promptly
2. **Playwright**: Use manual triggers for snapshot updates
3. **Artifact Collection**: Always collect visual artifacts for debugging
4. **Platform Consistency**: Maintain separate snapshot sets for different platforms

## Maintenance and Updates

### Regular Maintenance Tasks
1. **Dependency Updates**: Keep Chromatic and Playwright versions current
2. **Snapshot Review**: Periodically review and clean up outdated snapshots
3. **Documentation Sync**: Update documentation when tools or processes change
4. **Platform Testing**: Verify cross-platform compatibility regularly

### When to Update Snapshots
- **Intentional Design Changes**: Update both Chromatic and Playwright snapshots
- **Dependency Updates**: May require snapshot updates due to rendering changes
- **Platform Changes**: Update platform-specific snapshots when CI environment changes

## Troubleshooting Quick Reference

| Issue | Tool | Solution |
|-------|------|----------|
| Component looks wrong in isolation | Chromatic | Check story data and component props |
| Full page visual failure | Playwright | Check theme state and page loading |
| CI visual tests failing | Playwright | Enable visual tests or update snapshots |
| Cross-browser differences | Both | Review browser-specific rendering |
| Flaky visual tests | Both | Improve stability (animations, timing) |

## Related Documentation

- [VISUAL_TESTING.md](./VISUAL_TESTING.md) - Chromatic setup and usage
- [PLAYWRIGHT_VISUAL_REGRESSION_GUIDE.md](./PLAYWRIGHT_VISUAL_REGRESSION_GUIDE.md) - Playwright visual testing guide
- [TESTING.md](./TESTING.md) - Overall testing strategy
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines including visual testing responsibilities

---

**Last Updated**: December 2024  
**Document Owner**: Engineering Team  
**Review Cycle**: Quarterly or when tools are updated