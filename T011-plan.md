# T011: Add Automated E2E Theme Tests

## Overview
The task is to add automated E2E tests to verify theme detection and rendering in both light and dark modes. Currently, the project uses Jest and React Testing Library for component testing but lacks E2E test capabilities.

## Current Theme Implementation
- ThemeProvider (React context) manages theme state
- ThemeScript prevents flash of unstyled content on page load
- Theme can be 'light', 'dark', or 'system' (uses OS preference)
- Theme is persisted in localStorage
- ThemeSwitch allows manual theme switching
- ThemeDebug provides visibility into theme state

## Implementation Plan

### 1. Add Playwright for E2E Testing
Playwright is a good choice for E2E testing because:
- It has modern features for testing web applications
- It supports testing in multiple browsers
- It has good support for testing dark/light modes and CSS variables
- It's well-maintained and has good documentation

Steps:
1. Install Playwright and its dependencies
2. Set up basic Playwright configuration
3. Create a simple initial test to verify the setup

### 2. Create Core Theme Tests
Test the following theme-related scenarios:
1. System preference detection (default behavior)
2. Manual theme switching (light/dark/system)
3. Theme persistence across page reloads (localStorage)
4. Visual validation of theme-specific styles

### 3. Test Components in Both Themes
Verify that key UI components render correctly in both themes:
1. SplashPage overall appearance
2. Logo visibility
3. Text contrast and readability
4. Button appearance and states

### 4. Test Anti-FOUC Script
Verify that the ThemeScript correctly prevents flash of unstyled content:
1. Test with different localStorage values
2. Test with different system preferences
3. Verify no visible theme switch occurs during page load

### 5. Test Theme Toggle Functionality
Test the ThemeSwitch component:
1. Default visibility (controlled by feature flag)
2. Switching between themes
3. UI state reflecting current theme
4. Proper application of theme changes

### 6. Integrate with GitHub Actions CI (optional)
Set up automated E2E testing in the CI pipeline:
1. Configure GitHub workflow for Playwright
2. Ensure tests run on pull requests/pushes

## Implementation Details

### Playwright Installation and Setup
```bash
# Install Playwright
pnpm add -D @playwright/test

# Install browsers
npx playwright install

# Create default configuration
npx playwright init
```

### Test Organization Structure
```
- /e2e/
  - /theme/
    - theme-detection.spec.ts     # System preference tests
    - theme-switching.spec.ts     # Manual switching tests
    - theme-persistence.spec.ts   # LocalStorage tests
    - theme-visual.spec.ts        # Visual appearance tests
  - /components/
    - splash-page.spec.ts         # Component tests in both themes
```

### Package.json Updates
Add new scripts for running E2E tests:
```json
"e2e": "playwright test",
"e2e:ui": "playwright test --ui",
"e2e:report": "playwright show-report"
```

### Setting System Theme in Playwright
We'll need to configure the browser context to simulate different system preferences:
```typescript
// For light mode
await browser.newContext({
  colorScheme: 'light'
});

// For dark mode
await browser.newContext({
  colorScheme: 'dark'
});
```

### LocalStorage Testing
We'll need to manipulate localStorage to test theme persistence:
```typescript
// Set theme in localStorage
await page.evaluate(() => {
  localStorage.setItem('scry-ui-theme', 'dark');
});

// Reload page and verify theme
await page.reload();
```

## Completion Criteria
- Playwright is configured correctly
- All planned tests are implemented and passing
- Tests verify theme detection, switching, and persistence
- Tests verify visual appearance in different themes
- Documentation is updated with instructions for running E2E tests