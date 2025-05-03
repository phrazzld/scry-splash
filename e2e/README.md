# End-to-End Testing for Scry Splash

This directory contains end-to-end tests for the Scry Splash page using Playwright.

## Test Structure

The tests are organized into the following categories:

- **Theme Tests** (`/e2e/theme/`):
  - `theme-detection.spec.ts`: Tests for system theme preference detection
  - `theme-switching.spec.ts`: Tests for manually switching between themes
  - `theme-persistence.spec.ts`: Tests for theme persistence across page reloads
  - `theme-visual.spec.ts`: Tests for visual appearance in different themes
  - `anti-fouc.spec.ts`: Tests for the anti-FOUC (Flash of Unstyled Content) script

- **Component Tests** (`/e2e/components/`):
  - `splash-page.spec.ts`: Tests for the splash page component in both themes

## Running Tests

```bash
# Run all tests
pnpm e2e

# Run tests with UI mode (shows test execution in a browser)
pnpm e2e:ui

# Show the HTML report from the last test run
pnpm e2e:report

# Run specific test file
npx playwright test e2e/theme/theme-detection.spec.ts

# Run tests in a specific browser
npx playwright test --project=chromium

# Run tests in debug mode
npx playwright test --debug
```

## Screenshots

The tests will generate several screenshots in the project root directory:
- `dark-theme.png`: Dark theme visual appearance
- `light-theme.png`: Light theme visual appearance
- `dark-splash-page.png`: Splash page in dark theme
- `light-splash-page.png`: Splash page in light theme
- `dark-focus-input.png`: Input field with focus in dark theme
- `light-focus-input.png`: Input field with focus in light theme
- `dark-focus-button.png`: Button with focus in dark theme
- `light-focus-button.png`: Button with focus in light theme

## Configuration

The Playwright configuration is defined in `playwright.config.ts` at the project root. The configuration includes:

- **Test browsers**: Chromium, Firefox, and WebKit
- **Base URL**: http://localhost:3000
- **Web server**: Automatically starts the Next.js dev server for tests

## Adding New Tests

When adding new tests, follow these guidelines:

1. Create a new `.spec.ts` file in the appropriate directory
2. Import the Playwright test utilities: `import { test, expect } from '@playwright/test'`
3. Group related tests with `test.describe()`
4. Use descriptive test names that clearly indicate what is being tested
5. Use `page.screenshot()` to capture visual evidence when relevant
6. Follow the patterns established in existing tests

## Testing Theme-Specific Features

When testing features that behave differently in light and dark themes:

1. Use `page.evaluate()` to set the theme in localStorage
2. Reload the page to apply the theme: `await page.reload()`
3. Wait for the theme to be applied: `await page.waitForSelector('html.dark')` or `await page.waitForSelector('html.light')`
4. Verify theme-specific behavior using assertions

## Debugging

- Use the `--debug` flag to run tests in debug mode
- Use `page.pause()` in your test to pause execution at that point
- Add `await page.screenshot({ path: 'debug.png' })` to capture screenshots at specific points
- Check the HTML report for test results and screenshots: `pnpm e2e:report`