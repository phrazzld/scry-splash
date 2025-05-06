# TEST-008: Internal Mocking Policy Violations

## Overview

This document tracks all instances where tests mock internal modules/components rather than only mocking true external boundaries, as identified during the TS-001 task implementation.

According to our testing philosophy, we should "Mock only true external system boundaries (APIs, browser features not in JSDOM, etc.)" and not internal collaborators.

## Violation List

### 1. Molecule Component Tests

1. **File:** `__tests__/components/molecules/hero-section.test.tsx`
   - **Description:** Mocks several internal UI components (Logo, DisplayText, BodyText, Container, GridItem) and React hooks.
   - **Components mocked:**
     - `@/components/ui/logo`
     - `@/components/ui/typography`
     - `@/components/ui/container`
     - React's `useState` and `useEffect` hooks
   - **Impact:** Test doesn't verify actual component integration, only the HeroSection logic in isolation
   - **Remediation:** Consider using actual components in integration tests and simplifying the component design to reduce the need for mocking

2. **File:** `__tests__/components/molecules/cta-section.test.tsx`
   - **Description:** Mocks multiple internal UI components and utilities
   - **Components mocked:**
     - `@/components/ui/button`
     - `@/components/ui/input`
     - `@/components/ui/typography`
     - `@/lib/utils` (cn utility function)
     - `@/lib/constants` (FORMSPARK)
   - **Impact:** Test focuses only on the CTA section's logic, not on integration with its dependencies
   - **Remediation:** Use real implementations for internal utilities and components

### 2. Organism Component Tests

3. **File:** `__tests__/components/organisms/splash-page.test.tsx`
   - **Description:** Mocks multiple internal components at the molecule and organism level
   - **Components mocked:**
     - `@/components/organisms/page-layout`
     - `@/components/molecules/hero-section`
     - `@/components/molecules/benefit-trio`
     - `@/components/molecules/cta-section`
   - **Impact:** Test only verifies composition logic, not actual component integration
   - **Remediation:** Consider integration tests that use real components instead of mocks

### 3. UI Component Tests

4. **File:** `__tests__/components/ui/button.test.tsx`
   - **Description:** Mocks internal utility function
   - **Components mocked:**
     - `@/lib/utils` (cn utility function)
   - **Impact:** Lower impact as this is a utility function, not a component
   - **Remediation:** Use real implementation of the utility function

5. **File:** `__tests__/components/ui/logo.test.tsx`
   - **Description:** Mocks internal utility function
   - **Components mocked:**
     - `@/lib/utils` (cn utility function)
   - **Impact:** Lower impact as this is a utility function, not a component
   - **Remediation:** Use real implementation of the utility function

## Recommended Remediation Actions

1. **High Priority:**
   - Refactor hero-section.test.tsx to use real components and not mock React internals
   - Update splash-page.test.tsx to use actual integration tests with real components

2. **Medium Priority:**
   - Replace cn utility mocks with the actual implementation across all tests
   - Update cta-section.test.tsx to use real UI components

3. **Low Priority:**
   - Develop clearer guidelines on mocking best practices
   - Implement automated lint rules to detect inappropriate mocking

## Next Steps

1. Create individual tickets for each high-priority refactoring task
2. Plan a knowledge-sharing session on testing without internal mocks
3. Update the testing documentation to clarify the mocking policy