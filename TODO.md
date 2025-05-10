# Todo

## Core UI Atoms Tests Setup
- [x] **T001 · Chore · P1: install and configure jest-axe for accessibility testing**
    - **Context:** Plan Details > Detailed Build Steps > 1. Setup `jest-axe`
    - **Action:**
        1. Install `jest-axe` using `pnpm add -D jest-axe`.
        2. In `jest.setup.js`, integrate `jest-axe` matchers: `import { toHaveNoViolations } from 'jest-axe'; expect.extend(toHaveNoViolations);`.
    - **Done‑when:**
        1. `jest-axe` is listed in `devDependencies`.
        2. `jest.setup.js` is updated and Jest tests can access `toHaveNoViolations` matcher.
    - **Verification:**
        1. Run a simple test case using `toHaveNoViolations` to ensure the matcher is available.
    - **Depends‑on:** none

- [x] **T002 · Chore · P2: create container.test.tsx test file**
    - **Context:** Plan Details > Detailed Build Steps > 2. Create Test Files
    - **Action:**
        1. Create `__tests__/components/ui/container.test.tsx`.
        2. Ensure the file adheres to strict TypeScript and existing naming conventions.
    - **Done‑when:**
        1. `__tests__/components/ui/container.test.tsx` exists.
        2. File passes `pnpm typecheck` and `pnpm lint` with basic test structure.
    - **Depends‑on:** none

- [x] **T003 · Chore · P2: create logo.test.tsx test file**
    - **Context:** Plan Details > Detailed Build Steps > 2. Create Test Files
    - **Action:**
        1. Create `__tests__/components/ui/logo.test.tsx`.
        2. Ensure the file adheres to strict TypeScript and existing naming conventions.
    - **Done‑when:**
        1. `__tests__/components/ui/logo.test.tsx` exists.
        2. File passes `pnpm typecheck` and `pnpm lint` with basic test structure.
    - **Depends‑on:** none

- [x] **T004 · Chore · P2: create noise-background.test.tsx test file**
    - **Context:** Plan Details > Detailed Build Steps > 2. Create Test Files
    - **Action:**
        1. Create `__tests__/components/ui/noise-background.test.tsx`.
        2. Ensure the file adheres to strict TypeScript and existing naming conventions.
    - **Done‑when:**
        1. `__tests__/components/ui/noise-background.test.tsx` exists.
        2. File passes `pnpm typecheck` and `pnpm lint` with basic test structure.
    - **Depends‑on:** none

## Container & GridItem Tests (`container.test.tsx`)
- [x] **T005 · Test · P2: implement Container rendering tests (children, default element, `as` prop)**
    - **Context:** Plan Details > Detailed Build Steps > 3. Implement `Container` & `GridItem` Tests > Rendering (`Container`)
    - **Action:**
        1. Verify `Container` renders children correctly.
        2. Verify `Container` default HTML element is `div`.
        3. Test `Container` `as` prop for rendering different semantic elements (e.g., `section`, `aside`).
    - **Done‑when:**
        1. Tests pass, descriptions are behavior-focused, and no internal collaborators are mocked.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T002]

- [x] **T006 · Test · P2: implement Container prop tests (`className`, `maxWidth`, `padding`, `center`, `gap`s)**
    - **Context:** Plan Details > Detailed Build Steps > 3. Implement `Container` & `GridItem` Tests > Props & Variants (`Container`)
    - **Action:**
        1. Test `className` is applied and merged.
        2. Test all `maxWidth` variants apply correct Tailwind classes.
        3. Test all `padding` variants apply correct Tailwind classes.
        4. Test `center` prop applies/omits `mx-auto` class.
        5. Test `gap`, `gapX`, `gapY` variants apply correct Tailwind classes.
    - **Done‑when:**
        1. Tests for all specified `Container` props pass, descriptions are behavior-focused, and no internal collaborators are mocked.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T002]

- [x] **T007 · Test · P2: implement GridItem rendering tests (children, default element, `as` prop)**
    - **Context:** Plan Details > Detailed Build Steps > 3. Implement `Container` & `GridItem` Tests > Rendering (`GridItem` - implicitly from `Container` section)
    - **Action:**
        1. Verify `GridItem` renders children correctly.
        2. Verify `GridItem` default HTML element is `div`.
        3. Test `GridItem` `as` prop for rendering different semantic elements.
    - **Done‑when:**
        1. Tests pass, descriptions are behavior-focused, and no internal collaborators are mocked.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T002]

