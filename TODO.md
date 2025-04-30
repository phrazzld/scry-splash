# Todo

## Setup & Configuration
- [x] **T001 · Chore · P2: configure tailwind brand colors**
    - **Context:** PLAN.md § 1. Brand & Visual System
    - **Action:**
        1. Add `Ink Black (#121212)`, `Chalk White (#FAFAFA)`, and `Cobalt Blue (#0047AB)` to `tailwind.config.js` under `theme.extend.colors`.
        2. Use semantic names (e.g., `ink`, `chalk`, `cobalt`).
    - **Done‑when:**
        1. Brand colors are available as Tailwind utility classes (e.g., `bg-ink`, `text-chalk`, `border-cobalt`).
    - **Depends‑on:** none

- [x] **T002 · Chore · P2: add ibm plex sans font files**
    - **Context:** PLAN.md § 1. Brand & Visual System, § 5. Task 1
    - **Action:**
        1. Acquire IBM Plex Sans font files (Regular, Medium, Bold weights).
        2. Add font files to the project assets (e.g., `/public/fonts` or `/src/assets/fonts`).
        3. Define `@font-face` rules in global CSS to load the local font files.
    - **Done‑when:**
        1. Font files are included in the project build.
        2. `@font-face` rules are correctly configured in global CSS.
    - **Depends‑on:** none

- [x] **T003 · Chore · P2: configure tailwind typography scale and font family**
    - **Context:** PLAN.md § 1. Brand & Visual System (Typography)
    - **Action:**
        1. Set IBM Plex Sans as the default sans-serif font family in `tailwind.config.js`.
        2. Define custom font sizes in `tailwind.config.js` corresponding to the 4pt modular scale: 64pt, 32pt, 18pt, 14pt (convert pt to rem/px as appropriate for the project).
        3. Define utility classes or ensure base configuration applies the correct font weights (Bold, Regular, Medium) where needed.
    - **Done‑when:**
        1. Tailwind utilities for specified font sizes are available.
        2. IBM Plex Sans is the default font applied.
    - **Depends‑on:** T002

- [x] **T004 · Chore · P2: configure tailwind grid system**
    - **Context:** PLAN.md § 3. Layout Grid
    - **Action:**
        1. Ensure Tailwind is configured for a 12-column grid system.
        2. Verify responsive breakpoint setup (implicit mobile-first, or specific breakpoints if needed).
        3. Confirm base spacing unit aligns with the 8pt baseline grid requirement (may require theme customization).
    - **Done‑when:**
        1. Tailwind grid utilities (`grid-cols-12`, `col-span-*`) are available and function correctly.
        2. Responsive variants (e.g., `md:col-span-6`) work as expected.
    - **Depends‑on:** none

## Styling & Layout
- [x] **T005 · Feature · P1: implement page background color and noise overlay**
    - **Context:** PLAN.md § 1. Brand & Visual System, § 5. Task 2
    - **Action:**
        1. Set the main page container's background to `Ink Black` using the configured Tailwind utility (from T001).
        2. Apply the 1% Silver Gray radial PNG noise texture as a background image overlay (e.g., using multiple backgrounds or a pseudo-element).
        3. Remove any pre-existing background styles (like gradients).
    - **Done‑when:**
        1. Page background is Ink Black.
        2. Noise texture is subtly visible over the background.
    - **Verification:**
        1. Inspect element background color in browser dev tools.
        2. Visually confirm noise texture presence.
    - **Depends‑on:** T001

- [ ] **T006 · Feature · P1: implement main content grid layout**
    - **Context:** PLAN.md § 3. Layout Grid, § 5. Task 3
    - **Action:**
        1. Structure the main content area using Tailwind's 12-column grid.
        2. Apply classes so content spans full-width (`col-span-12`) on mobile and 6/12 columns (`md:col-span-6`) centered on desktop.
        3. Apply vertical margins ≥ 120pt above the first element and below the CTA.
    - **Done‑when:**
        1. Content correctly occupies full width on small screens and 6 centered columns on larger screens.
        2. Vertical spacing above/below content meets the minimum requirement.
    - **Verification:**
        1. Use browser dev tools responsive mode to check layout at <640px and >640px widths.
        2. Inspect margins using dev tools.
    - **Depends‑on:** T004

