Okay, based on the consultant's finding about the hardcoded `className="dark"` in `app/layout.tsx` and the project's development philosophies (especially the frontend appendix mentioning dark mode support, Tailwind, shadcn/ui, and testing), here is a prioritized list of specific implementation tasks to fix the splash page theme detection issue.

**Problem:** Hardcoded `className="dark"` on the root element prevents `ThemeProvider` from correctly applying the `light` class, causing styling issues and content disappearance in light mode.

**Goal:** Remove the hardcoded class and ensure the `ThemeProvider` correctly manages the theme class on the root element (`<html>`), restoring proper light mode appearance while retaining dark mode functionality.

---

### Implementation Tasks

**Priority 1: Core Fixes & Provider Verification**

1.  **Task:** Remove Hardcoded Dark Class
    *   **Description:** Locate the `app/layout.tsx` file. Identify the root HTML element (likely `<html>`) and remove the hardcoded `className="dark"` attribute.
    *   **Rationale:** This directly addresses the root cause identified by the consultant. The theme provider should dynamically manage this class.
    *   **File:** `app/layout.tsx`

2.  **Task:** Verify ThemeProvider Placement and Configuration
    *   **Description:** In `app/layout.tsx` (or the component it renders that wraps the page content), ensure the `ThemeProvider` component is correctly placed high in the component tree, wrapping the content that requires theme context. Verify its configuration includes `attribute="class"` (to apply the theme class to the `<html>` element) and appropriate `defaultTheme` and `enableSystem` settings according to project requirements.
    *   **Rationale:** The provider needs to wrap the components whose styling depends on the theme class, and it must be configured to target the correct HTML attribute (`class`) on the root element (`html`).

**Priority 2: Component Styling Verification**

3.  **Task:** Manually Verify Splash Page Components in Light Mode
    *   **Description:** With the hardcoded class removed and `ThemeProvider` configured, load the splash page with the system theme set to 'light' (or explicitly set the theme to 'light' if a toggle exists). Visually inspect all components on the page.
    *   **Verification Steps:**
        *   Confirm the background is light, not dark.
        *   Confirm the logo is visible and correctly styled for light mode.
        *   Confirm the headline text is visible and correctly styled for light mode.
        *   Confirm the CTA button is visible and correctly styled (it was already visible, but check its light mode appearance).
        *   Check any other visible elements for correct light mode styling (text colors, border colors, etc.).
    *   **Rationale:** This confirms that removing the conflict allows the existing light mode styles (defined via Tailwind defaults) to take effect.

4.  **Task:** Verify Splash Page Components in Dark Mode
    *   **Description:** Load the splash page with the system theme set to 'dark' (or explicitly set the theme to 'dark'). Visually inspect all components.
    *   **Verification Steps:**
        *   Confirm the background is dark.
        *   Confirm the logo, headline, and CTA button are visible and correctly styled for dark mode (using `dark:` prefixed Tailwind classes).
    *   **Rationale:** Ensure the fix for light mode hasn't inadvertently broken dark mode.

5.  **Task:** Inspect Component Tailwind Classes for Theme Support
    *   **Description:** If components are still not displaying correctly after tasks 1-4, inspect the source code of the main splash page components (layout container, logo, headline, CTA, etc.). Verify that Tailwind classes are correctly used for both default (light mode) and `dark:` prefixed styles, especially for `background-color`, `color`, and `display` properties.
    *   **Rationale:** Ensure components adhere to the project's Tailwind/dark mode convention (`DEVELOPMENT_PHILOSOPHY_APPENDIX_FRONTEND.md`) and are prepared to receive styling based on the `light` or `dark` class on `<html>`.

**Priority 3: Testing Procedures**

6.  **Task:** Implement Manual Theme Switching Test
    *   **Description:** If the splash page includes a theme toggle component, manually interact with it in the browser. Toggle from light to dark and dark to light.
    *   **Verification Steps:** Confirm the page visually transitions correctly between themes and all content remains visible and appropriately styled throughout the transition.
    *   **Rationale:** Validates the interactive theme switching behavior.

7.  **Task:** Add Automated E2E Theme Tests
    *   **Description:** According to the `DEVELOPMENT_PHILOSOPHY_APPENDIX_FRONTEND.md` (E2E mandatory for critical flows), add End-to-End tests (using Cypress or Playwright) for the splash page that specifically verify appearance in both light and dark modes. This might involve setting local storage or using query parameters depending on the `ThemeProvider` implementation.
    *   **Verification Steps:** Assert the presence and visibility of key elements (logo, headline, CTA) and check for correct background/text colors in both theme states. Integrate with visual regression testing if available (e.g., Chromatic) to catch subtle styling issues.
    *   **Rationale:** Provides automated verification in the CI pipeline that theme switching works reliably and prevents regressions.

**Priority 4: Cleanup for Maintainability**

8.  **Task:** Run Linters and Formatters
    *   **Description:** Ensure the modified `app/layout.tsx` and any other changed files adhere to code style standards by running ESLint (`eslint`) and Prettier (`prettier`). (This should be enforced by pre-commit hooks and CI as per `DEVELOPMENT_PHILOSOPHY.md`, but list as a final check).
    *   **Rationale:** Maintain code consistency and readability.

9.  **Task:** Remove Dead Code/Comments
    *   **Description:** Remove any temporary debugging code, commented-out sections related to the old hardcoded class, or redundant comments.
    *   **Rationale:** Keep the codebase clean and reduce confusion.

10. **Task:** Update Documentation (If Necessary)
    *   **Description:** If the `ThemeProvider` setup or theme implementation pattern required clarification or adjustment during this fix, update relevant internal documentation (e.g., frontend appendix, specific component docs, architecture notes) to reflect the correct standard.
    *   **Rationale:** Ensure documentation remains accurate and helpful for future development.

---

This prioritized list provides a clear path to addressing the theme issue, starting with the core problem and moving through verification, testing, and cleanup, aligning with the project's stated philosophies.