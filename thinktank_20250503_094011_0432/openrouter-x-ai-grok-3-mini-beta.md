Below is a prioritized list of specific implementation tasks to address the system theme detection issue in the Scry splash page, as identified in the consultant plan (CONSULTANT-PLAN.md). These tasks are derived from the core problem (hardcoded `className="dark"` in `app/layout.tsx` conflicting with ThemeProvider's dynamic theme handling) and align with the development philosophy outlined in the provided context. This includes principles like Atomic Design, Storybook-First development, strict TypeScript practices, and a focus on modularity, testability, and maintainability.

The tasks are structured as actionable items suitable for tracking in a todo list. Each task includes:
- **Priority Level**: Based on urgency and dependency (e.g., core fixes first).
- **Task Description**: Clear, step-by-step instructions.
- **Estimated Effort**: A rough estimate to aid planning.
- **Dependencies/References**: Links to relevant philosophy or context for adherence.
- **Acceptance Criteria**: Conditions for marking the task as complete.

This prioritization starts with immediate fixes to resolve the root cause, followed by adjustments, verification, testing, and finally cleanup to ensure long-term maintainability.

### Prioritized Task List

1. **Fix Hardcoded Class in Layout Component**  
   **Priority Level**: High (Core fix; addresses the root cause directly).  
   **Task Description**:  
   - Locate the `app/layout.tsx` file and remove or dynamically replace the hardcoded `className="dark"`.  
   - Replace it with a dynamic class based on the ThemeProvider's state (e.g., use a hook or context to apply classes like `className={theme === 'light' ? 'light' : 'dark'}`).  
   - Ensure the layout component adheres to Atomic Design principles by treating it as an "Organism" that composes Atoms (e.g., logo, headline) and ensures proper theme propagation.  
   - Update any related TypeScript types to maintain strict typing (e.g., define a type for theme states).  
   **Estimated Effort**: 1-2 hours.  
   **Dependencies/References**: Aligns with DEVELOPMENT_PHILOSOPHY.md (Core Principles: Simplicity First, Modularity is Mandatory) and DEVELOPMENT_PHILOSOPHY_APPENDIX_FRONTEND.md (Section 1: Atomic Design).  
   **Acceptance Criteria**: The layout renders correctly in both light and dark modes without missing content (e.g., logo and headline are visible in light mode), and the code passes TypeScript checks with no 'any' types.

2. **Adjust ThemeProvider for Dynamic Theme Handling**  
   **Priority Level**: High (Directly supports the core fix and ensures proper integration).  
   **Task Description**:  
   - Review the ThemeProvider component to confirm it's correctly managing theme state (e.g., using React Context or a state management library like Zustand as per frontend philosophy).  
   - If needed, add logic to handle theme switching more robustly, such as subscribing to system preferences or user settings and applying classes globally.  
   - Ensure the ThemeProvider is an "Atom" or "Molecule" in Atomic Design, keeping it stateless and reusable.  
   - Test for conflicts by simulating theme changes and verifying that the provider overrides any static classes.  
   **Estimated Effort**: 1-2 hours.  
   **Dependencies/References**: References DEVELOPMENT_PHILOSOPHY_APPENDIX_FRONTEND.md (Section 5: State Management) for using Context API or TanStack Query; ensure no implicit dependencies as per Core Principles (Explicit is Better than Implicit).  
   **Acceptance Criteria**: ThemeProvider successfully applies dynamic classes (e.g., 'light' mode shows a light background and full content), and the component is documented in Storybook with props API.

3. **Verify Component Styling Post-Fix**  
   **Priority Level**: Medium (Ensures visual correctness after core changes).  
   **Task Description**:  
   - Manually inspect all splash page components (e.g., logo, headline, CTA button) in both light and dark modes using Tailwind CSS classes for consistency.  
   - Confirm that dark mode elements (e.g., background) adapt correctly without overriding the new dynamic classes.  
   - Use Storybook to isolate and review components, ensuring they support both modes as required (e.g., check for sufficient color contrast per Accessibility guidelines).  
   - If issues arise, refine Tailwind configurations or shadcn/ui extensions to maintain design tokens.  
   **Estimated Effort**: 1 hour.  
   **Dependencies/References**: Aligns with DEVELOPMENT_PHILOSOPHY_APPENDIX_FRONTEND.md (Section 3: UI Library and Styling, Section 7: Accessibility) and Section 8: Responsive Design for multi-mode verification.  
   **Acceptance Criteria**: All components render as expected in light mode (no missing elements, proper background), and Storybook stories for each variant pass visual and accessibility checks.

4. **Implement Testing Procedures for Theme Switching**  
   **Priority Level**: Medium (Verifies the fix and prevents regressions).  
   **Task Description**:  
   - Write unit tests for the layout component and ThemeProvider using React Testing Library, covering theme switch scenarios (e.g., simulate user preference changes).  
   - Add integration tests to ensure the splash page components (as Organisms) respond correctly to theme changes.  
   - Include E2E tests using Cypress or Playwright to simulate real user flows, such as switching themes and verifying content visibility.  
   - Enforce coverage thresholds (e.g., 90% for components) and integrate with CI pipeline for automated runs.  
   **Estimated Effort**: 2-3 hours.  
   **Dependencies/References**: Follows DEVELOPMENT_PHILOSOPHY.md (Testing Strategy: Design for Testability, no mocking internal collaborators) and DEVELOPMENT_PHILOSOPHY_APPENDIX_FRONTEND.md (Section 4: Testing Strategy).  
   **Acceptance Criteria**: Tests pass in CI, covering all variants (e.g., light mode loads full content), and coverage reports meet or exceed thresholds (e.g., 90% for atoms/molecules).

5. **Perform Cleanup for Maintainability**  
   **Priority Level**: Low (Polishes the code after fixes are verified).  
   **Task Description**:  
   - Remove any unused code or comments related to the original hardcoded class in `app/layout.tsx`.  
   - Refactor for modularity, ensuring the layout and ThemeProvider follow feature-based folder structure and immutability patterns.  
   - Update documentation in Storybook and relevant files (e.g., add TSDoc comments explaining theme logic).  
   - Run linters and formatters (e.g., Prettier, ESLint) to enforce standards, and ensure no suppressions are used.  
   - Conduct a quick audit for potential improvements, such as adding type guards for theme states.  
   **Estimated Effort**: 1 hour.  
   **Dependencies/References**: Aligns with DEVELOPMENT_PHILOSOPHY.md (Core Principles: Simplicity First, Automate Everything) and DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md (Sections 2-5: Formatting, Linting, Types).  
   **Acceptance Criteria**: Codebase is lint-free, documentation is updated, and the solution is modular (e.g., no circular dependencies, all changes follow Atomic Design).

### Additional Notes
- **Overall Prioritization Rationale**: This order ensures that critical fixes are addressed first to unblock the system, followed by verification and testing to confirm reliability, and ending with cleanup to align with long-term maintainability goals.
- **Alignment with Development Philosophy**: All tasks emphasize simplicity, modularity, and testability as per DEVELOPMENT_PHILOSOPHY.md. For instance, tasks avoid over-engineering (e.g., no unnecessary mocks) and promote automation (e.g., CI-integrated testing).
- **Tracking Recommendations**: Use a tool like Jira, Trello, or GitHub Issues to track these tasks. Assign owners, set deadlines, and link to pull requests for each task.
- **Potential Risks**: If ThemeProvider adjustments reveal broader issues, escalate to a follow-up review. Always run these tasks in a development branch and merge only after passing CI checks.

This list provides a complete, self-contained plan to resolve the theme detection issue while adhering to the project's standards. If you need further details or adjustments based on CONSULTANT-PLAN.md, let me know.