- [ ] **T007 · Feature · P1: apply typography styles and constraints**
    - **Context:** PLAN.md § 1. Brand & Visual System, § 3. Layout Grid, § 5. Task 3
    - **Action:**
        1. Apply the configured Tailwind font size and weight utilities to text elements (Logo, Tag-line, Benefit trio, CTA label, Microcopy).
        2. Set text color to `Chalk White` using the configured utility (from T001).
        3. Apply `max-w-prose` or a custom max-width utility equivalent to 72 characters to relevant text blocks.
    - **Done‑when:**
        1. All text elements render with the correct font, size, weight, and color.
        2. Text blocks adhere to the max-width constraint.
    - **Verification:**
        1. Inspect text elements in dev tools for correct CSS properties.
        2. Visually check text wrapping against the 72-character limit.
    - **Depends‑on:** T001, T003

## Content & Components
- [ ] **T008 · Feature · P1: insert final page copy and remove placeholders**
    - **Context:** PLAN.md § 2. Final Copy, § 5. Task 4
    - **Action:**
        1. Replace all placeholder text with the exact copy from PLAN.md § 2.
        2. Structure the HTML semantically for Logo, Tag-line, Benefit trio, CTA label, and Microcopy.
        3. Remove any old visual elements mentioned (bullet icons, redundant gradients).
    - **Done‑when:**
        1. Page displays the final copy exactly as specified.
        2. No placeholder text or removed visual elements remain in the markup or styles.
    - **Verification:**
        1. Visually proofread the page against PLAN.md § 2.
    - **Depends‑on:** T006, T007

- [ ] **T009 · Feature · P1: build cta button structure and base style**
    - **Context:** PLAN.md § 1. Brand & Visual System, § 5. Task 5
    - **Action:**
        1. Create a semantic `<button>` element for the "Join the wait‑list" CTA.
        2. Apply base styles: `Cobalt Blue` background, `Chalk White` text (18pt Medium), adequate padding.
    - **Done‑when:**
        1. A styled button with the correct text is rendered on the page.
    - **Depends‑on:** T001, T003, T008

