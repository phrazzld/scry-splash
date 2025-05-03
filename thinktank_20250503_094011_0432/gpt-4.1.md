Certainly! Below is a **prioritized, actionable task list** to address and resolve the system theme detection issue on the Scry splash page, as described. These tasks follow your development philosophy and frontend appendix guidelines.

---

## 1. Core Fixes for the Layout Component

**1.1. Remove Hardcoded Dark Class**
- [ ] **Remove** any hardcoded `className="dark"` from `app/layout.tsx`.
    - **Rationale:** This forces dark mode, breaking light mode and interfering with dynamic theming.
- [ ] **Ensure** the root `<html>` or `<body>` tag does **not** unconditionally apply the `dark` class.
    - If a theme class needs to be applied, it must be set dynamically.

**1.2. Use ThemeProvider Correctly**
- [ ] **Wrap** the application (likely in `app/layout.tsx` or a higher-order component) with the `ThemeProvider` (from `next-themes` or your chosen theming solution).
- [ ] **Ensure** the `ThemeProvider` is configured with:
    - `attribute="class"`
    - `defaultTheme="system"`
    - `enableSystem={true}`
    - (Adjust according to your theming library’s documentation.)
- [ ] **Verify** that the `ThemeProvider` is not nested multiple times or misconfigured.

---

## 2. Adjustments to the ThemeProvider

**2.1. Confirm ThemeProvider Placement**
- [ ] **Ensure** `ThemeProvider` is at the highest necessary level (usually directly in `layout.tsx`), so all components inherit theme context.

**2.2. Provider Configuration Review**
- [ ] **Review** ThemeProvider options for correct system theme detection and class application:
    - `attribute="class"` to apply `dark` or `light` class to the `<html>` or `<body>`.
    - `defaultTheme="system"` for system preference detection.
    - `enableSystem={true}` to actually respect system theme.

---

## 3. Component Styling Verification Steps

**3.1. Audit Tailwind/Dark Mode Styles**
- [ ] **Check** all affected components (logo, headline, backgrounds, etc.) for correct use of Tailwind’s `dark:` and `light:` variants.
    - **Example:** `className="text-black dark:text-white"`
- [ ] **Ensure** no color or background is hardcoded solely for dark mode.
- [ ] **Verify** that the logo and all text elements have both light and dark mode styles as appropriate.
- [ ] **Fix** any missing styles or conditional rendering issues that cause content to disappear in light mode.

**3.2. Storybook/Isolated Review**
- [ ] **Review** components in isolation (preferably in Storybook) to verify styling in both light and dark themes.

---

## 4. Testing Procedures for Theme Switching

**4.1. Manual QA**
- [ ] **Test** theme switching in the browser:
    - Change system theme from dark to light and vice versa.
    - Use any in-app theme toggles (if present) to verify correct switching.
    - **Expected:** All content (logo, headline, background, CTAs) is visible and styled correctly in both themes.

**4.2. Automated Testing**
- [ ] **Add/Update** integration tests to verify that:
    - The correct theme class is applied to the root element.
    - All key content is rendered and visible in both themes.
    - No elements are missing or invisible in either mode.
    - Use [React Testing Library](https://testing-library.com/) and E2E tools like Cypress if available.

**4.3. Accessibility and Contrast Checks**
- [ ] **Run** accessibility checks (e.g., Storybook a11y addon, axe-core) in both light and dark modes to ensure color contrast and visibility meet requirements.

---

## 5. Recommended Cleanup for Maintainability

**5.1. Remove Dead/Redundant Code**
- [ ] **Delete** any obsolete theme toggling logic, unused classes, or commented-out code related to old theme handling.

**5.2. Document Theme Approach**
- [ ] **Add** a short code comment or documentation (e.g., in README or a theming.md) explaining:
    - How theme detection is handled.
    - Where and how to change theming logic if needed.

**5.3. Lint and Format**
- [ ] **Run** Prettier and ESLint to maintain code style consistency and catch any minor issues.

**5.4. Storybook Stories**
- [ ] **Ensure** Storybook stories exist for all key components, demonstrating both light and dark themes as per the frontend appendix.

---

## Summary Checklist

- [ ] Remove hardcoded `dark` class from layout
- [ ] Ensure correct ThemeProvider usage and settings
- [ ] Audit and fix component styles for both themes
- [ ] Manually and automatically test theme switching
- [ ] Remove dead code and document theme approach
- [ ] Ensure Storybook visual coverage for both themes

---

**By completing these tasks in order, you will restore dynamic, system-respecting theme support and adhere to project standards for maintainability, testability, and accessibility.**