# End-to-End Testing for Scry Splash

This directory contains end-to-end tests for the Scry Splash page using Playwright and the Page Object Model (POM) pattern.

## Overview

Our E2E testing setup uses:
- **Playwright** for browser automation and testing
- **Page Object Model (POM)** pattern for maintainable test structure
- **TypeScript** for type-safe test code
- **Visual regression testing** for UI consistency

The POM pattern separates page-specific logic from test logic, making tests more readable and maintainable. Page objects encapsulate page elements and actions, while tests focus on user scenarios.

## Prerequisites and Setup

### For New Contributors

Before running E2E tests, you need to install Playwright and its browser binaries:

```bash
# Install Playwright browsers and system dependencies
pnpm playwright install --with-deps
```

This command installs:
- Chromium, Firefox, and WebKit browsers
- System dependencies required for these browsers
- All necessary drivers for test execution

## Running Tests

### Available Scripts

```bash
# Run all E2E tests
pnpm e2e

# Run tests with UI mode (shows test execution in a browser)
pnpm e2e:ui

# Show the HTML report from the last test run
pnpm e2e:report

# Update visual regression snapshots
pnpm e2e:update-snapshots
```

### Advanced Usage

```bash
# Run specific test file
pnpm e2e e2e/tests/splash-page-load.spec.ts

# Run tests in a specific browser
pnpm e2e --project=chromium
pnpm e2e --project=firefox
pnpm e2e --project=webkit

# Run tests in debug mode
pnpm e2e --debug

# Run tests with trace recording (helpful for debugging)
pnpm e2e --trace on
```

## Directory Structure

```
e2e/
├── page-objects/          # Page Object Model classes
│   ├── SplashPage.pom.ts  # Splash page page object
│   └── CtaForm.pom.ts     # CTA form page object
├── tests/                 # Test specifications
│   ├── splash-page-load.spec.ts  # Page load and visual tests
│   └── cta-flow.spec.ts         # CTA form interaction tests
├── screenshots/           # Generated screenshots (gitignored)
├── theme/                 # Legacy theme tests (to be migrated)
└── components/           # Legacy component tests (to be migrated)
```

## Page Object Model (POM) Pattern

Page objects encapsulate page-specific elements and actions:

```typescript
// Example: e2e/page-objects/SplashPage.pom.ts
export class SplashPage {
  constructor(private page: Page) {}
  
  async navigate() {
    await this.page.goto('/')
  }
  
  async getHeadline() {
    return this.page.getByRole('heading', { level: 1 })
  }
}
```

Tests use page objects for cleaner, more maintainable code:

```typescript
// Example: e2e/tests/splash-page-load.spec.ts
import { SplashPage } from '../page-objects/SplashPage.pom'

test('should display headline', async ({ page }) => {
  const splashPage = new SplashPage(page)
  await splashPage.navigate()
  
  const headline = await splashPage.getHeadline()
  await expect(headline).toBeVisible()
})
```

## Writing New Tests

### Adding a New Page Object

1. Create a new file in `e2e/page-objects/` with `.pom.ts` extension
2. Define a class with methods for page interactions
3. Use TSDoc comments to document methods
4. Example structure:

```typescript
import { type Page, type Locator } from '@playwright/test'

/**
 * Page Object for the About page
 */
export class AboutPage {
  private readonly page: Page
  
  constructor(page: Page) {
    this.page = page
  }
  
  /**
   * Navigate to the About page
   */
  async navigate(): Promise<void> {
    await this.page.goto('/about')
  }
  
  /**
   * Get the main content section
   */
  getContent(): Locator {
    return this.page.getByRole('main')
  }
}
```

### Adding a New Test

1. Create a new file in `e2e/tests/` with `.spec.ts` extension
2. Import necessary page objects
3. Use `test.describe()` to group related tests
4. Write clear, descriptive test names
5. Example structure:

```typescript
import { test, expect } from '@playwright/test'
import { AboutPage } from '../page-objects/AboutPage.pom'

test.describe('About Page', () => {
  test('should display content', async ({ page }) => {
    const aboutPage = new AboutPage(page)
    
    await aboutPage.navigate()
    await expect(aboutPage.getContent()).toBeVisible()
  })
})
```

## Selector Best Practices

When writing selectors in page objects, prioritize in this order:

1. **User-facing attributes**: `getByRole()`, `getByText()`, `getByLabel()`
2. **Test IDs**: `getByTestId()` when semantic selectors aren't suitable
3. **CSS selectors**: As a last resort for complex cases

Examples:
```typescript
// Preferred: semantic selectors
this.page.getByRole('button', { name: 'Submit' })
this.page.getByLabel('Email address')
this.page.getByText('Welcome to Scry')

// Good: test IDs for specific elements
this.page.getByTestId('cta-form')

// Avoid: brittle CSS selectors
this.page.locator('.btn-primary') // Not recommended
```

## Debugging Tests