- [ ] **T010 · Feature · P2: implement cta button hover style**
    - **Context:** PLAN.md § 5. Task 5
    - **Action:**
        1. Implement a CSS `:hover` state for the CTA button.
        2. Adjust the background color for a ~10% luminance increase on hover (calculate target color or use Tailwind's brightness/opacity utilities if applicable).
    - **Done‑when:**
        1. Hovering over the CTA button visibly changes its background color as specified.
    - **Verification:**
        1. Mouse over the button and observe the background color change.
    - **Depends‑on:** T009

- [ ] **T011 · Feature · P1: implement cta button focus style**
    - **Context:** PLAN.md § 4. Interaction & Accessibility, § 5. Task 5
    - **Action:**
        1. Implement a CSS `:focus` or `:focus-visible` state for the CTA button.
        2. Apply a 2pt `Cobalt Blue` outline with an 8pt border-radius using Tailwind utilities (`outline-2`, `outline-cobalt`, `rounded-lg`, potentially `outline-offset`).
    - **Done‑when:**
        1. Tabbing to the button displays the specified focus outline.
        2. Focus outline meets WCAG AA contrast requirements (verified in T016).
    - **Verification:**
        1. Use keyboard navigation (Tab key) to focus the button and observe the outline.
    - **Depends‑on:** T009

## Interaction & Accessibility
- [ ] **T012 · Feature · P3: implement page content fade-in animation**
    - **Context:** PLAN.md § 4. Interaction & Accessibility
    - **Action:**
        1. Apply a CSS animation or transition to the main content container(s).
        2. Animate opacity from 0 to 1 over 200ms using an ease-out timing function on initial load.
    - **Done‑when:**
        1. Page content fades in smoothly on load.
    - **Verification:**
        1. Refresh the page and observe the fade-in effect.
    - **Depends‑on:** T006

- [ ] **T013 · Feature · P2: add required aria attributes**
    - **Context:** PLAN.md § 4. Interaction & Accessibility
    - **Action:**
        1. Add `aria-label="Scry"` to the main logo/heading element.
        2. Ensure the CTA element has `role="button"` (implicitly true for `<button>`, add explicitly if using another tag).
    - **Done‑when:**
        1. `aria-label` is present on the logo element.
        2. CTA element has the correct button role assigned.
    - **Verification:**
        1. Inspect elements in browser dev tools accessibility tree.
        2. Run accessibility audit (T018) to confirm.
    - **Depends‑on:** T008, T009

## Verification & Audits
- [ ] **T014 · Test · P2: verify responsive layout behavior**
    - **Context:** PLAN.md § 3. Layout Grid, § 5. Task 6
    - **Action:**
        1. Test the page layout by resizing the browser viewport from 320px width up to desktop sizes.
        2. Confirm content spans full-width on mobile (e.g., < 768px) and 6/12 centered on desktop (e.g., ≥ 768px).
    - **Done‑when:**
        1. Layout adapts correctly at different breakpoints ≥ 320px.
        2. No horizontal scrollbars appear.
    - **Verification:**
        1. Use browser dev tools responsive mode.
    - **Depends‑on:** T006, T008, T009

- [ ] **T015 · Test · P1: verify color contrast ratios**
    - **Context:** PLAN.md § 1. Brand & Visual System, § 4. Interaction & Accessibility, § 5. Task 6
    - **Action:**
        1. Use browser dev tools or an online checker to verify contrast ratios.
        2. Check: Text (`Chalk White`) vs Background (`Ink Black`), CTA Text vs CTA Background (`Cobalt Blue`), CTA Focus Outline (`Cobalt Blue`) vs Background (`Ink Black`).
    - **Done‑when:**
        1. All checked color combinations meet WCAG AA requirements (4.5:1 for text, 3:1 for UI components/focus).
    - **Depends‑on:** T005, T007, T011

- [ ] **T016 · Chore · P2: configure deployment previews**
    - **Context:** PLAN.md § 5. Task 7
    - **Action:**
        1. Set up automated preview deployments for pull requests/branches using a service like Vercel, Netlify, etc.
    - **Done‑when:**
        1. Pushing code generates a unique, shareable preview URL.
    - **Depends‑on:** none

- [ ] **T017 · Test · P1: run lighthouse audit**
    - **Context:** PLAN.md § 5. Task 7, § 6. Success Criteria
    - **Action:**
        1. Run Lighthouse audit against a deployed preview URL (via DevTools or CI).
        2. Record Accessibility score and CLS metric.
    - **Done‑when:**
        1. Lighthouse report is generated.
    - **Depends‑on:** T016, T014, T015 # Depends on core implementation being testable

- [ ] **T018 · Test · P1: run axe-core audit**
    - **Context:** PLAN.md § 5. Task 7
    - **Action:**
        1. Run axe-core accessibility audit against a deployed preview URL (via extension or CI).
        2. Record any violations found.
    - **Done‑when:**
        1. Axe-core audit report is generated.
    - **Depends‑on:** T016, T013 # Depends on ARIA being testable

- [ ] **T019 · Bugfix · P0: fix audit violations (lighthouse/axe)**
    - **Context:** PLAN.md § 5. Task 7, § 6. Success Criteria
    - **Action:**
        1. Address accessibility issues reported by Lighthouse/axe to achieve score ≥ 95 and zero axe violations.
        2. Address any performance issues causing CLS ≥ 0.05.
        3. Re-run audits (T017, T018) to confirm fixes.
    - **Done‑when:**
        1. Lighthouse accessibility score is ≥ 95.
        2. Lighthouse CLS is < 0.05.
        3. Axe-core reports zero violations.
    - **Depends‑on:** T017, T018

- [ ] **T020 · Test · P2: verify single interactive element**
    - **Context:** PLAN.md § 6. Success Criteria
    - **Action:**
        1. Manually tab through the page using the keyboard.
        2. Click around the page interface.
    - **Done‑when:**
        1. Only the CTA button element is focusable via keyboard.
        2. Only the CTA button element is clickable/interactive.
    - **Verification:**
        1. Perform keyboard navigation (Tab/Shift+Tab).
        2. Attempt clicks on non-CTA elements.
    - **Depends‑on:** T019 # Depends on final implementation after fixes

## Final Review
- [ ] **T021 · Chore · P3: prepare for stakeholder review**
    - **Context:** PLAN.md § 6. Success Criteria
    - **Action:**
        1. Ensure the latest build passing all checks (T019, T020) is deployed to the preview environment.
        2. Prepare a brief summary or checklist based on PLAN.md Success Criteria.
    - **Done‑when:**
        1. Preview URL is ready and stable.
        2. Review checklist/summary is prepared.
    - **Depends‑on:** T016, T019, T020

