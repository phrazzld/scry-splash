# Task ID: T011
# Title: integrate e2e tests into ci workflow
# Original Ticket Text:

- [ ] **T011 · Feature · P1: integrate e2e tests into ci workflow**
    - **Context:** Detailed Build Steps - Step 8
    - **Action:**
        1. Modify the existing CI workflow (e.g., `.github/workflows/test-coverage.yml` or a dedicated E2E workflow).
        2. Add job/steps for E2E tests: checkout code, set up Node.js and pnpm, install dependencies (`pnpm install`), install Playwright browsers (`pnpm playwright install --with-deps`), run E2E tests (`pnpm e2e`).
        3. Ensure the workflow step fails if `pnpm e2e` exits with a non-zero code.
        4. Upload Playwright HTML report and failure artifacts (traces, screenshots, diffs) as specified in the plan.
    - **Done‑when:**
        1. CI workflow executes E2E tests on relevant triggers (e.g., PRs).
        2. Test failures in CI cause the build/check to fail.
        3. HTML reports and failure artifacts are correctly uploaded to CI.
    - **Verification:**
        1. Trigger a CI run (e.g., by opening a PR with these changes).
        2. Observe E2E tests execute in the CI logs.
        3. If tests pass, confirm no failure artifacts are uploaded (other than the report).
        4. If tests fail (or a test is made to fail temporarily), confirm failure artifacts and the report are uploaded and accessible.
    - **Depends‑on:** [T002, T010, AUTO-003]

# Implementation Approach Analysis Prompt:

You are a senior software architect responsible for designing a robust implementation approach for a software development task. Your goal is to create a comprehensive plan that addresses all aspects of the implementation while adhering to the project's development philosophy and best practices.

## Task Details

The task you need to analyze is described above. Please carefully review the task ID, title, and original ticket text.

## Analysis Requirements

Please provide a detailed implementation approach that includes:

### 1. Architecture Analysis
- Identify the key architectural components involved
- Determine the appropriate patterns and structures to use
- Consider separation of concerns and modularity
- Evaluate impact on existing architecture

### 2. Technical Approach
- Break down the implementation into specific technical steps
- Identify the files that need to be created or modified
- Specify the technologies, libraries, and frameworks to use
- Consider performance implications and optimizations

### 3. Implementation Steps
- Provide a numbered, sequential list of implementation steps
- Each step should be concrete and actionable
- Include specific code patterns or structures where relevant
- Consider the order of implementation for maximum efficiency

### 4. Testing Strategy
- Determine what tests need to be written
- Specify test types (unit, integration, E2E) for each component
- Consider test coverage requirements
- Plan for both happy path and edge cases

### 5. Risk Assessment
- Identify potential risks or challenges
- Consider edge cases and error scenarios
- Evaluate security implications
- Plan mitigation strategies

### 6. Integration Considerations
- Analyze how the new code will integrate with existing systems
- Consider backward compatibility requirements
- Plan for configuration and deployment changes
- Evaluate impact on CI/CD pipelines

### 7. Documentation Needs
- Identify what documentation needs to be created or updated
- Consider both code documentation and user-facing docs
- Plan for configuration documentation
- Consider maintenance documentation

### 8. Success Criteria
- Define clear, measurable success criteria
- Align with the "Done-when" conditions from the ticket
- Include performance benchmarks if relevant
- Consider user experience metrics

## Constraints and Guidelines

Your approach must adhere to:
- The project's DEVELOPMENT_PHILOSOPHY.md principles
- Language-specific best practices (TypeScript, Go, etc.)
- The project's existing architectural patterns
- Security and performance requirements
- Testing coverage requirements (85%+ overall, 95%+ for core logic)

## Output Format

Present your analysis in markdown format with clear sections and subsections. Use bullet points for lists and include code examples where relevant.

Begin your response with a brief executive summary (2-3 sentences) of the recommended approach.