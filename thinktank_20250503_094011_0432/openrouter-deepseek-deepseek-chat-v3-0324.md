Based on the consultant plan and development philosophy documents, here's a prioritized list of specific implementation tasks to fix the theme detection issue in the Scry splash page:

### Priority 1: Core Layout Fixes
1. **Remove hardcoded dark class from layout.tsx**
   - Locate and remove `className="dark"` from the root layout component
   - Verify the layout now inherits theme from ThemeProvider

2. **Audit ThemeProvider implementation**
   - Confirm ThemeProvider is correctly wrapping the application
   - Verify theme storage mechanism (cookies/localStorage) matches project standards
   - Ensure theme switching logic properly toggles between 'light' and 'dark' classes

### Priority 2: Component Styling Verification
3. **Create theme verification checklist for all components**
   - Logo component: Verify visibility in both themes
   - Headline text: Check contrast ratios meet WCAG standards
   - Background: Confirm theme colors are properly applied
   - CTA button: Ensure styling adapts to both themes

4. **Implement missing light mode styles**
   - Add light mode variants for all components using Tailwind's dark: modifier
   - Ensure all text colors have proper dark/light variants
   - Verify background colors transition correctly

### Priority 3: Testing Procedures
5. **Add Storybook stories for theme testing**
   - Create light/dark variants for all relevant components
   - Include theme toggle controls in Storybook
   - Document expected behavior in both themes

6. **Implement Cypress theme tests**
   - Add end-to-end test for theme switching functionality
   - Verify all critical elements remain visible after theme change
   - Test persistence of theme preference across page reloads

### Priority 4: Maintainability Improvements
7. **Create theme constants file**
   - Extract color values to shared constants
   - Document theme requirements for future components
   - Add TypeScript types for theme context

8. **Add theme validation to CI pipeline**
   - Include theme checks in linting process
   - Verify all new components support both themes
   - Add visual regression tests for both themes

### Priority 5: Documentation Updates
9. **Update theme documentation**
   - Document theme implementation in DEVELOPMENT_PHILOSOPHY_APPENDIX_FRONTEND
   - Add theme switching guidelines for new components
   - Create troubleshooting guide for theme issues

### Testing Checklist:
- [ ] Manual test: Switch between light/dark themes
- [ ] Verify all content remains visible
- [ ] Check contrast ratios meet accessibility standards
- [ ] Test theme persistence across page reloads
- [ ] Verify no console errors during theme switching

Each task should follow the project's:
- TypeScript strict typing requirements
- Atomic design component structure
- Tailwind styling approach
- Storybook documentation standards
- Testing requirements from the development philosophy