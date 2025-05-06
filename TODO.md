# Todo: Theme Toggle Implementation

## Core Implementation
- [x] **T001 · Feature · P0: Implement ThemeToggleButton component**
    - **Context:** Phase 1, Step 1 in PLAN.md
    - **Action:**
        1. Create `components/ui/theme-toggle-button.tsx`.
        2. Use `useTheme` hook to get and set theme state.
        3. Render Sun/Moon icons conditionally based on current theme.
        4. Implement click handler to toggle between light/dark themes.
        5. Add proper accessibility attributes (aria-label, focus state).
        6. Add comprehensive TSDoc comments.
    - **Done‑when:**
        1. Component renders correctly based on current theme.
        2. Clicking toggles between light/dark modes.
        3. Component is fully keyboard accessible with proper focus states.
    - **Verification:**
        1. Manual testing in browser for correct appearance and behavior.
        2. Keyboard navigation testing.
    - **Depends‑on:** none

- [x] **T002 · Test · P1: Add Storybook stories for ThemeToggleButton**
    - **Context:** Phase 1, Step 2 in PLAN.md
    - **Action:**
        1. Create `components/ui/theme-toggle-button.stories.tsx` file.
        2. Include stories for light and dark theme states.
        3. Add ThemeProvider decorator to supply context.
        4. Configure a11y addon parameters.
    - **Done‑when:**
        1. Stories render correctly in Storybook.
        2. Theme button appears with correct icon in each state.
        3. Accessibility checker reports no issues.
    - **Verification:**
        1. Visual review in Storybook.
        2. A11y addon reports no violations.
    - **Depends‑on:** [T001]

- [ ] **T003 · Test · P1: Add unit tests for ThemeToggleButton**
    - **Context:** Phase 1, Step 3 in PLAN.md
    - **Action:**
        1. Create `__tests__/components/ui/theme-toggle-button.test.tsx`.
        2. Mock `useTheme` hook to test different theme states.
        3. Test icon rendering, click behavior, and ARIA attributes.
    - **Done‑when:**
        1. Tests verify component renders correctly in each theme state.
        2. Tests verify setTheme is called with correct value on click.
        3. Tests verify accessibility attributes are properly set.
        4. All tests pass.
    - **Verification:**
        1. Run `pnpm test` and verify tests pass.
    - **Depends‑on:** [T001]

## Integration & Verification
- [ ] **T004 · Bugfix · P0: Verify and fix any anti-FOUC issues**
    - **Context:** Phase 2, Step 4 in PLAN.md
    - **Action:**
        1. Review `ThemeScript` implementation in `app/layout.tsx`.
        2. Verify it correctly applies theme before initial render.
        3. Fix any issues with theme detection or application timing.
    - **Done‑when:**
        1. Page loads with correct theme immediately (no flicker).
        2. Theme is consistently applied based on localStorage or system preference.
    - **Verification:**
        1. Test page loads in various browsers.
        2. Test with different stored preferences and system settings.
    - **Depends‑on:** none

- [ ] **T005 · Feature · P1: Integrate ThemeToggleButton into footer or designated location**
    - **Context:** Phase 2, Step 5 in PLAN.md
    - **Action:**
        1. Add `<ThemeToggleButton />` to footer component or other agreed location.
        2. Ensure proper positioning with appropriate styling.
        3. Test integration with the rest of the UI.
    - **Done‑when:**
        1. Toggle button appears in the desired location.
        2. Button is correctly styled and visually integrated.
        3. Button functions properly within the application.
    - **Verification:**
        1. Visual inspection in browser at different viewport sizes.
        2. Manual testing of toggle functionality.
    - **Depends‑on:** [T001]

- [ ] **T006 · Test · P1: Add or update E2E tests for theme toggling**
    - **Context:** Phase 2, Step 6 in PLAN.md
    - **Action:**
        1. Create or update E2E tests in `e2e/theme/` directory.
        2. Test theme toggle button visibility and interaction.
        3. Verify theme changes correctly on click.
        4. Test theme persistence in localStorage.
    - **Done‑when:**
        1. E2E tests verify the toggle button works end-to-end.
        2. Tests verify theme persistence between page loads.
        3. All tests pass consistently.
    - **Verification:**
        1. Run E2E tests and verify they pass.
    - **Depends‑on:** [T005]

- [ ] **T007 · Chore · P2: Clean up and document**
    - **Context:** Phase 2, Step 7 in PLAN.md
    - **Action:**
        1. Remove any legacy theme toggle components if they exist.
        2. Update `docs/THEMING.md` to document the ThemeToggleButton.
        3. Ensure code is clean and well-commented.
    - **Done‑when:**
        1. No legacy/redundant components remain.
        2. Documentation accurately reflects the implementation.
    - **Verification:**
        1. Review documentation for accuracy.
    - **Depends‑on:** [T006]

## Open Questions
- [ ] **Issue: Confirm placement of ThemeToggleButton**
    - **Context:** Open Questions in PLAN.md
    - **Resolution needed:** Decide between footer, header, or other location.
    - **Blocking?:** Yes, for [T005]

- [ ] **Issue: Verify accessibility requirements**
    - **Context:** Open Questions in PLAN.md
    - **Resolution needed:** Confirm if there are specific accessibility requirements beyond WCAG AA.
    - **Blocking?:** No (proceed with WCAG AA compliance)