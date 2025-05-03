# Task List for Fixing System Theme Detection Issue in Scry Splash Page

Below is a prioritized list of specific, actionable tasks to address the system theme detection issue in the Scry splash page, based on the identified root cause (hardcoded `className="dark"` in `app/layout.tsx`) and adhering to the guidelines provided in the development philosophy documents. These tasks are structured to ensure a systematic resolution of the issue, maintainability, and thorough testing.

## Priority 1: Core Fixes for Layout Component
These tasks address the root cause directly and are critical to resolving the theme detection issue.

- **Task 1.1: Remove Hardcoded Theme Class in `app/layout.tsx`**
  - **Description:** Update the `app/layout.tsx` file to remove the hardcoded `className="dark"` from the root HTML or body element. Replace it with a dynamic class based on the theme context provided by the `ThemeProvider`.
  - **Action:** Modify the root element to use a dynamic class, e.g., `className={themeClass}` where `themeClass` is derived from the `ThemeProvider` context or a state variable.
  - **Owner:** Frontend Developer
  - **Estimated Time:** 1 hour
  - **Acceptance Criteria:** The root element no longer has a static `className="dark"` and reflects the current theme dynamically.

- **Task 1.2: Ensure Proper Theme Context Propagation**
  - **Description:** Verify that the `ThemeProvider` wraps the entire application in `app/layout.tsx` to ensure theme context is available to all components.
  - **Action:** Check and, if necessary, adjust the structure of `app/layout.tsx` to confirm that `ThemeProvider` is at the top level, wrapping all child components.
  - **Owner:** Frontend Developer
  - **Estimated Time:** 30 minutes
  - **Acceptance Criteria:** `ThemeProvider` is correctly implemented as the top-level wrapper in `app/layout.tsx`.

## Priority 2: Adjustments to ThemeProvider
These tasks ensure the `ThemeProvider` is correctly configured to handle system theme detection and user preferences.

- **Task 2.1: Implement System Theme Detection Logic in `ThemeProvider`**
  - **Description:** Ensure the `ThemeProvider` component detects the user's system theme preference (light or dark mode) using `prefers-color-scheme` media queries and applies the appropriate theme class.
  - **Action:** Update or create a custom `ThemeProvider` to include logic for detecting system theme preferences and setting the initial theme state accordingly.
  - **Owner:** Frontend Developer
  - **Estimated Time:** 2 hours
  - **Acceptance Criteria:** `ThemeProvider` automatically detects and applies the system theme on initial load, verified via browser developer tools.

- **Task 2.2: Support User Theme Preference Override**
  - **Description:** Add functionality to `ThemeProvider` to allow users to override the system theme with a manual selection (e.g., via a toggle or setting stored in localStorage).
  - **Action:** Implement logic to store and retrieve user theme preferences in localStorage, ensuring it takes precedence over system detection when set.
  - **Owner:** Frontend Developer
  - **Estimated Time:** 2 hours
  - **Acceptance Criteria:** Users can manually switch themes, and the preference persists across page reloads, verified by toggling themes and refreshing the page.

## Priority 3: Component Styling Verification Steps
These tasks ensure that all components render correctly under both light and dark themes after the core fix.

- **Task 3.1: Verify Splash Page Component Styling for Light and Dark Modes**
  - **Description:** Manually inspect and verify that all elements on the splash page (logo, headline text, CTA button, background) render correctly in both light and dark modes.
  - **Action:** Review CSS/Tailwind classes used in splash page components to ensure they support theme-specific styling (e.g., using `dark:` prefix for dark mode styles).
  - **Owner:** Frontend Developer
  - **Estimated Time:** 1 hour
  - **Acceptance Criteria:** All splash page elements (logo, headline, CTA button, background) display correctly in both themes with appropriate colors and visibility.

- **Task 3.2: Audit Other Components for Theme Compatibility**
  - **Description:** Perform a quick audit of other application components to ensure they also respect the dynamic theme class and do not rely on hardcoded theme assumptions.
  - **Action:** Check key UI components for Tailwind theme prefixes (`dark:`) or CSS variables that adapt to the theme, and log any issues for future fixes if unrelated to the splash page.
  - **Owner:** Frontend Developer
  - **Estimated Time:** 1.5 hours
  - **Acceptance Criteria:** A list of components with potential theme issues is documented, with immediate fixes applied to splash page-related components.

