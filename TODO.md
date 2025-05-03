# TODO

- [x] make "remember everything" come in on a typewriter animation
- [x] make "remember everything" typewriter animation actually cycle through a set of phrases
    - ✓ remember birthdays
    - ✓ remember important dates
    - ✓ remember key insights
    - ✓ remember effortlessly
    - ✓ remember everything
- [x] add a tasteful footer
    - ✓ a misty step project
- [x] rework cta to be simple input + button combo

## System Theme Detection

- [x] **T001: Remove Hardcoded Dark Class from Root Layout**
  **Priority:** High
  **Action:** Remove the hardcoded `className="dark"` from the `<html>` element in `app/layout.tsx`
  **Depends On:** None
  **AC Ref:** None

- [x] **T002: Verify & Configure ThemeProvider**
  **Priority:** High
  **Action:** Ensure the `ThemeProvider` component is correctly configured with `attribute="class"`, `defaultTheme="system"`, and `enableSystem={true}`
  **Depends On:** T001
  **AC Ref:** None

- [x] **T003: Verify Tailwind Dark Mode Configuration**
  **Priority:** High
  **Action:** Confirm that `darkMode: 'class'` is set in the Tailwind configuration (`tailwind.config.js`)
  **Depends On:** None
  **AC Ref:** None

- [x] **T004: Implement Anti-FOUC Script**
  **Priority:** Medium
  **Action:** Add a script in the `<head>` to read the theme from localStorage or system preference and apply the correct class before React hydrates
  **Depends On:** T001, T002
  **AC Ref:** None

- [x] **T005: Verify Base Layout Styles**
  **Priority:** Medium
  **Action:** Ensure the `<body>` tag and main layout container use theme-aware utilities like `bg-background text-foreground`
  **Depends On:** T001, T002, T003
  **AC Ref:** None

- [x] **T006: Fix Splash Page Logo Styling**
  **Priority:** High
  **Action:** Update the logo component to ensure its visibility and colors adapt correctly to both light and dark themes
  **Depends On:** T001, T002, T003
  **AC Ref:** None

- [x] **T007: Fix Splash Page Headline Text Styling**
  **Priority:** High
  **Action:** Verify the headline text uses theme-aware color classes to ensure visibility in both light and dark modes
  **Depends On:** T001, T002, T003
  **AC Ref:** None

- [x] **T008: Verify CTA Button Styling**
  **Priority:** Medium
  **Action:** Confirm the button's background, text, border, and hover/focus states use theme-aware styles and appear correctly in both themes
  **Depends On:** T001, T002, T003
  **AC Ref:** None

- [x] **T009: Review Other Splash Page Elements**
  **Priority:** Medium
  **Action:** Scan other UI elements for correct theme-aware styling (backgrounds, borders, text)
  **Depends On:** T001, T002, T003
  **AC Ref:** None

- [x] **T010: Comprehensive Manual Theme Testing**
  **Priority:** High
  **Action:** Test OS theme toggling, in-app theme toggle, localStorage reset, and verify in multiple browsers
  **Depends On:** T001, T002, T003, T004, T005, T006, T007, T008, T009
  **AC Ref:** None

- [x] **T011: Add Automated E2E Theme Tests**
  **Priority:** Low
  **Action:** Create E2E tests to verify theme detection and rendering in both light and dark modes
  **Depends On:** T010
  **AC Ref:** None

- [x] **T012: Add Unit/Integration Tests for Theme Hook/Context**
  **Priority:** Low
  **Action:** If custom theme hooks exist, add tests to verify their state management under different conditions
  **Depends On:** T010
  **AC Ref:** None

- [x] **T013: Accessibility Check**
  **Priority:** Medium
  **Action:** Verify color contrast ratios and accessibility compliance in both light and dark modes
  **Depends On:** T010
  **AC Ref:** None

- [x] **T014: Code Cleanup**
  **Priority:** Low
  **Action:** Remove any temporary CSS overrides, commented-out code, or console logs related to theme debugging
  **Depends On:** T010
  **AC Ref:** None

- [x] **T015: Update Documentation**
  **Priority:** Low
  **Action:** Document the theme implementation in code comments and relevant docs
  **Depends On:** T010
  **AC Ref:** None

- [ ] **T016: Verify/Update Storybook Stories**
  **Priority:** Medium
  **Action:** Ensure Storybook stories exist for key components and correctly display both theme variants
  **Depends On:** T010
  **AC Ref:** None
