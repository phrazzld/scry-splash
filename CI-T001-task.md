# Task ID: CI-T001
# Title: debug form submission test failures
# Original Ticket Text:

- [ ] **CI-T001 · Debug · P0: debug form submission test failures**
    - **Context:** Form submission tests fail to find success/error messages in CI
    - **Action:**
        1. Add debug logging to CTA form tests to capture actual page content
        2. Add console.log before and after form submission
        3. Capture page HTML when test fails
        4. Check network tab for actual API responses
    - **Done‑when:**
        1. Debug information is captured in test failures
        2. Root cause of missing messages is identified
    - **Verification:**
        1. Run tests locally with debug mode
        2. Review CI logs for diagnostic information
    - **Depends‑on:** none

# Implementation Approach Analysis Prompt:

You are a senior software architect responsible for designing a robust debugging approach for failing E2E tests. Your goal is to systematically add diagnostic capabilities to understand why form submission tests are failing in CI but potentially passing locally.

## Current Situation
- Form submission tests for both success and error cases fail to find expected messages in CI
- Tests may be passing locally (macOS) but failing in CI (Linux)
- The application uses Playwright for E2E testing
- Form submission goes to a mocked Formspark API
- Tests expect specific success/error messages to appear after submission

## Required Debug Information
1. Actual page content when test fails
2. Network requests and responses
3. Console logs from the browser
4. Timing of events
5. Element visibility states

## Task Details
The task requires adding comprehensive debugging to understand:
- What HTML content is actually present when tests fail
- Whether form submission requests are being made
- What responses are being received
- Any JavaScript errors or warnings
- Timing issues between form submission and message display

## Analysis Requirements
Please provide a detailed debugging approach that includes:

### 1. Debug Logging Strategy
- Where to add logging statements
- What information to capture
- How to structure debug output
- Capture mechanisms for different failure types

### 2. Page Content Analysis
- Methods to capture full page HTML
- Screenshots at key points
- Element state inspection
- DOM structure verification

### 3. Network Monitoring
- Request/response interception
- API mock verification
- Response timing analysis
- Request payload validation

### 4. Error Handling Enhancement
- Browser console capture
- JavaScript error monitoring
- Timeout information
- Stack trace collection

### 5. Implementation Steps
- Specific code changes needed
- Files to modify
- Debug output format
- CI log integration

### 6. Local vs CI Comparison
- Environment differences to check
- Platform-specific issues
- Configuration variations
- Timing differences

### 7. Success Criteria
- What constitutes sufficient debug information
- How to identify root cause
- Next steps after debugging

## Constraints
- Changes should not affect production code
- Debug output must be readable in CI logs
- Should not significantly slow down tests
- Must work across all browsers (Chrome, Firefox, Safari/WebKit)

## Output Format
Present your analysis in markdown format with clear sections and code examples where relevant.