## Priority 4: Testing Procedures for Theme Switching
These tasks ensure the theme switching functionality is robust and reliable across different scenarios.

- **Task 4.1: Write Unit Tests for `ThemeProvider` Logic**
  - **Description:** Create unit tests for the `ThemeProvider` to verify system theme detection and user preference override functionality.
  - **Action:** Use React Testing Library to write tests that mock `prefers-color-scheme` and localStorage values, asserting correct theme application.
  - **Owner:** QA Engineer / Frontend Developer
  - **Estimated Time:** 3 hours
  - **Acceptance Criteria:** Unit tests pass, covering system theme detection and user override scenarios with at least 90% coverage.

- **Task 4.2: Implement Integration Tests for Splash Page Theme Rendering**
  - **Description:** Develop integration tests to confirm that the splash page renders correctly under different theme conditions (system light/dark, user override).
  - **Action:** Use a testing framework like Cypress or Playwright to simulate theme changes and assert visibility and styling of key elements (logo, headline, CTA, background).
  - **Owner:** QA Engineer
  - **Estimated Time:** 3 hours
  - **Acceptance Criteria:** Integration tests pass, verifying correct rendering of splash page elements in all theme scenarios.

- **Task 4.3: Conduct Manual Cross-Browser Testing for Theme Switching**
  - **Description:** Perform manual testing across major browsers (Chrome, Firefox, Safari, Edge) to ensure theme detection and switching work consistently.
  - **Action:** Test system theme detection by changing OS-level theme settings and verify user override functionality via UI controls, noting any discrepancies.
  - **Owner:** QA Engineer
  - **Estimated Time:** 2 hours
  - **Acceptance Criteria:** Theme switching works consistently across all tested browsers, with any issues documented for resolution.

## Priority 5: Cleanup for Maintainability
These tasks improve code quality and documentation to prevent future issues and align with the development philosophy.

- **Task 5.1: Document Theme Switching Implementation in Codebase**
  - **Description:** Add inline comments and update relevant documentation (e.g., README or component docs) to explain the theme detection and switching mechanism.
  - **Action:** Document the purpose and usage of `ThemeProvider` in code comments (using TSDoc) and update project documentation if applicable.
  - **Owner:** Frontend Developer
  - **Estimated Time:** 1 hour
  - **Acceptance Criteria:** Theme switching logic is clearly documented in code and any relevant project docs.

- **Task 5.2: Refactor Theme-Related Code for Clarity**
  - **Description:** Review and refactor theme-related code in `ThemeProvider` and `app/layout.tsx` to ensure adherence to simplicity, modularity, and explicitness principles.
  - **Action:** Break down complex logic into smaller, pure functions if needed, and ensure clear naming and type definitions per TypeScript standards.
  - **Owner:** Frontend Developer
  - **Estimated Time:** 1.5 hours
  - **Acceptance Criteria:** Code passes linting and type-checking with strict settings, and is reviewed for clarity and modularity.

- **Task 5.3: Add Storybook Stories for Theme Variations**
  - **Description:** Create Storybook stories for the splash page and other key components to showcase their appearance in both light and dark modes.
  - **Action:** Implement stories that render components under different theme contexts, allowing for visual testing and review.
  - **Owner:** Frontend Developer
  - **Estimated Time:** 2 hours
  - **Acceptance Criteria:** Storybook stories for splash page components are created and display correctly in both themes.

## Summary of Priorities and Timeline
- **Priority 1 (Core Fixes):** 1.5 hours
- **Priority 2 (ThemeProvider Adjustments):** 4 hours
- **Priority 3 (Styling Verification):** 2.5 hours
- **Priority 4 (Testing Procedures):** 8 hours
- **Priority 5 (Cleanup):** 4.5 hours
- **Total Estimated Time:** 20.5 hours

These tasks are designed to be tracked in a todo list or project management tool, with clear ownership and acceptance criteria to ensure accountability and completion. They align with the development philosophy's emphasis on simplicity, testability, automation (via CI checks for tests), and documentation.