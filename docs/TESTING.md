# Testing Strategy

This document outlines the testing strategy and setup for the Scry Splash project, explaining the separation between Jest unit/component tests and Playwright end-to-end tests.

## Testing Architecture

The project uses a multi-layered testing approach:

1. **Unit/Component Tests (Jest)**: Test individual components in isolation
2. **End-to-End Tests (Playwright)**: Test complete user flows and interactions
3. **Visual Regression Tests (Chromatic)**: Test for unintended visual changes
4. **Accessibility Tests (jest-axe)**: Test for accessibility violations

## Directory Structure

```
scry-splash/
├── __tests__/                 # Jest unit and component tests
│   └── components/
│       ├── molecules/         # Tests for molecule components
│       ├── organisms/         # Tests for organism components
│       └── ui/                # Tests for UI atom components
├── e2e/                       # Playwright end-to-end tests
│   ├── components/            # E2E tests for components
│   └── theme/                 # E2E tests for theming
├── __mocks__/                 # Jest mocks
├── jest.config.js             # Jest configuration
├── jest.setup.js              # Jest setup file
└── playwright.config.ts       # Playwright configuration
```

## Jest Tests

### Configuration

Jest is configured in `jest.config.js` with the following key settings:

- **Test Environment**: jsdom (browser-like environment)
- **Setup Files**: `jest.setup.js` (includes jest-dom and jest-axe)
- **Path Mappings**: Includes alias support (`@/` maps to project root)
- **Excluded Paths**: Excludes e2e tests, node_modules, .next
- **Coverage Collection**: Collects from components, app, and lib directories
- **Coverage Thresholds**: Configurable thresholds for statements, branches, functions, and lines

### Writing Component Tests

Component tests should:

1. Test the component in isolation (mocking dependencies when needed)
2. Verify rendering, props, state changes, and user interactions
3. Include accessibility checks using jest-axe
4. Follow the AAA pattern (Arrange, Act, Assert)

### Example Component Test

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Testing Hooks and Context

- Use `renderHook` from `@testing-library/react` for testing hooks
- Set up providers when testing components that use context
- Consider creating helper functions for common setup tasks

## Playwright End-to-End Tests

### Configuration

Playwright is configured in `playwright.config.ts` with the following key settings:

- **Test Directory**: `e2e/`
- **Browsers**: Chromium, Firefox, and WebKit
- **Base URL**: http://localhost:3000
- **Web Server**: Automatically starts the Next.js dev server
- **Retry Strategy**: Retries failed tests in CI
- **Screenshots**: Captures on failure

### Writing E2E Tests

E2E tests should:

1. Test complete user flows and interactions
2. Verify behavior across different browsers
3. Focus on critical paths and user journeys
4. Be resilient to minor UI changes

### Example E2E Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test('should switch from light to dark theme', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify initial theme (assuming light is default)
    await expect(page.locator('html')).toHaveClass(/light/);
    
    // Click the theme toggle button
    await page.click('[aria-label="Toggle theme"]');
    
    // Verify theme changed to dark
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'e2e/screenshots/dark-theme.png' });
  });
});
```

## Test Coverage

### Coverage Targets

The project aims for high test coverage:

- **Target Thresholds**: 90% for statements, branches, functions, and lines
- **Current Thresholds**: Temporarily lowered to unblock CI
  - Statements: 45% (target: 90%)
  - Branches: 50% (target: 90%)
  - Functions: 38% (target: 90%)
  - Lines: 50% (target: 90%)

### Measuring Coverage

```bash
# Run tests with coverage
pnpm test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### Coverage Enforcement

Coverage is enforced in two ways:
1. **CI Pipeline**: Fails if coverage falls below thresholds
2. **Pre-push Hook**: Prevents pushing if coverage is insufficient

## Running Tests

### Jest Tests

```bash
# Run all Jest tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run a specific test file
pnpm test path/to/file.test.tsx
```

### Playwright Tests

```bash
# Run all E2E tests
pnpm e2e

# Run with UI mode
pnpm e2e:ui

# View test report
pnpm e2e:report

# Run specific test file
npx playwright test e2e/path/to/file.spec.ts

# Run in specific browser
npx playwright test --project=chromium
```

## Mocking Strategy

### External Dependencies

- **Network Requests**: Mock with `jest.mock(global.fetch)` or similar
- **Browser APIs**: Mock with Jest's manual mocks
- **Third-party Libraries**: Mock using Jest's module mocking

### Internal Modules

- **Internal Collaborators**: Do NOT mock; test integration instead
- **UI Components**: May use simplified mocks for complex UI components in molecule/organism tests
- **Utilities**: Use real implementations when possible

## Best Practices

### When to Use Jest vs. Playwright

- **Use Jest for**:
  - Unit testing individual components
  - Testing component props and interactions
  - Logic and state management
  - Accessibility checks

- **Use Playwright for**:
  - Cross-browser compatibility
  - User flows that span multiple pages
  - Visual verification
  - System integration

### Test Organization

- Group related tests under descriptive `describe` blocks
- Use clear, specific test names that describe what's being tested
- Place tests alongside the implementation code in the appropriate test directory

### Writing Resilient Tests

- Use semantic queries (`getByRole`, `getByText`) over implementation details
- Test behaviors, not implementation details
- Avoid relying on specific DOM structure or CSS classes when possible
- Use `data-testid` attributes sparingly when semantic selectors won't work

## Accessibility Testing

Jest tests include accessibility checks using jest-axe:

```typescript
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

For more details, see [A11Y_TESTING.md](./A11Y_TESTING.md).

## Visual Testing

Visual regression testing is handled through Chromatic, which integrates with Storybook.

For more details, see [VISUAL_TESTING.md](./VISUAL_TESTING.md) and [CHROMATIC_SETUP.md](./CHROMATIC_SETUP.md).

## CI Integration

Tests are run in the CI pipeline:
- Jest tests with coverage checking
- Playwright tests for E2E verification
- Chromatic for visual regression testing

Failing tests or insufficient coverage will block PRs from being merged.

## Troubleshooting

### Jest Tests

- **DOM Events Not Working**: Ensure you're using `userEvent` instead of `fireEvent` for most cases
- **Act Warnings**: Wrap state updates in `act()` when testing React components
- **Mock Not Working**: Check mock implementation and ensure it's before the component render

### Playwright Tests

- **Timing Issues**: Use proper waiting strategies (`waitForSelector`, etc.)
- **Selector Not Found**: Use the Playwright Inspector to debug selectors
- **Cross-browser Issues**: Run tests in all browsers to identify browser-specific problems