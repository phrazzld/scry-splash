To address the task of generating specific implementation tasks to fix the system theme detection issue in the Scry splash page, we need to follow a structured approach based on the provided context and guidelines.

### Step 1: Understand the Current Issues
The current issues with the Scry splash page include:
- Light mode is completely broken.
- When switching to light mode, content is missing (no logo, no headline text).
- The background remains dark instead of becoming light.
- Only the CTA button remains visible.

### Step 2: Identify the Core Problem
The root cause identified is the hardcoded `className="dark"` in the `app/layout.tsx` file, which conflicts with the dynamic theme class application from the ThemeProvider.

### Step 3: Generate Implementation Tasks
Based on the core problem and the development philosophy guidelines, the following prioritized list of specific implementation tasks can be generated:

1. **Remove Hardcoded `className="dark"` from `app/layout.tsx`**
   - This task involves modifying the `app/layout.tsx` file to remove the hardcoded `className="dark"` that is causing the theme detection issue.
   - **Rationale:** Removing this hardcoded class allows the ThemeProvider to dynamically apply the correct theme class.

2. **Verify ThemeProvider Configuration**
   - Ensure that the ThemeProvider is correctly configured to handle both light and dark modes.
   - **Rationale:** Proper configuration of the ThemeProvider is crucial for dynamic theme switching.

3. **Update Component Styling for Light Mode**
   - Review and update the styling of components to ensure they are visible and correctly styled in light mode.
   - **Rationale:** Components must be styled appropriately for both light and dark modes to ensure a good user experience.

4. **Implement Theme Switching Testing**
   - Develop tests to verify that theme switching between light and dark modes works correctly.
   - **Rationale:** Testing ensures that the theme switching functionality works as expected and catches any regressions.

5. **Conduct Visual Verification of Theme Modes**
   - Manually verify that both light and dark modes are displayed correctly, including checking for any missing content or styling issues.
   - **Rationale:** Visual verification is essential to ensure that the application looks and feels correct in both themes.

6. **Cleanup and Refactor for Maintainability**
   - Refactor the code to improve maintainability, focusing on areas related to theme handling.
   - **Rationale:** Improving maintainability ensures that future changes or updates can be made efficiently.

### Example Task Descriptions

1. **Task:** Remove the hardcoded `className="dark"` from the `app/layout.tsx` file.
   - **Priority:** High
   - **Description:** Modify `app/layout.tsx` to remove `className="dark"`.

2. **Task:** Verify and adjust the ThemeProvider configuration as necessary.
   - **Priority:** High
   - **Description:** Review ThemeProvider setup to ensure correct handling of light and dark modes.

3. **Task:** Update component styles to be compatible with light mode.
   - **Priority:** Medium
   - **Description:** Adjust component CSS to ensure visibility and correct styling in light mode.

4. **Task:** Implement automated tests for theme switching functionality.
   - **Priority:** Medium
   - **Description:** Write tests to verify correct behavior when switching between themes.

5. **Task:** Perform manual visual verification of both light and dark themes.
   - **Priority:** Medium
   - **Description:** Manually check the application in both themes to ensure correct display.

6. **Task:** Refactor theme-related code for better maintainability.
   - **Priority:** Low
   - **Description:** Simplify and improve theme handling code for future maintainability.

By following these tasks, the system theme detection issue on the Scry splash page can be effectively addressed, ensuring a better user experience across different themes.