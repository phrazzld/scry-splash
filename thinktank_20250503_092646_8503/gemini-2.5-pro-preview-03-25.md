Okay, let's tackle this broken theme implementation. The core issue seems to be that the light mode styles aren't being applied correctly, leading to missing content and incorrect backgrounds. Based on the context and the files involved, here's a breakdown of the likely problems and the steps to fix them.

**Analysis of Potential Issues:**

1.  **`app/layout.tsx` - Hardcoded Dark Class:** The `<html>` tag has `className="dark"` hardcoded. This is the most probable cause. The `ThemeProvider` tries to dynamically add/remove `light` and `dark` classes, but this static class likely overrides it or causes conflicts, especially during hydration.
2.  **CSS Variable Application/Specificity:** While the variables in `theme.css` look correctly defined for both `:root` (dark default) and `.light`, the hardcoded class might prevent the `.light` scope from ever being effectively applied. Styles in `globals.css` might also have higher specificity, overriding the theme variables.
3.  **Component Styling:** Components like `Logo` and `Typography` use semantic colors (`text-foreground`, `text-background`, `text-primary`). This is *good*, but if the underlying `--foreground` variable doesn't switch correctly to `--color-ink` (black) in light mode (due to issue #1), the text will remain `--color-chalk` (white), making it invisible on the expected light background (which also fails to apply). The `NoiseBackground` also relies on `--background`.
4.  **`globals.css` Overrides:** Having utility-like classes (`.bg-ink`, `.text-chalk`) and component-specific styles (`button` overrides) in `globals.css` can lead to specificity issues and make debugging harder. It's better to rely on Tailwind utilities and component-level styling.

**Solution Steps:**

**Step 1: Fix the Root Layout (`app/layout.tsx`)**

This is the most critical fix. Remove the hardcoded `dark` class from the `<html>` tag. Let the `ThemeProvider` handle the class application entirely.

```diff
--- a/app/layout.tsx
+++ b/app/layout.tsx
@@ -14,7 +14,7 @@
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) {
   return (
-    <html lang="en" className="dark" suppressHydrationWarning>
+    <html lang="en" suppressHydrationWarning>
       <body className={`${geistMono.variable}`}>
         <ThemeProvider defaultTheme="system">
           {children}

```

*Reasoning:* `ThemeProvider` is designed to dynamically add `light` or `dark` to the `<html>` element based on user preference or system settings. A static `className="dark"` interferes with this dynamic behavior and likely causes the light mode styles never to be applied correctly. `suppressHydrationWarning` is correctly used here, as theme classes often cause mismatches between server and client initial render.

**Step 2: Verify `ThemeProvider` Logic (`components/ui/theme-provider.tsx`)**

The provided `ThemeProvider` code looks generally correct for applying the class to `document.documentElement`.

*   It correctly identifies the `activeTheme` (either 'light', 'dark', based on state or system preference).
*   It removes existing theme classes (`light`, `dark`) before adding the new one.
*   It adds the `activeTheme` class to the `root` (which is `document.documentElement`).

No changes seem immediately necessary here *after* fixing Step 1, but keep it in mind if issues persist.

**Step 3: Clean Up `globals.css` (Recommended for Maintainability)**

While not the primary blocker, cleaning up `globals.css` will prevent future specificity issues and align better with Tailwind/shadcn practices.

*   **Remove Redundant Utilities:** Delete classes like `.bg-ink`, `.text-chalk`, `.text-purple`, `.bg-cobalt`, `.text-display`, `.text-heading`, etc. Use Tailwind classes directly (e.g., `bg-background`, `text-foreground`, `text-primary`, `text-display`, `font-bold`). The theme variables (`--background`, `--foreground`, etc.) defined in `theme.css` will automatically update the Tailwind utility classes.
*   **Keep Essential Base Styles:** Keep the `body` styles that set the base `background-color` and `color` using `--background` and `--foreground`. The font loading (`@font-face`) can stay for now but should be migrated to `next/font` later (Backlog `UI-002`).
*   **Refactor Button Overrides:** Ensure any remaining button overrides use CSS variables or Tailwind classes instead of hardcoded values where theme adaptation is needed (e.g., use `--primary` or `bg-primary` instead of hardcoding `--cobalt-base`).