### Using Playwright Inspector

```bash
# Run tests with inspector
pnpm e2e --debug

# Pause at specific point in test
await page.pause()
```

### Trace Viewer

```bash
# Run with trace recording
pnpm e2e --trace on

# View trace after test failure
pnpm exec playwright show-trace test-results/path-to-trace.zip
```

### HTML Report

```bash
# Generate and view detailed test report
pnpm e2e:report
```

The report includes:
- Test results with pass/fail status
- Screenshots of failures
- Test execution timeline
- Detailed error messages

### Debugging Tips

1. **Add screenshots** at key points:
   ```typescript
   await page.screenshot({ path: 'debug.png' })
   ```

2. **Use wait conditions** to handle timing issues:
   ```typescript
   await page.waitForSelector('.element')
   await page.waitForLoadState('networkidle')
   ```

3. **Log page content** for debugging:
   ```typescript
   console.log(await page.content())
   ```

4. **Check element state**:
   ```typescript
   const isVisible = await element.isVisible()
   const isEnabled = await element.isEnabled()
   ```

## Visual Regression Testing

Visual regression tests capture screenshots to detect unintended UI changes.

### Creating Visual Tests

```typescript
test('visual regression', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage.png')
})
```

### Updating Snapshots

When intentional UI changes occur:

```bash
# Update all snapshots
pnpm e2e:update-snapshots

# Update specific test snapshots
pnpm e2e:update-snapshots path/to/test.spec.ts
```

### Platform-Specific Snapshots

Visual snapshots are platform and browser-specific. Our project maintains separate snapshots for each browser and platform combination (e.g., `chromium-darwin`, `webkit-linux`).

These snapshots are committed to the repository and checked during test runs.

#### Generating Linux Snapshots

To generate Linux snapshots (required for CI):

1. Use the dedicated GitHub workflow:
   - Go to the GitHub repository
   - Navigate to Actions → "Generate Linux Visual Snapshots"
   - Click "Run workflow"
   - Select browser (all, chromium, firefox, webkit)
   - Click "Run workflow" button

2. Download snapshot artifacts:
   - After workflow completes, go to the run summary page
   - Download the "linux-snapshots" artifact
   - Extract the contents and copy to your local repository in `e2e/tests/splash-page-load.spec.ts-snapshots/`
   - Commit the snapshots to the repository

#### Updating Snapshots Across All Platforms

When making UI changes that affect snapshots:

1. Update local (darwin/Windows) snapshots first:
   ```bash
   pnpm e2e:update-snapshots
   ```

2. Generate new Linux snapshots using the workflow
3. Download and commit updated snapshots for all platforms

### Best Practices for Visual Tests

1. **Wait for stable state** before capturing:
   ```typescript
   await page.waitForLoadState('networkidle')
   await page.waitForTimeout(100) // Brief wait for animations
   ```

2. **Mask dynamic content**:
   ```typescript
   await expect(page).toHaveScreenshot('page.png', {
     mask: [page.locator('.timestamp')],
   })
   ```

3. **Set viewport size** for consistency:
   ```typescript
   await page.setViewportSize({ width: 1280, height: 720 })
   ```

4. **Commit snapshots for all platforms/browsers**:
   - Ensure snapshots exist for all browser/platform combinations
   - When updating one browser's snapshots, update all others too
   - Always commit snapshots to the repository

## API Mocking

For tests that involve API calls, use Playwright's request interception:

```typescript
test('mocked API response', async ({ page }) => {
  // Mock API response
  await page.route('**/api/submit', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true }),
    })
  })
  
  // Test continues with mocked response
  await page.goto('/')
  // ... rest of test
})
```

## Configuration

The Playwright configuration is defined in `playwright.config.ts` at the project root:

- **Test directory**: `./e2e/tests`
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, and WebKit
- **Retries**: 2 in CI, 0 locally
- **Web server**: Automatically starts Next.js dev server
- **Reports**: List and HTML reporters
- **Traces**: Recorded on first retry
- **Screenshots**: Captured on failure

## CI Integration

E2E tests run automatically in CI on:
- Pull requests
- Pushes to main branch

The CI workflow:
1. Installs dependencies
2. Installs Playwright browsers
3. Runs all E2E tests
4. Uploads test artifacts on failure

## Troubleshooting

### Common Issues

1. **Browsers not installed**:
   ```bash
   pnpm playwright install --with-deps
   ```

2. **Port 3000 already in use**:
   - Kill the process using the port
   - Or update `baseURL` in config

3. **Test timeouts**:
   - Increase timeout in test or config
   - Check for proper wait conditions
   - Verify network requests complete

4. **Flaky tests**:
   - Add appropriate wait conditions
   - Use `waitForLoadState()`
   - Check for race conditions

### Getting Help

- Check Playwright documentation: https://playwright.dev
- Review existing tests for patterns
- Ask the team for guidance
- Use debug mode to step through issues