- [x] **T008 · Test · P2: implement GridItem prop tests (`className`, `span`s, `start`s)**
    - **Context:** Plan Details > Detailed Build Steps > 3. Implement `Container` & `GridItem` Tests > Props & Variants (`GridItem`)
    - **Action:**
        1. Test `className` is applied and merged.
        2. Test `span` and responsive span props (`sm`, `md`, etc.) apply correct `col-span-*` classes.
        3. Test `start` and responsive start props (`smStart`, `mdStart`, etc.) apply correct `col-start-*` classes.
    - **Done‑when:**
        1. Tests for all specified `GridItem` props pass, descriptions are behavior-focused, and no internal collaborators are mocked.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T002]

- [x] **T009 · Test · P1: implement accessibility tests for Container & GridItem (A11Y-001)**
    - **Context:** Plan Details > Detailed Build Steps > 3. Implement `Container` & `GridItem` Tests > Accessibility
    - **Action:**
        1. For each distinct rendered state of `Container` and `GridItem` from T005-T008, integrate `jest-axe` checks.
        2. Assert `expect(await axe(container)).toHaveNoViolations();` for WCAG AA compliance.
    - **Done‑when:**
        1. All `jest-axe` checks pass for `Container` and `GridItem` states.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T001, T005, T006, T007, T008]

## Logo Tests (`logo.test.tsx`)
- [x] **T010 · Test · P2: implement Logo rendering tests (text, styling, default element, `as` prop)**
    - **Context:** Plan Details > Detailed Build Steps > 4. Implement `Logo` Tests > Rendering
    - **Action:**
        1. Verify text "Scry." renders, with the period (`.`) in a `span` with specific styling (e.g., `opacity-70`).
        2. Verify default HTML element (`h1`).
        3. Test `as` prop for rendering different elements (e.g., `div`, `p`).
    - **Done‑when:**
        1. Tests pass, descriptions are behavior-focused, and no internal collaborators are mocked.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T003]

- [ ] **T011 · Test · P2: implement Logo prop tests (`className`, `size`, `color`, `aria-label`)**
    - **Context:** Plan Details > Detailed Build Steps > 4. Implement `Logo` Tests > Props & Variants
    - **Action:**
        1. Test `className` is applied.
        2. Test all `size` variants (`default`, `small`, `medium`, `large`) apply correct Tailwind typography classes.
        3. Test all `color` variants (`chalk`, `ink`, `cobalt`) apply correct Tailwind text color classes.
        4. Test `aria-label` is applied correctly; verify default if not provided.
    - **Done‑when:**
        1. Tests for all specified `Logo` props pass, descriptions are behavior-focused, and no internal collaborators are mocked.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T003]

- [ ] **T012 · Test · P1: implement accessibility tests for Logo (A11Y-001)**
    - **Context:** Plan Details > Detailed Build Steps > 4. Implement `Logo` Tests > Accessibility
    - **Action:**
        1. For each distinct rendered state of `Logo` from T010-T011, integrate `jest-axe` checks.
        2. Assert `expect(await axe(container)).toHaveNoViolations();` for WCAG AA compliance, paying attention to `aria-label` and contrast.
    - **Done‑when:**
        1. All `jest-axe` checks pass for `Logo` states.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T001, T010, T011]

## NoiseBackground Tests (`noise-background.test.tsx`)
- [ ] **T013 · Test · P2: implement NoiseBackground rendering tests (children, inner div, default styles, `backgroundImage`)**
    - **Context:** Plan Details > Detailed Build Steps > 5. Implement `NoiseBackground` Tests > Rendering
    - **Action:**
        1. Verify it renders children correctly.
        2. Verify the presence of an inner `div` for the noise effect with `aria-hidden="true"`.
        3. Verify default `baseColor` and `noiseOpacity` are applied as inline styles.
        4. Verify `backgroundImage` for the noise pattern.
    - **Done‑when:**
        1. Tests pass, descriptions are behavior-focused, and no internal collaborators are mocked.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T004]

- [ ] **T014 · Test · P2: implement NoiseBackground prop tests (`className`, `baseColor`, `noiseOpacity`)**
    - **Context:** Plan Details > Detailed Build Steps > 5. Implement `NoiseBackground` Tests > Props & Variants
    - **Action:**
        1. Test `className` is applied to the main wrapper.
        2. Test `baseColor` dynamically updates `backgroundColor` style.
        3. Test `noiseOpacity` dynamically updates `opacity` style of the noise `div`.
    - **Done‑when:**
        1. Tests for all specified `NoiseBackground` props pass, descriptions are behavior-focused, and no internal collaborators are mocked.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T004]