```diff
--- a/app/globals.css
+++ b/app/globals.css
@@ -27,53 +27,14 @@
 }
 
 /* Base styles */
-html {
-  font-size: 16px;
-}
-
 body {
   min-height: 100vh;
   font-family: 'IBM Plex Sans', sans-serif;
   background-color: var(--background);
   color: var(--foreground);
-  -webkit-font-smoothing: antialiased;
-  -moz-osx-font-smoothing: grayscale;
-  margin: 0;
-  padding: 0;
   transition: background-color 0.2s ease, color 0.2s ease;
 }
 
-/* Typography classes */
-.text-display {
-  font-size: var(--font-display-size);
-  line-height: var(--font-display-line-height);
-}
-
-.text-heading {
-  font-size: var(--font-heading-size);
-  line-height: var(--font-heading-line-height);
-}
-
-.text-subheading {
-  font-size: var(--font-subheading-size);
-  line-height: var(--font-subheading-line-height);
-}
-
-.text-body {
-  font-size: var(--font-body-size);
-  line-height: var(--font-body-line-height);
-}
-
-/* Font weight classes */
-.font-regular {
-  font-weight: var(--font-regular);
-}
-
-.font-medium {
-  font-weight: var(--font-medium);
-}
-
-.font-bold {
-  font-weight: var(--font-bold);
-}
-
 /* Grid layout */
 .grid-container {
   display: grid;
@@ -81,29 +42,10 @@
   width: 100%;
 }
 
-/* Ensure max-width for prose */
-.max-w-prose {
-  max-width: 72ch;
-}
-
-/* Color utilities */
-.bg-ink {
-  background-color: var(--background);
-}
-
-.text-chalk {
-  color: var(--foreground);
-}
-
-.text-purple {
-  color: var(--accent);
-}
-
-.bg-cobalt {
-  background-color: var(--primary);
-}
-
 /* Spacing */
+/* Note: Consider removing these if covered by Tailwind theme */
 .mt-vertical-lg, .my-vertical-lg {
   margin-top: var(--spacing-vertical-lg);
 }
@@ -122,21 +64,8 @@
   opacity: 0;
 }
 
-/* Button styles */
-button {
-  position: relative;
-  display: inline-flex;
-  align-items: center;
-  justify-content: center;
-  font-family: 'IBM Plex Sans', sans-serif;
-  border: none;
-  overflow: hidden;
-}
-
-.bg-cobalt-light {
-  background-color: var(--color-cobalt-light);
-}
-
+/* Example Button Style Override (Keep if needed, but prefer component variants) */
+/* Ensure theme variables are used if colors need to adapt */
 .btn-cta:hover {
   background-color: var(--color-cobalt-light);
 }

```

*Reasoning:* Simplifies the global scope, reduces potential CSS conflicts, and relies on the intended theming mechanism (CSS variables powering Tailwind utilities).

**Step 4: Verify Component Styles**

Review the components mentioned (`Logo`, `HeroSection`, `NoiseBackground`, `Typography`, `Button`).

*   `Logo`: Uses `text-foreground`. Should now work correctly.
*   `HeroSection`: Uses `text-foreground`. Should now work correctly.
*   `NoiseBackground`: Uses `var(--background)` prop default. Should now work correctly.
*   `Typography`: Uses `text-foreground` and `text-muted-foreground`. Should now work correctly.
*   `Button`: Uses semantic classes like `bg-primary`, `text-primary-foreground`. These rely on variables defined in `theme.css` and should adapt correctly. The `gradient` variant has a hardcoded background but uses `text-primary-foreground` which should adapt.

No immediate changes are needed in these components *assuming Step 1 fixes the core issue*.

**Step 5: Test Thoroughly**

1.  Run `pnpm dev`.
2.  Open the page in your browser.
3.  Check the initial theme (it should respect your OS setting due to `defaultTheme="system"`).
4.  Use the `ThemeSwitch` component:
    *   Switch to **Light**: Verify the background is light (chalk), text is dark (ink), logo/headline are visible, and the button looks correct. Inspect the `<html>` element - it should have `class="light"`.
    *   Switch to **Dark**: Verify the background is dark (ink), text is light (chalk), etc. Inspect the `<html>` element - it should have `class="dark"`.
    *   Switch to **System**: Verify it matches your current OS theme setting. Change your OS theme and see if the site updates (may require refresh depending on listener implementation, but `ThemeProvider` looks like it should handle it live).
5.  Check developer tools console for any errors.

**Summary of Fixes:**

1.  **Critical:** Remove `className="dark"` from `<html>` in `app/layout.tsx`.
2.  **Recommended:** Clean up `globals.css` to remove redundant/conflicting styles and rely on theme variables and Tailwind utilities.

This approach directly addresses the most likely cause (hardcoded class conflict) while also promoting better CSS practices for long-term maintainability, aligning with the project's development philosophy.