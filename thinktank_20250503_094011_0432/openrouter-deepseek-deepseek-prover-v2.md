## Implementation Tasks for Fixing System Theme Detection in Scry Splash Page

### 1. Core Fixes for the Layout Component
- **Task:** Remove the hardcoded `className="dark"` from the `app/layout.tsx` file to allow dynamic theme class application by the `ThemeProvider`.
- **Priority:** High
- **Details:** The hardcoded `dark` class is overriding the dynamic theme switching. Removing it will enable the `ThemeProvider` to apply the correct theme class based on the system preference.

### 2. Adjustments to the ThemeProvider
- **Task:** Ensure the `ThemeProvider` is correctly wrapping the application and applying the `dark` or `light` class to the root element based on the system theme.
- **Priority:** High
- **Details:** Verify that the `ThemeProvider` is properly configured to detect the system theme and apply the corresponding class to the root element. This may involve checking the configuration of the `next-themes` package or similar.

### 3. Component Styling Verification
- **Task:** Review all components to ensure they are correctly styled for both light and dark themes, and that no hardcoded styles are overriding the theme variables.
- **Priority:** Medium
- **Details:** Check each component to ensure that styles are using the theme variables correctly and that there are no hardcoded color values that would prevent proper theme switching.

### 4. Testing Procedures for Theme Switching
- **Task:** Implement automated tests to verify that the theme switches correctly between light and dark modes, and that all components are visible and styled appropriately in both modes.
- **Priority:** Medium
- **Details:** Write tests using tools like Cypress or Playwright to simulate system theme changes and verify the UI updates accordingly. Ensure that all components, including the logo and headline text, are visible in both themes.

### 5. Recommended Cleanup for Maintainability
- **Task:** Remove any unused or redundant code related to theme management and ensure that all theme-related logic is centralized in the `ThemeProvider`.
- **Priority:** Low
- **Details:** Clean up any legacy code or unused variables that may have been used for theme management in the past. Ensure that the `ThemeProvider` is the single source of truth for theme management.

### 6. Additional Verification
- **Task:** Verify that the `next-themes` package is correctly installed and configured, and that it is compatible with the current version of Next.js being used.
- **Priority:** Medium
- **Details:** Check the `package.json` to ensure the correct version of `next-themes` is installed and that it is compatible with the project's Next.js version. Update if necessary.

### 7. Documentation Update
- **Task:** Update the project documentation to reflect the changes made to the theme management system and to provide guidance on how to add new themes or modify existing ones.
- **Priority:** Low
- **Details:** Add a section to the `DEVELOPMENT_PHILOSOPHY_APPENDIX_FRONTEND.md` or `README.md` explaining how the theme system works and how to extend it.

### 8. Accessibility Check
- **Task:** Ensure that the light and dark themes meet the required contrast ratios and accessibility standards.
- **Priority:** Medium
- **Details:** Use tools like `axe-core` or `jest-axe` to verify that the themes are accessible and meet WCAG 2.1 AA standards.

### 9. Performance Check
- **Task:** Ensure that the theme switching does not introduce any performance regressions, especially in terms of initial load time and runtime performance.
- **Priority:** Low
- **Details:** Use performance profiling tools to measure the impact of the theme switching on the application's performance and optimize if necessary.

### 10. Final Review
- **Task:** Conduct a final review of the theme implementation to ensure that all issues have been addressed and that the theme switching is smooth and bug-free.
- **Priority:** High
- **Details:** Manually test the theme switching on different devices and browsers to ensure that the implementation is robust and works as expected.

These tasks are prioritized based on their impact on the theme detection issue and the overall stability of the application. The high-priority tasks should be addressed first to resolve the core issue, followed by medium and low-priority tasks to ensure the long-term maintainability and quality of the theme implementation.