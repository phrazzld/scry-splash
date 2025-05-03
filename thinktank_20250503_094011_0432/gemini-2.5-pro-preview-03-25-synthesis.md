Okay, here is a synthesized, prioritized list of specific implementation tasks to fix the system theme detection issue on the Scry splash page, incorporating the best insights from the provided model outputs and aligning with standard web development practices.

**Goal:** Restore correct light/dark/system theme detection and rendering on the splash page by removing the hardcoded `dark` class and ensuring the `ThemeProvider` correctly manages theme application.
**Root Cause:** Hardcoded `className="dark"` in `app/layout.tsx` conflicts with dynamic theme management.

---

### Implementation Tasks: Fix Theme Detection

**Priority 1: Core Fixes & Provider Setup** (Address the root cause and enable dynamic theming)

1.  **Task: Remove Hardcoded Dark Class from Root Layout**
    *   **File:** `app/layout.tsx`
    *   **Action:** Locate the root `<html>` element (or potentially `<body>` depending on setup) within the `RootLayout` component. Remove the hardcoded `className="dark"` attribute entirely.
    *   **Rationale:** Directly removes the conflict preventing the `ThemeProvider` from working correctly.

2.  **Task: Verify & Configure ThemeProvider**
    *   **File:** Likely `app/providers.tsx` or `app/layout.tsx` (where `ThemeProvider` is instantiated).
    *   **Action:**
        *   Ensure the `ThemeProvider` component (likely from `next-themes`) correctly wraps the main page content (`children`) within `app/layout.tsx`, usually inside the `<body>`.
        *   Verify its configuration includes:
            *   `attribute="class"` (Essential for applying `light`/`dark` class to the `<html>` tag for Tailwind).
            *   `defaultTheme="system"` (Recommended default to respect OS preference).
            *   `enableSystem={true}` (Crucial for detecting and applying the system theme).
    *   **Rationale:** Ensures the provider is correctly set up to detect themes and apply the necessary class to the root element.

3.  **Task: Verify Tailwind Dark Mode Configuration**
    *   **File:** `tailwind.config.js` (or `.ts`)
    *   **Action:** Confirm that `darkMode: 'class'` is set in the Tailwind configuration.
    *   **Rationale:** Ensures Tailwind's `dark:` variants will respond to the `dark` class applied by the `ThemeProvider`.

4.  **Task: (Optional but Recommended) Implement Anti-FOUC Script**
    *   **File:** Potentially `app/layout.tsx` head, or `_document.tsx` if using Pages Router conventions alongside App Router, or via `next-themes` specific guidance.
    *   **Action:** Add a small, blocking script in the `<head>` to read the theme from `localStorage` (if applicable) or system preference *before* React hydrates, applying the correct class (`light` or `dark`) immediately to the `<html>` tag. Refer to `next-themes` documentation for the recommended snippet.
    *   **Rationale:** Prevents a "Flash Of Unstyled Content" (FOUC) where the default (often light) theme appears briefly before the correct theme is applied via JavaScript.

**Priority 2: Component Styling Verification & Fixes** (Ensure components render correctly in both themes)

5.  **Task: Verify Base Layout Styles**
    *   **File:** `app/globals.css` and `app/layout.tsx`
    *   **Action:** Ensure the `<body>` tag and/or main layout container have appropriate default background and text colors using theme-aware utilities (e.g., Tailwind classes like `bg-background text-foreground` if using `shadcn/ui` conventions, or standard `bg-white dark:bg-black text-black dark:text-white`).
    *   **Rationale:** Guarantees the base page appearance responds correctly to the theme class.

6.  **Task: Fix Splash Page Logo Styling**
    *   **File:** Logo component file (e.g., `components/ui/logo.tsx`).
    *   **Action:** Inspect the logo (SVG, Image). Ensure its visibility and colors (e.g., `fill`, `stroke`, `filter`) adapt correctly. Use CSS variables, `currentColor`, or theme-aware Tailwind classes (`fill-black dark:fill-white`). Check if separate light/dark assets are needed or if CSS can handle it.
    *   **Rationale:** Addresses the specific issue of the logo disappearing in light mode.

