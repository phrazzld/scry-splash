# Plan: Implement Comprehensive Tests for Core UI Atoms (TEST-001)

## Overview
This plan outlines the implementation of comprehensive tests for three core UI atom components: `Container`, `Logo`, and `NoiseBackground` to increase coverage of foundational components and support safe refactoring.

## Approach
Implement comprehensive, behavior-driven unit tests using Jest and React Testing Library, incorporating `jest-axe` for accessibility validation, strictly adhering to the no-internal-collaborator-mocking policy.

## Components to Test

### Container Component
- **Current Status**: Basic tests exist but need enhancement for comprehensive coverage
- **Test Focus**:
  - Default rendering behavior
  - Variant props: `maxWidth`, `padding`, `center`, `gap`, `gapX`, `gapY`
  - `as` prop for polymorphic behavior
  - Custom `className` merging
  - Children rendering
  - Ref forwarding
  - `GridItem` subcomponent functionality
  - Accessibility compliance

### Logo Component
- **Current Status**: Basic tests exist but need enhancement for comprehensive coverage
- **Test Focus**:
  - Default rendering behavior (text content, default tag)
  - Styling for parts of the logo (period's opacity)
  - `as` prop for polymorphic behavior
  - Size and color variants
  - Custom `className` merging
  - Accessibility (aria-label, contrast)

### NoiseBackground Component
- **Current Status**: No tests exist
- **Test Focus**:
  - Default rendering behavior
  - Children rendering within component
  - `baseColor` prop styling
  - `noiseOpacity` prop styling
  - Custom `className` merging
  - Accessibility (noise overlay `aria-hidden`, contrast)

## Implementation Steps

1. **Setup/Verify Accessibility Testing**:
   - Ensure `jest-axe` is installed and properly configured

2. **Update Container Component Tests**:
   - Enhance existing tests for better coverage
   - Add tests for all variants and combinations
   - Add a11y tests using jest-axe

3. **Update Logo Component Tests**:
   - Enhance existing tests for better coverage
   - Add tests for all size and color variants
   - Add a11y tests using jest-axe

4. **Create NoiseBackground Component Tests**:
   - Create test file and test suite
   - Implement tests for all props and behaviors
   - Add a11y tests using jest-axe

5. **Coverage Verification**:
   - Run tests with coverage reporting
   - Ensure coverage meets project standards (≥95%)
   - Add tests for any uncovered lines or branches

## Testing Principles

- **No Mocking of Internal Collaborators**: 
  - Test components based on their actual rendered output and behavior
  - Avoid mocking internal collaborators including the `cn` utility
  - Focus on testing the public API and observable behavior

- **Accessibility Testing**:
  - Use `jest-axe` to validate WCAG compliance
  - Test specific ARIA attributes and roles
  - Ensure sufficient color contrast in component variants

- **Coverage Goals**:
  - Aim for 100% line and branch coverage
  - Minimum acceptable is 95% for these foundational atoms

## Dependencies

- This task depends on A11Y-001 (Integrate comprehensive accessibility checks into testing pipeline)
- If A11Y-001 is not yet complete, we'll still implement the tests but may need to revisit for full a11y validation later

## Branch Strategy

Will create a feature branch following the pattern:
```
feature/test-001-core-ui-atom-tests
```

The PR title will follow conventional commits:
```
test: add comprehensive tests for core UI atoms
```