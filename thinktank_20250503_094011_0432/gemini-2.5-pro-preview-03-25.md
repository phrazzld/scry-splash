Okay, here is a prioritized list of specific implementation tasks to address the theme detection issue on the Scry splash page, based on the consultant plan and the provided context.

**Goal:** Restore correct theme switching functionality (light/dark/system) on the splash page.
**Root Cause:** Hardcoded `className="dark"` in `app/layout.tsx`.

---

## Implementation Tasks: Fix Theme Detection

**Priority 1: Core Fixes & Initial Verification**

1.  **Task:** **Remove Hardcoded Dark Theme Class from Root Layout**
    *   **File:** `app/layout.tsx`
    *   **Action:** Locate the `<html>` or `<body>` tag within the `RootLayout` component. Remove the `className="dark"` attribute entirely.
    *   **Rationale:** This removes the direct conflict identified as the root cause, allowing the `ThemeProvider` to manage the theme class dynamically.
    *   **Verification:** After removal, the page *might* initially render in light mode (or system default) but likely still look broken until the provider is confirmed.

2.  **Task:** **Verify ThemeProvider Configuration and Placement**
    *   **File:** Likely `app/providers.tsx` or `app/layout.tsx` (wherever `ThemeProvider` is instantiated).
    *   **Action:** Ensure the `ThemeProvider` component (likely from `next-themes`) is correctly configured. Key props to verify:
        *   `attribute="class"` (Essential for Tailwind `dark:` variant strategy)
        *   `defaultTheme="system"` (Recommended default)
        *   `enableSystem` (Set to `true` to respect OS preference)
    *   **Action:** Confirm the `ThemeProvider` wraps the main content structure of the application, typically *inside* the `<body>` tag in `app/layout.tsx`.
    *   **Rationale:** Ensures the provider is set up to correctly apply theme classes based on system/user preference.

3.  **Task:** **Initial Manual Theme Switching Test**
    *   **Action:** After completing tasks 1 & 2, run the application locally. Use browser developer tools (Application > Storage > Local Storage - clear `theme` key if present) and OS settings (toggle light/dark mode) to test basic theme switching.
    *   **Expected:** The `<html>` tag should now dynamically receive `class="light"` or `class="dark"`. The background *should* attempt to change, though content might still be broken.
    *   **Rationale:** Quick validation that the core mechanism is unblocked.

**Priority 2: Component Styling & Verification**

4.  **Task:** **Verify Root Layout Base Styles**
    *   **File:** `app/layout.tsx` and `app/globals.css` (or Tailwind base layers)
    *   **Action:** Ensure the `<body>` tag (or a primary layout container) has appropriate default background and text colors applied using theme-aware Tailwind utilities (e.g., `bg-background text-foreground`).
    *   **Rationale:** Guarantees the base page background and default text color respond correctly to theme changes applied by the `ThemeProvider`.

5.  **Task:** **Inspect and Fix Logo Component Styling**
    *   **File:** Component file for the Logo (e.g., `components/ui/logo.tsx` or similar)
    *   **Action:** Examine the SVG or image element styling. Ensure its colors (e.g., `fill`, `stroke`) are defined using CSS variables or Tailwind classes that adapt to light/dark modes (e.g., using `text-foreground` or specific theme colors). Check if different assets are needed for light/dark.
    *   **Rationale:** Addresses the issue where the logo disappears in light mode.

6.  **Task:** **Inspect and Fix Headline Text Styling**
    *   **File:** Component file containing the main headline text.
    *   **Action:** Verify that the text color is applied using theme-aware Tailwind utilities (e.g., `text-foreground`, `text-primary`, `dark:text-some-color`). Avoid hardcoded color classes like `text-white` unless explicitly intended regardless of theme.
    *   **Rationale:** Addresses the issue where the headline text disappears in light mode.

7.  **Task:** **Verify CTA Button Styling**
    *   **File:** Component file for the CTA Button (likely using `shadcn/ui` Button).
    *   **Action:** Although visible, confirm the button's background color, text color, border, and hover/focus states adapt correctly according to the active theme, adhering to `shadcn/ui` theme variables.
    *   **Rationale:** Ensures consistency and that its visibility wasn't accidental due to non-theme-aware styling.

8.  **Task:** **Review Other Visible Components for Theme Compliance**
    *   **Action:** Briefly review any other visible UI elements on the splash page. Check their background, text, border colors, etc., ensuring they use theme-aware styles (Tailwind `dark:` variants or `shadcn/ui` conventions).
    *   **Rationale:** Catches any other components affected by the previous hardcoded theme.

**Priority 3: Testing & Cleanup**

9.  **Task:** **Comprehensive Theme Switching Test (Manual)**
    *   **Action:** Perform thorough testing:
        *   Toggle between Light, Dark, and System modes multiple times.
        *   Clear browser local storage (`theme` key) and refresh to test defaults.
        *   Verify in major browsers (Chrome, Firefox, Safari).
        *   Check responsiveness: ensure theme switching works correctly on mobile, tablet, and desktop viewport sizes.
    *   **Rationale:** Confirms the fix works reliably across different scenarios and environments.

10. **Task:** **Verify Tailwind Theme Configuration**
    *   **File:** `tailwind.config.js` (or `.ts`)
    *   **Action:** Review the `theme.extend.colors` (or equivalent) section, particularly the CSS variables defined for `shadcn/ui` (e.g., `--background`, `--foreground`, `--primary`, etc.). Ensure colors are correctly defined for *both* the base (light) and `.dark` selectors.
    *   **Rationale:** Ensures the underlying color palette used by components is correctly configured for both themes.

11. **Task:** **Code Cleanup and Documentation**
    *   **Action:**
        *   Remove any temporary CSS overrides or commented-out code related to attempts to fix the theme issue.
        *   Add a small code comment in `app/layout.tsx` near the `ThemeProvider` usage explaining that it dynamically manages the theme class on the `<html>` tag via the `attribute="class"` prop.
    *   **Rationale:** Improves maintainability and prevents future regressions by clarifying intent (aligns with Development Philosophy: Document the *Why*).

12. **Task:** **(Optional but Recommended) Add E2E Test for Theme Toggle**
    *   **Tool:** Playwright or Cypress
    *   **Action:** Create a simple E2E test that:
        *   Loads the splash page.
        *   Forces light mode (e.g., via local storage or a test utility).
        *   Asserts key elements (background, logo, headline) have light-mode appropriate styles (e.g., check computed background/color).
        *   Forces dark mode.
        *   Asserts key elements have dark-mode appropriate styles.
    *   **Rationale:** Provides automated regression testing for this core feature (aligns with Development Philosophy Appendix Frontend: Testing Strategy).

---

These tasks provide a clear path from identifying the core problem to verifying the fix across components and ensuring long-term maintainability.