7.  **Task: Fix Splash Page Headline Text Styling**
    *   **File:** Component containing the headline.
    *   **Action:** Verify the headline's `color` is set using theme-aware Tailwind classes (e.g., `text-foreground`, `text-neutral-900 dark:text-neutral-100`). Avoid hardcoded colors like `text-white` unless intended for both themes. Ensure sufficient contrast in both modes.
    *   **Rationale:** Addresses the specific issue of the headline disappearing in light mode.

8.  **Task: Verify CTA Button Styling**
    *   **File:** CTA Button component file.
    *   **Action:** Although previously visible, confirm the button's background, text, border, and hover/focus states use theme-aware styles (likely leveraging `shadcn/ui` variants/variables or explicit `dark:` prefixes) and appear correctly in *both* light and dark modes.
    *   **Rationale:** Ensures consistency and correct light-mode appearance.

9.  **Task: Review Other Splash Page Elements**
    *   **Action:** Briefly scan any other UI elements on the splash page for correct theme-aware styling (backgrounds, borders, text).
    *   **Rationale:** Catches any other elements inadvertently affected by the hardcoded theme.

**Priority 3: Testing Procedures** (Verify functionality and prevent regressions)

10. **Task: Comprehensive Manual Theme Testing**
    *   **Action:** Test thoroughly in the browser:
        *   Toggle OS theme between light/dark multiple times; verify the page updates.
        *   Use any in-app theme toggle (if available).
        *   Clear `localStorage` (`theme` key) and refresh to test default/system behavior.
        *   Verify in target browsers (Chrome, Firefox, Safari).
        *   Check visual correctness (colors, visibility) of logo, headline, background, CTA in all states.
    *   **Rationale:** Confirms the end-to-end user experience is correct.

11. **Task: Add Automated E2E Theme Tests**
    *   **Tool:** Cypress or Playwright.
    *   **Action:** Create E2E tests that:
        *   Load the splash page.
        *   Programmatically set the theme to 'light' (e.g., via `localStorage` or mocking `prefers-color-scheme`).
        *   Assert key elements (logo, headline, background) are visible and have appropriate light-mode styles (e.g., check computed CSS `background-color`, `color`).
        *   Repeat for 'dark' mode.
    *   **Rationale:** Provides automated regression checks in the CI/CD pipeline.

12. **Task: (Optional) Add Unit/Integration Tests for Theme Hook/Context**
    *   **Tool:** Jest/Vitest + React Testing Library.
    *   **Action:** If custom theme hooks or complex context logic exists, add tests to verify their state management and output under different conditions.
    *   **Rationale:** Isolates and tests the core theme logic.

13. **Task: Accessibility Check**
    *   **Tool:** Browser dev tools, axe-core, Storybook a11y addon.
    *   **Action:** Verify color contrast ratios and general accessibility compliance for key elements in *both* light and dark modes.
    *   **Rationale:** Ensures the site remains usable for everyone.

**Priority 4: Cleanup & Maintainability** (Improve code quality and documentation)

14. **Task: Code Cleanup**
    *   **Action:** Remove any temporary CSS overrides, commented-out code, or console logs related to debugging the theme issue. Run linters (ESLint) and formatters (Prettier).
    *   **Rationale:** Keeps the codebase clean and consistent.

15. **Task: Update Documentation**
    *   **Action:** Add a brief comment in `app/layout.tsx` explaining the `ThemeProvider` setup. If significant changes were made, update relevant internal docs (e.g., `README.md`, frontend philosophy appendix) regarding the theme implementation pattern.
    *   **Rationale:** Ensures future developers understand the theme system.

16. **Task: Verify/Update Storybook Stories**
    *   **Action:** Ensure Storybook stories exist for key splash page components and that they correctly display both light and dark theme variants (using theme toggle addons if available).
    *   **Rationale:** Provides visual documentation and testing environment, aligning with dev philosophy.

---

This structured list provides a clear path to resolving the theme issue, verifying the fix, and ensuring the solution is robust and maintainable.