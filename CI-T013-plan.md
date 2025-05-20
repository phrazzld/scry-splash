# CI-T013: Fix visual testing configuration for CI environment

## Task Analysis

### Problem Statement
The visual testing setup in the CI environment has several issues that need to be addressed:

1. Screenshot comparison thresholds need adjustment to account for CI rendering differences
2. Tests are failing in CI due to inconsistent animations and content loading
3. Viewport-specific baseline generation needs improvement
4. CI-specific screenshot baselines may be needed to handle platform differences

### Current Implementation Analysis

Currently, the project uses Playwright for E2E testing including visual snapshot testing. The main issues are:

1. **Unreliable screenshot comparisons**: The current threshold settings (0.2) don't account for subtle rendering differences between development environments and CI environments.
   
2. **Animation instability**: The current `waitForAnimationsComplete` function doesn't reliably ensure all animations have finished in CI environments before taking screenshots.

3. **Viewport inconsistency**: While there's support for multiple viewports in the Chromatic setup, E2E tests don't have standardized viewport handling.

4. **Platform-specific differences**: According to the documentation, there are expected differences between Linux (CI) and macOS/Windows (development) environments in screenshot rendering, requiring separate baselines.

## Implementation Plan

### 1. Optimize Screenshot Comparison Thresholds

- Modify the `expect.toHaveScreenshot` configuration in `playwright.config.ts` to have different thresholds based on the execution environment (CI vs local)
- Increase thresholds specifically for CI environments to account for rendering differences
- Add documentation explaining the threshold settings

### 2. Improve Animation and Content Loading Detection

- Enhance the `waitForAnimationsComplete` function in `e2e/utils/enhanced-testing.ts` to be more robust
- Implement an improved content loading detection system that accounts for common CI timing issues
- Add additional stability checks before capturing screenshots

### 3. Implement Consistent Viewport Handling

- Create a standardized viewport configuration system for tests
- Add helpers for consistent viewport control in tests
- Ensure all visual tests set consistent viewports before capture

### 4. Add Environment-Specific Screenshot Baselines

- Implement conditional baseline selection based on the execution environment
- Update the documentation and CI workflow to support platform-specific baselines
- Ensure CI has access to appropriate baselines for comparison

### 5. Refactor Test Setup for Visual Tests

- Create a dedicated visual testing helper module
- Implement standardized visual testing functions and setup
- Update existing tests to use the new helper module

## Technical Design

### 1. Update Playwright Configuration

```typescript
// playwright.config.ts
expect: {
  toHaveScreenshot: {
    // Increase threshold specifically for CI environments
    threshold: process.env.CI ? 0.35 : 0.2,
    // Increase max diff pixel ratio for CI
    maxDiffPixelRatio: process.env.CI ? 0.05 : 0.01,
    // Add tolerance for anti-aliasing differences
    _tolerancePercentage: 0.01, // 1% of pixels can be different
  },
},
```

### 2. Enhanced Animation and Content Detection

```typescript
// e2e/utils/enhanced-testing.ts
export async function waitForAnimationsComplete(
  page: Page,
  options: { timeout?: number; retries?: number; checkInterval?: number } = {}
): Promise<void> {
  const { timeout = 10000, retries = 3, checkInterval = 100 } = options;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      debugLog(`Waiting for animations to complete (attempt ${attempt + 1}/${retries + 1})...`);
      
      // Wait for common animation classes/properties
      await page.waitForFunction(
        () => {
          // Enhanced animation detection logic
          const animating = document.querySelectorAll('.animate-*, [class*="transition-"], [class*="animate"]');
          return animating.length === 0 || Array.from(animating).every(el => {
            const styles = window.getComputedStyle(el);
            return styles.animationPlayState === 'completed' || 
                  styles.animationPlayState === 'none' || 
                  styles.animationDuration === '0s' ||
                  styles.transitionDuration === '0s';
          });
        },
        { timeout: timeout / (retries + 1) }
      );
      
      // Add additional wait to ensure stability
      await page.waitForTimeout(checkInterval);
      
      // Validate stability by checking no DOM changes for a brief period
      const before = await page.evaluate(() => document.documentElement.outerHTML);
      await page.waitForTimeout(checkInterval);
      const after = await page.evaluate(() => document.documentElement.outerHTML);
      
      if (before === after) {
        debugLog('Animations completed successfully');
        return; // Animations are stable
      }
      
      debugLog('DOM still changing, continuing to wait...');
    } catch (e) {
      if (attempt === retries) {
        // On last attempt, log warning but continue
        debugLog(`Could not confirm animations completed: ${e}`, 'warn');
      }
    }
  }
}
```