- [ ] **T015 · Test · P1: implement accessibility tests for NoiseBackground (A11Y-001)**
    - **Context:** Plan Details > Detailed Build Steps > 5. Implement `NoiseBackground` Tests > Accessibility
    - **Action:**
        1. For each distinct rendered state of `NoiseBackground` from T013-T014, integrate `jest-axe` checks.
        2. Assert `expect(await axe(container)).toHaveNoViolations();` for WCAG AA compliance, ensuring the component is inert.
    - **Done‑when:**
        1. All `jest-axe` checks pass for `NoiseBackground` states.
        2. Tests pass `pnpm typecheck` and `pnpm lint`.
    - **Depends‑on:** [T001, T013, T014]

## Edge Cases & Final Verification
- [ ] **T016 · Test · P2: implement edge case tests for components rendering with no children**
    - **Context:** Plan Details > Testing Strategy > Edge Cases
    - **Action:**
        1. Test `Container` rendering with no children.
        2. Test `GridItem` rendering with no children.
        3. Test `NoiseBackground` rendering with no children.
    - **Done‑when:**
        1. Tests pass for all components rendering correctly without children.
        2. Test descriptions are behavior-focused, no internal mocking, and pass TS/lint checks.
    - **Depends‑on:** [T002, T004]

- [ ] **T017 · Test · P2: implement edge case tests for HTML attribute passthrough (`id`, `data-*`)**
    - **Context:** Plan Details > Testing Strategy > Edge Cases
    - **Action:**
        1. Test `Container` for passthrough of standard HTML attributes like `id`, `data-*`.
        2. Test `GridItem` for passthrough of standard HTML attributes.
        3. Test `Logo` for passthrough of standard HTML attributes.
        4. Test `NoiseBackground` for passthrough of standard HTML attributes.
    - **Done‑when:**
        1. Tests pass for all components correctly passing through HTML attributes.
        2. Test descriptions are behavior-focused, no internal mocking, and pass TS/lint checks.
    - **Depends‑on:** [T002, T003, T004]

- [ ] **T018 · Chore · P0: audit all tests to ensure no internal collaborators are mocked**
    - **Context:** Plan Details > Detailed Build Steps > 6. Adherence to Philosophy & Code Quality; Risk Matrix (Mocking internal collaborators)
    - **Action:**
        1. Review all tests in `container.test.tsx`, `logo.test.tsx`, and `noise-background.test.tsx`.
        2. Confirm that no internal collaborators (e.g., `cn` utility, other atoms/molecules) are mocked.
    - **Done‑when:**
        1. Audit confirms strict adherence to the no-internal-mocking policy.
    - **Verification:**
        1. Manual code review of all implemented tests.
    - **Depends‑on:** [T009, T012, T015, T016, T017]

- [ ] **T019 · Chore · P0: verify test coverage meets or exceeds 90% for all atoms**
    - **Context:** Plan Details > Detailed Build Steps > 7. Coverage Verification; Risk Matrix (Insufficient test coverage)
    - **Action:**
        1. Run `pnpm test --coverage`.
        2. Analyze statement, branch, function, and line coverage for `container.tsx`, `logo.tsx`, and `noise-background.tsx`.
        3. If coverage is below 90%, identify gaps and add meaningful tests in the respective component test tasks (T005-T017) to cover user-relevant behavior.
    - **Done‑when:**
        1. Statement, branch, function, and line coverage for `container.tsx`, `logo.tsx`, and `noise-background.tsx` is ≥ 90%.
    - **Verification:**
        1. Review coverage report generated by `pnpm test --coverage`.
    - **Depends‑on:** [T018]

### Clarifications & Assumptions
- [ ] **Issue:** Are there any highly specific, non-standard accessibility scenarios for these atoms that `jest-axe` with default WCAG AA rules might miss?
    - **Context:** Plan Details > Open Questions
    - **Blocking?:** no
- [ ] **Issue:** Is there a project-preferred method for organizing tests within a single `*.test.tsx` file (e.g., nested `describe` blocks for props vs. a11y vs. variants)?
    - **Context:** Plan Details > Open Questions
    - **Blocking?:** no