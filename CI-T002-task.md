# CI-T002: Fix Form Submission Message Detection

## Task ID: CI-T002

## Title: Fix form submission message detection

## Original Ticket Text:
- [ ] **CI-T002 · Fix · P0: fix form submission message detection**
    - **Context:** Success and error messages not being detected by tests
    - **Action:**
        1. Update message selectors to use data-testid attributes
        2. Add explicit wait conditions for message appearance
        3. Increase timeout for message detection
        4. Consider using partial text matching
    - **Done‑when:**
        1. Form submission tests pass in CI
        2. Success and error messages are reliably detected
    - **Verification:**
        1. E2E tests pass in CI for all browsers
        2. No timeout errors for message detection
    - **Depends‑on:** [CI-T001]

## Implementation Approach Analysis Prompt:

### Context
The E2E tests are failing in CI because they cannot find success/error messages from form submission, despite the debug screenshots showing these messages are actually appearing on the page. The issue appears to be that the test selectors are not finding the messages quickly or reliably enough.

### Current State
- Messages are rendered in `cta-section.tsx` using `<BodyText>` components
- Messages don't have data-testid attributes for easy selection
- Tests are using various text selectors to find messages
- Tests fail in CI but pass locally, suggesting timing/performance differences

### Requirements
1. Add data-testid attributes to success and error messages
2. Update tests to use these data-testid selectors
3. Add explicit wait conditions with appropriate timeouts
4. Ensure tests work reliably in CI environment

### Design Considerations
- Maintain existing functionality while adding testing hooks
- Follow atomic design principles from development philosophy
- Keep tests readable and maintainable
- Handle both success and error message scenarios
- Ensure accessibility is maintained

### Implementation Plan
1. Add data-testid attributes to success/error messages in cta-section.tsx
2. Update CtaForm page object to use data-testid selectors
3. Update test cases to use new selectors and wait conditions
4. Add increased timeouts where appropriate
5. Test thoroughly in CI environment

### Success Criteria
- All form submission tests pass consistently in CI
- Messages are detected reliably regardless of timing
- No flaky test behavior
- Code follows development philosophy guidelines