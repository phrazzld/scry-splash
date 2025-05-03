Here’s a prioritized, actionable to-do list for ripping out the hard-coded “dark” mode and restoring proper light/dark theme support on your splash page. Treat each line as a standalone ticket you can drop into your backlog/tracker.

1. Audit & Remove Hard-coded Dark Class  
   • File: `app/layout.tsx`  
   • Remove any `className="dark"` (or similar forced-dark wrappers) from `<html>`, `<body>`, or layout containers.  
   • Verify that no parent container is stamping “dark” permanently on the page.  
   Acceptance: With no theme override, the default (unstyled) page renders in system/light mode.

2. Refactor Layout to Apply Theme Dynamically  
   • Wrap your root layout in the ThemeProvider (e.g. from `next-themes` or your custom provider).  
   • Ensure you pass `attribute="class"`, `enableSystem=true`, and `defaultTheme="system"`.  
   • In `app/layout.tsx`, do something like:  
     ```tsx
     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
       <html lang="en" className={theme === "dark" ? "dark" : ""}>
         …
       </html>
     </ThemeProvider>
     ```  
   Acceptance: Toggling the provider’s theme (via hook or system) adds/removes the “dark” class on `<html>`.

3. Add Early-Load Theme Script (_document.tsx / head)  
   • Prevent FOUC by inlining the “read preferred theme and set class” snippet before React hydration.  
   • In Next .js’s `_document.tsx` (or plain HTML head), insert a small `<script>` that reads `localStorage` or `prefers-color-scheme` and writes `<html class="dark">` if needed.  
   Acceptance: On first paint, the correct theme renders instantly (no flash of wrong background).

4. Verify Tailwind Dark-Mode Configuration  
   • In `tailwind.config.js`, confirm `darkMode: 'class'`.  
   • Scan your main component classes for `bg-white dark:bg-black`, `text-black dark:text-white`, etc.  
   • Add any missing light-mode variants to key containers (logo wrapper, hero section, background).  
   Acceptance: Tailwind’s light classes kick in when “dark” class is absent.

5. Update Splash Assets & Styles for Light Mode  
   • Logo: ensure you have a light-mode SVG or supply CSS fill overrides (`fill-black` vs `fill-white`).  
   • Headline/Copy: add `text-neutral-900` for light; `dark:text-neutral-100` for dark.  
   • Background: supply `bg-white dark:bg-neutral-900`.  
   • CTA Button: confirm it has both light (`bg-blue-600 text-white`) and dark (`dark:bg-blue-400 dark:text-black`) variants if needed.  
   Acceptance: All visual elements appear correctly in both light and dark.

6. Unit/Integration Tests for Layout & Theme Hook  
   • Using React Testing Library + Jest (or Vitest), mount `<Layout>` with mock `ThemeProvider`.  
   • Assert that when you set `theme="light"`, `<html>` has no “dark” class and key containers have correct class names.  
   • Cover system switch: simulate `enableSystem` with `prefers-color-scheme`.  
   Acceptance: Tests toggle theme prop and verify DOM classes reliably.

7. E2E Test: Cypress / Playwright Theme Switching  
   • Write an E2E that:  
     1. Launches the splash page with default system-light preference → assert white background, black text/logo.  
     2. Programmatically switch to dark (via UI toggle or injecting `localStorage.theme = 'dark'`) → reload → assert dark background, white text/logo.  
   • Repeat with system preference emulated as dark through browser launch flags.  
   Acceptance: End-to-end cycle passes for both theme flows.

8. Clean Up Deprecated Theme Utilities  
   • Remove any unused theme-related code (legacy context, helpers, CSS overrides).  
   • Delete commented-out snippets referencing old “force dark” hacks.  
   • Consolidate theme logic into a single provider directory/module.  
   Acceptance: No dangling imports or unused theme files remain after code coverage.

9. Docs & Developer Guide Updates  
   • In your frontend README or “how to theme” doc, update instructions to use the new dynamic ThemeProvider.  
   • Add a quick reference for how to add new components with light/dark Tailwind variants.  
   • Note the head-script requirement for FOUC prevention.  
   Acceptance: A new hire following docs spins up the splash page in both themes without manual hacks.

---

By working this list in order, you’ll eliminate the hard-coded dark mode, restore full light-mode functionality, standardize your theme flow, and ensure it’s covered by automated tests and documentation.