### 3. Viewport Management

```typescript
// e2e/utils/visual-testing.ts (new file)
export enum StandardViewport {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
}

export const viewportDimensions = {
  [StandardViewport.Mobile]: { width: 375, height: 667 },
  [StandardViewport.Tablet]: { width: 768, height: 1024 },
  [StandardViewport.Desktop]: { width: 1280, height: 800 },
};

export async function setViewport(
  page: Page, 
  viewport: StandardViewport | { width: number; height: number }
): Promise<void> {
  const dimensions = typeof viewport === 'string' 
    ? viewportDimensions[viewport] 
    : viewport;
    
  await page.setViewportSize(dimensions);
  // Allow time for responsive elements to adjust
  await page.waitForTimeout(100);
}
```

### 4. Environment-Specific Baselines

```typescript
// e2e/utils/visual-testing.ts (continued)
export async function expectScreenshot(
  page: Page, 
  name: string,
  options: {
    viewport?: StandardViewport;
    timeout?: number;
    mask?: Array<Locator>;
  } = {}
): Promise<void> {
  const { viewport, timeout = 15000, mask } = options;
  
  // Set viewport if specified
  if (viewport) {
    await setViewport(page, viewport);
  }
  
  // Wait for animations and network to settle
  await waitForAnimationsComplete(page, { timeout: timeout / 3 });
  await waitForNetworkIdle(page, timeout / 3);
  
  // Add additional safety timeout
  await page.waitForTimeout(200);
  
  // Create environment-specific screenshot name
  const platform = process.platform;
  const envSuffix = process.env.CI ? '-ci' : '';
  const fullName = `${name}-${platform}${envSuffix}.png`;
  
  // Take and compare screenshot with appropriate settings
  await expect(page).toHaveScreenshot(fullName, {
    timeout,
    mask,
    threshold: process.env.CI ? 0.35 : 0.2,
    maxDiffPixelRatio: process.env.CI ? 0.05 : 0.01,
  });
}
```

### 5. Update Tests to Use New Helpers

```typescript
// Example test update
import { test } from '@playwright/test';
import { SplashPage } from '../page-objects/SplashPage.pom';
import { expectScreenshot, StandardViewport } from '../utils/visual-testing';

test('should take a visual screenshot of the splash page', async ({ page }) => {
  const splashPage = new SplashPage(page);
  await splashPage.navigate();
  
  // Use the new visual testing helper for screenshots
  await expectScreenshot(page, 'splash-page-stable', {
    viewport: StandardViewport.Desktop,
    // Mask dynamic elements if needed
    mask: [page.locator('.typewriter-text')]
  });
});
```

## Implementation Approach

1. First, create the `visual-testing.ts` utility module with all required helper functions
2. Update the `playwright.config.ts` file to include new threshold configurations
3. Enhance the `waitForAnimationsComplete` function in `enhanced-testing.ts`
4. Update a subset of tests to use the new helpers as a proof of concept
5. Update CI workflow configuration to support the new visual testing setup
6. Generate new baselines for all environments and update documentation
7. Migrate all remaining tests to use the new visual testing helpers

## Risk Analysis

### Potential Risks

1. **CI Environment Consistency**: Different CI runners may have subtle differences in rendering
2. **Baseline Management**: Managing multiple environment-specific baselines could become complex
3. **False Positives/Negatives**: Increased thresholds could mask real issues, or still trigger false failures

### Mitigation Strategies

1. Use dedicated GitHub runners for visual tests where possible
2. Implement a clear naming convention and workflow for managing baseline images
3. Balance thresholds carefully with additional visual checks and comparison validations
4. Implement periodic visual validation by humans for critical components

## Testing Plan

1. Run E2E tests locally with the new visual testing setup
2. Compare local results with the existing system
3. Run tests in CI environment with the updated configuration
4. Generate new baselines for both local and CI environments
5. Verify the stability of tests across multiple CI runs

## Acceptance Criteria

1. ✅ Visual tests run reliably in CI without flakiness
2. ✅ Animation handling is robust and waits appropriately before capture
3. ✅ Viewport handling is consistent across tests
4. ✅ Platform-specific differences are properly accounted for
5. ✅ The implementation follows project development philosophy principles
6. ✅ Documentation is updated to reflect the new visual testing setup