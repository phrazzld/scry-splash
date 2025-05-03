Here's a prioritized list of implementation tasks to resolve the theme detection issues:

**1. Core Layout Fixes (Highest Priority)**
```markdown
- [ ] Remove hardcoded `className="dark"` from root element in `app/layout.tsx`
- [ ] Verify ThemeProvider wraps the entire application and uses `attribute="class"`
- [ ] Ensure HTML element has `className` binding to theme state (not hardcoded)
```

**2. ThemeProvider Configuration**
```markdown
- [ ] Audit ThemeProvider implementation to confirm proper dark/light class application
- [ ] Verify theme persistence mechanism (localStorage/cookies) works with SSR
- [ ] Add theme class synchronization check in `useEffect` hook
```

**3. Component Styling Verification**
```markdown
- [ ] Audit all components for hardcoded dark-mode styles (logo, headline, background)
- [ ] Convert static color classes to Tailwind dark mode variants (e.g., `dark:bg-background`)
- [ ] Verify contrast ratios meet WCAG standards in both themes
- [ ] Ensure SVG assets use currentColor for theme-aware fills
```

**4. Testing Procedures**
```markdown
- [ ] Add Storybook stories showing both theme variants for affected components
- [ ] Implement Cypress test suite for theme switching:
  - Visits page with default system theme
  - Toggles theme button
  - Verifies:
    - Background color changes
    - Logo visibility in both themes
    - Headline text presence/readability
    - CTA button remains functional
- [ ] Add unit tests for theme context provider
```

**5. Maintenance & Cleanup**
```markdown
- [ ] Create shared `useTheme` hook for consistent theme access
- [ ] Add TypeScript interface for theme context values
- [ ] Document theme implementation pattern in project docs
- [ ] Remove any residual dark-mode conditional logic from components
- [ ] Audit entire codebase for other instances of hardcoded theme classes
```

**Implementation Notes:**
1. Follow atomic design principles when refactoring components
2. Use Tailwind's `dark:` variants instead of manual class toggling
3. Ensure all changes pass Storybook's a11y addon checks
4. Verify dark/light transitions work with `prefers-reduced-motion`
5. Update snapshot tests to account for theme class changes

This approach addresses the immediate issue while improving long-term maintainability per the project's development philosophy.