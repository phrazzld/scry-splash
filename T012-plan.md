# T012: Add Unit/Integration Tests for Theme Hook/Context

## Overview
This task involves adding unit and integration tests for the theme hook and context to verify their state management under different conditions. The tests should cover all functionality of the theme system, including initialization, state changes, system preference detection, and DOM manipulations.

## Current Implementation
- `ThemeProvider`: Context provider component with theme state management
- `useTheme`: Hook to access theme context
- Key features that need testing:
  - Theme initialization with defaults
  - Reading theme from localStorage
  - Theme switching (light/dark/system)
  - System preference detection
  - DOM attribute/class application

## Test Approach
1. Create unit tests for the `useTheme` hook
2. Create integration tests for the `ThemeProvider` component
3. Test initialization, state changes, and effects

## Tests to Implement

### Theme Provider Tests
1. **Provider Initialization**
   - Should initialize with default theme ("system")
   - Should initialize with provided theme from props
   - Should read theme from localStorage if available

2. **Theme State Management**
   - Should correctly provide theme context value
   - Should update theme when setTheme is called
   - Should write to localStorage when theme changes

3. **System Theme Detection**
   - Should detect system dark preference
   - Should detect system light preference
   - Should update when system preference changes

4. **DOM Manipulations**
   - Should apply correct class to HTML element based on theme
   - Should update class when theme changes
   - Should handle attribute type other than class

### Theme Hook Tests
1. **useTheme Hook**
   - Should return context data when used within provider
   - Should throw error when used outside provider
   - Should return the correct context values

### Edge Cases
1. **Error Handling**
   - Should handle missing window object (SSR)
   - Should handle invalid localStorage data
   - Should handle browser without matchMedia

## Implementation Plan

1. Create test file for theme provider and hook: `__tests__/components/ui/theme-provider.test.tsx`
2. Set up mocks for:
   - localStorage
   - matchMedia
   - document.documentElement
3. Implement test cases for normal operation
4. Implement test cases for edge cases
5. Verify test coverage

## Mocking Strategy
1. **localStorage Mock**
   - Mock localStorage.getItem and localStorage.setItem methods
   - Provide test values for storage state

2. **matchMedia Mock**
   - Create mock implementation of window.matchMedia
   - Simulate preference changes with mock event listeners

3. **Document Mock**
   - Create mock implementation of document.documentElement
   - Track class additions/removals and attribute changes

## Expected Challenges
1. Testing window and document objects in Jest
2. Testing theme with SSR conditions
3. Testing media query listeners and callbacks