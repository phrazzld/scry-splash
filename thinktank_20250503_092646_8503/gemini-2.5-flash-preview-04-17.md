Okay, let's address the broken light mode issue based on your consultation request and the provided code files.

The problem description and the analysis of the key files point strongly towards a conflict in how the theme class is applied to the `<html>` element, likely coupled with components relying on semantic CSS variables that aren't being correctly overridden in light mode.

Specifically, `/app/layout.tsx` sets `className="dark"` directly on the `<html>` tag, while `/components/ui/theme-provider.tsx` also attempts to manage the `<html>` class based on the selected theme. This conflict is a prime suspect for why the light class might not be applied correctly or consistently.

Let's proceed with the proposed solution steps, starting with the most probable cause.

**Step 1: Remove conflicting class from `app/layout.tsx`**

We will remove `className="dark"` from the `<html>` tag in `app/layout.tsx`. The `ThemeProvider` component is designed to handle setting the initial theme (based on `defaultTheme` prop or `localStorage`) and reacting to theme changes, including applying the appropriate class to the document element.

```diff
--- a/app/layout.tsx
+++ b/app/layout.tsx
@@ -12,7 +12,7 @@
   children: React.ReactNode;
 }> {
   return (
-    <html lang="en" className="dark" suppressHydrationWarning>
+    <html lang="en" suppressHydrationWarning>
       <body className={`${geistMono.variable}`}>
         <ThemeProvider defaultTheme="system">
           {children}

```

**Reasoning:** By removing the hardcoded `className="dark"`, we ensure that only `ThemeProvider` is responsible for managing the `light` or `dark` class on the `<html>` element. The `suppressHydrationWarning` prop is correctly used on the `<html>` tag, which is necessary because `ThemeProvider` interacts with `localStorage` and `matchMedia` on the client side, leading to potential hydration mismatches if the server initially renders a different theme.

**Step 2: Verify CSS Variable Inheritance and Component Styling**

Now that the `ThemeProvider` should have full control over applying the theme class, we need to verify in the browser that:

1.  The `light` class is correctly applied to the `<html>` tag when light mode is selected (either manually or via system preference).
2.  The CSS variables `--background` and `--foreground` are taking the values defined under the `.light` selector in `/app/theme.css`.
3.  Components like `Logo` and `Typography` (used in `HeroSection`) and `CTASection` are correctly using these semantic CSS variables via their Tailwind classes (`text-foreground`, `bg-background`, etc.) and that these are resolving to appropriate colors in both themes.

**Action:**

Run `pnpm dev` and open the application in your browser. Use the `ThemeSwitch` component to toggle between themes.

**Verification (Manual using Browser Developer Tools):**

1.  **Inspect `<html>`:** Check the `<html>` element. When you switch to "Light", it should have the class `light`. When you switch to "Dark" or "System" (and your system is dark), it should have the class `dark`.
2.  **Inspect `body`:** Check the `<body>` element. Look at the "Computed" styles for `background-color` and `color`.
    *   In dark mode (or system dark): `background-color` should resolve to `var(--background)` -> `var(--color-ink)` -> `#121212`. `color` should resolve to `var(--foreground)` -> `var(--color-chalk)` -> `#FAFAFA`.
    *   In light mode (or system light): `background-color` should resolve to `var(--background)` -> `var(--color-chalk)` -> `#FAFAFA`. `color` should resolve to `var(--foreground)` -> `var(--color-ink)` -> `#121212`.
3.  **Inspect `HeroSection` Content:** Inspect the `Logo` element and the text elements (e.g., `<h1>`, `<p>`) within the `HeroSection`. Check their `color` property in the "Computed" styles. They should be using `var(--foreground)` (likely applied via Tailwind's `text-foreground` class). Verify that this color changes correctly between themes and provides sufficient contrast with the body background.
4.  **Inspect CTA Button:** Inspect the button within the `CTASection`. Check its `background-color` and `color`. The button variants likely use `bg-primary` and `text-primary-foreground`.
    *   `--primary` should be `var(--color-cobalt)` (`#0047AB`) in both themes.
    *   `--primary-foreground` should be `var(--color-chalk)` (`#FAFAFA`) in both themes.
    *   The button's colors should remain consistent (Cobalt background, Chalk text) regardless of the theme, providing good contrast against both dark and light backgrounds.

**Expected Outcome After Step 1:**

With the conflicting `className="dark"` removed from `app/layout.tsx`, `ThemeProvider` should now correctly apply the `light` class when light mode is selected.

If the `Logo` and `Typography` components correctly use `text-foreground`, their color should switch to `var(--color-ink)` (black) in light mode. If the background correctly switches to `var(--color-chalk)` (white), the content should become visible.

If the background *still* remains black in light mode, despite the `light` class being on `<html>`, the issue might be in `/app/globals.css` or `/app/theme.css` where the `body` background is set, or how `NoiseBackground` is interacting with it.

Let's try this first step. If the problem persists, the next step will be deep inspection using developer tools as outlined above.

Please apply the change in `app/layout.tsx`, run the app, and report back if the light mode is fixed or if the black background and missing content issues still occur. If they persist, provide details from the browser's computed styles for the `<html>`, `body`, `Logo`, and text elements in light mode.