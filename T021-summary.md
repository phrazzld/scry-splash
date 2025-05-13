# T021 · Chore · P2: Add Comments Explaining Non-Obvious Test Logic

## Summary

I added comprehensive comments to explain non-obvious test logic in several test files, making the tests more maintainable and easier to understand:

### 1. `__tests__/components/ui/noise-background.test.tsx`
- Added detailed comments explaining the component's DOM structure
- Clarified how and why we need to filter out the noise overlay div when testing children order
- Added context about how the component renders and nests its children
- The existing JSDOM limitations section was already well documented

### 2. `__tests__/components/ui/theme-provider.test.tsx`
- Added comprehensive comments for the complex `matchMedia` mock implementation
- Explained the DOM property mocking strategy for HTML dataset manipulation
- Clarified how the system theme change simulation works
- Documented the pattern for detecting and triggering dark/light mode preference changes

### 3. `__tests__/components/ui/theme-toggle-button.test.tsx`
- Added comments explaining the partial module mocking strategy
- Documented the SVG path identification technique for both moon and sun icons
- Clarified why specific CSS selectors are used to target SVG elements

## Added Comments

I focused on explaining the *why* behind complex testing patterns, not just the *how*. The comments provide:

1. The purpose and rationale behind complex testing patterns
2. The structure of component DOM that affects testing
3. Clear explanations of mock implementations
4. Context for why certain selectors and assertions are used
5. Background on testing limitations and workarounds

These comments will make the test code more maintainable and help new developers understand the test logic more easily.