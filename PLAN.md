# Implementation Plan: Theme Toggle Feature

## Chosen Approach (One-liner)

Implement a simple, clean, and accessible theme toggle button that allows users to switch between light and dark modes, while ensuring the toggle is properly positioned and fixing the anti-FOUC issue.

## Architecture Blueprint

- **Modules / Packages**
    - `components/ui/theme-toggle-button.tsx` (New) → Accessible UI component for user theme switching with sun/moon icon
    - `components/ui/theme-provider.tsx` → Already exists, manages theme state
    - `components/ui/theme-script.tsx` → Already exists, prevents FOUC
    - `app/layout.tsx` → Root layout, may need minor modifications to fix anti-FOUC
    - `components/molecules/footer.tsx` or other container → Where the toggle button will be placed

- **Public Interfaces / Contracts**
    - `useTheme` hook: `{ theme, systemTheme, setTheme }` (already exists, will be consumed by toggle)
    - `ThemeToggleButtonProps`: Extends `React.ButtonHTMLAttributes<HTMLButtonElement>`, adding position customization props if needed

- **Data Flow Diagram (Theme Switching)**
    ```mermaid
    graph LR
        A[User] -- Clicks --> B(ThemeToggleButton);
        B -- Calls setTheme('light'/'dark') --> C{useTheme Hook};
        C -- Updates state --> D(ThemeProvider Context);
        D -- Updates localStorage(storageKey) --> E[Browser localStorage];
        D -- Updates class on <html> --> F[<html> Element];
    ```

- **Error & Edge-Case Strategy**
    - ThemeToggleButton requires ThemeProvider context (Error if used outside context)
    - ARIA attributes ensure accessibility compliance
    - Verify anti-FOUC script prevents theme flicker on initial page load

## Detailed Build Steps

### Phase 1: Core Implementation

1. **Implement `ThemeToggleButton` Component**:
   - Create `components/ui/theme-toggle-button.tsx` using `useTheme` hook
   - Design a minimal, accessible button that shows sun/moon icon based on current theme
   - Implement click handler to toggle between light/dark modes
   - Add proper aria-label and keyboard focus states
   - Add comprehensive TSDoc comments

2. **Create Storybook Stories**:
   - Add `.stories.tsx` file with different states (light mode, dark mode)
   - Ensure stories have proper ThemeProvider context
   - Add a11y addon configuration for accessibility testing

3. **Add Unit Tests**:
   - Create `.test.tsx` with useTheme mock to test rendering and click behavior
   - Test icon rendering based on current theme
   - Test theme changing on click
   - Test accessibility attributes

### Phase 2: Integration & Verification

4. **Fix Anti-FOUC Issues**:
   - Verify and fix any issues with the existing anti-FOUC implementation
   - Ensure theme is determined and applied before page content renders
   - Review `ThemeScript` placement in `app/layout.tsx`

5. **Integrate Toggle Button**:
   - Add the ThemeToggleButton to the footer (or other confirmed location)
   - Ensure proper positioning and styling within its container
   - Verify that it works correctly in the actual app context

6. **Add E2E Tests**:
   - Create or update E2E tests to verify theme toggling works
   - Test localStorage persistence
   - Test that theme switch is visually correct

7. **Clean Up & Documentation**:
   - Remove any old theme toggle components if they exist
   - Update docs/THEMING.md to document the new ThemeToggleButton
   - Ensure TSDoc is comprehensive for the component

## Testing Strategy

- **Unit Tests:** Test ThemeToggleButton component rendering and behavior with mocked `useTheme` hook
- **Storybook:** Visual verification of button states and accessibility testing
- **E2E Tests:** Validate complete theme switching flow including localStorage persistence
- **Manual Testing:** Verify appearance and behavior across different viewport sizes

## Risk Matrix

| Risk | Severity | Mitigation |
|------|----------|------------|
| Theme FOUC persists | High | Analyze and fix `ThemeScript` implementation, ensure proper execution timing |
| Button appears incorrectly in some viewport sizes | Medium | Test thoroughly across breakpoints, add responsive styling |
| Keyboard/screen reader accessibility issues | Medium | Include proper ARIA attributes, test with axe or similar tools |

## Open Questions

- Confirm final placement for the ThemeToggleButton (footer vs. header/navbar)
- Verify any specific accessibility requirements beyond WCAG AA