# Todo

## Test Suite Hygiene & Policy Enforcement
- [x] **T001 · Chore · P0: audit test files for internal mocks and confirm policy adherence**
    - **Context:** cr-02 Confirm "No Internal Mocking" Policy Adherence
    - **Action:**
        1. Manually inspect all `__tests__/components/ui/*` test files for any `jest.mock()` or similar mocking of internal modules.
        2. Remove any occurrences found (other than allowed utilities, if any).
    - **Done‑when:**
        1. No internal mocks are present in any test file.
    - **Verification:**
        1. Search for `jest.mock` and verify no forbidden mocks exist.
    - **Depends‑on:** none

- [x] **T002 · Chore · P0: add explicit internal mocking policy confirmation to PR description**
    - **Context:** cr-02 Confirm "No Internal Mocking" Policy Adherence
    - **Action:**
        1. Add a clear statement in the PR description confirming the audit for internal mocks is complete and no forbidden mocks exist.
    - **Done‑when:**
        1. PR description contains explicit internal mocking audit confirmation.
    - **Depends‑on:** [T001]

- [x] **T003 · Chore · P1: propose or implement ESLint rule to prevent internal mocking**
    - **Context:** cr-02 Confirm "No Internal Mocking" Policy Adherence
    - **Action:**
        1. Evaluate ESLint's `no-restricted-imports` or similar mechanism to warn on internal module mocking.
        2. Add or propose the rule to the ESLint config as appropriate.
    - **Done‑when:**
        1. Rule is in place or a proposal is documented.
    - **Verification:**
        1. Trigger a test violation to ensure the rule is active.
    - **Depends‑on:** [T001]

## Accessibility Coverage
- [x] **T004 · Test · P0: add comprehensive jest-axe accessibility checks for all distinct Container variants**
    - **Context:** cr-01 Ensure Comprehensive Accessibility Coverage (`jest-axe`)
    - **Action:**
        1. Identify each unique prop/state variant tested in `container.test.tsx`.
        2. For each, add `await axe(container)` and assert `toHaveNoViolations()`.
    - **Done‑when:**
        1. Every distinct Container variant rendered in a test is covered by an axe accessibility assertion.
    - **Verification:**
        1. Run tests with accessibility assertions failing if violations exist.
    - **Depends‑on:** none

- [x] **T005 · Test · P0: add comprehensive jest-axe accessibility checks for all distinct GridItem variants**
    - **Context:** cr-01 Ensure Comprehensive Accessibility Coverage (`jest-axe`)
    - **Action:**
        1. Identify each unique prop/state variant tested in `grid-item.test.tsx`.
        2. For each, add `await axe(container)` and assert `toHaveNoViolations()`.
    - **Done‑when:**
        1. Every distinct GridItem variant rendered in a test is covered by an axe accessibility assertion.
    - **Verification:**
        1. Run tests with accessibility assertions failing if violations exist.
    - **Depends‑on:** [T008]

- [x] **T006 · Test · P0: add comprehensive jest-axe accessibility checks for all distinct Logo variants**
    - **Context:** cr-01 Ensure Comprehensive Accessibility Coverage (`jest-axe`)
    - **Action:**
        1. Identify each unique prop/state variant tested in `logo.test.tsx`.
        2. For each, add `await axe(container)` and assert `toHaveNoViolations()`.
    - **Done‑when:**
        1. Every distinct Logo variant rendered in a test is covered by an axe accessibility assertion.
    - **Verification:**
        1. Run tests with accessibility assertions failing if violations exist.
    - **Depends‑on:** none

- [x] **T007 · Test · P0: add comprehensive jest-axe accessibility checks for all distinct NoiseBackground variants**
    - **Context:** cr-01 Ensure Comprehensive Accessibility Coverage (`jest-axe`)
    - **Action:**
        1. Identify each unique prop/state variant tested in `noise-background.test.tsx`.
        2. For each, add `await axe(container)` and assert `toHaveNoViolations()`.
    - **Done‑when:**
        1. Every distinct NoiseBackground variant rendered in a test is covered by an axe accessibility assertion.
    - **Verification:**
        1. Run tests with accessibility assertions failing if violations exist.
    - **Depends‑on:** none

## Test Modularity & File Structure
- [x] **T008 · Refactor · P0: split GridItem tests into grid-item.test.tsx**
    - **Context:** cr-03 Split Excessive Length Test File (`container.test.tsx`)
    - **Action:**
        1. Create `__tests__/components/ui/grid-item.test.tsx`.
        2. Move all GridItem-related tests from `container.test.tsx` to `grid-item.test.tsx`.
    - **Done‑when:**
        1. `container.test.tsx` contains only Container tests.
        2. `grid-item.test.tsx` contains only GridItem tests.
        3. All tests pass.
    - **Verification:**
        1. Run test suite and confirm passing.
    - **Depends‑on:** none

- [x] **T009 · Refactor · P1: reorganize Container and GridItem test files with clear describe blocks**
    - **Context:** cr-03 Split Excessive Length Test File (`container.test.tsx`)
    - **Action:**
        1. Group tests within `container.test.tsx` and `grid-item.test.tsx` using `describe` blocks (e.g., "Props", "Accessibility", "Edge Cases").
    - **Done‑when:**
        1. Test files are logically organized and sections clearly delineated.
    - **Verification:**
        1. Code review confirms improved structure.
    - **Depends‑on:** [T008]

## Test Assertion Robustness
- [x] **T010 · Refactor · P1: decouple Container and GridItem tests from CSS class implementation details**
    - **Context:** cr-04 Decouple Tests from CSS Class Implementation Details
    - **Action:**
        1. Refactor assertions in `container.test.tsx` and `grid-item.test.tsx` to check styles or semantic DOM attributes, not internal class names.
    - **Done‑when:**
        1. Tests assert behavior or computed styles, not internal CSS classes (except for documented public API).
    - **Verification:**
        1. Tests remain green and are resilient to class name changes.
    - **Depends‑on:** [T009]

- [x] **T011 · Refactor · P1: decouple Logo tests from CSS class implementation details**
    - **Context:** cr-04 Decouple Tests from CSS Class Implementation Details
    - **Action:**
        1. Refactor assertions in `logo.test.tsx` to check styles or semantic properties over internal class names.
    - **Done‑when:**
        1. Tests assert observable outcome, not styling internals.
    - **Verification:**
        1. Tests remain green and non-brittle.
    - **Depends‑on:** none

- [x] **T012 · Refactor · P1: replace manual class checks in Logo tests with toHaveClass**
    - **Context:** cr-05 Refactor Non-Idiomatic/Brittle Class/Style Assertions
    - **Action:**
        1. Replace all manual class presence checks in `logo.test.tsx` with `expect(...).toHaveClass(...)`.
        2. Remove obsolete comments about CSS-in-JS if present.
    - **Done‑when:**
        1. Only idiomatic toHaveClass is used for class assertions in Logo tests.
    - **Verification:**
        1. Code search shows no manual classList checks remain.
    - **Depends‑on:** [T011]

- [x] **T013 · Refactor · P1: robustly assert NoiseBackground styles and document jsdom limitations**
    - **Context:** cr-05 Refactor Non-Idiomatic/Brittle Class/Style Assertions
    - **Action:**
        1. Use `toHaveStyle` for `backgroundRepeat`, `opacity` in `noise-background.test.tsx`.
        2. Attempt to assert `backgroundImage`; if not feasible, comment in code explaining jsdom limitation.
    - **Done‑when:**
        1. Style assertions are robust, or a clear comment explains any limitation.
    - **Verification:**
        1. Code review and test output.
    - **Depends‑on:** none

## Querying Strategy & Test Resilience
- [x] **T014 · Refactor · P1: minimize data-testid usage in Logo tests in favor of user-facing queries**
    - **Context:** cr-06 Optimize Querying Strategy (Reduce `data-testid` Overuse)
    - **Action:**
        1. Update Logo tests to use `getByRole`, `getByLabelText`, or `getByText`.
    - **Done‑when:**
        1. No `getByTestId` is used in Logo tests where user-facing queries are possible.
    - **Verification:**
        1. Tests remain green; queries reflect real user selectors.
    - **Depends‑on:** [T012]

- [x] **T015 · Refactor · P1: minimize data-testid usage in Container, GridItem, and NoiseBackground tests**
    - **Context:** cr-06 Optimize Querying Strategy (Reduce `data-testid` Overuse)
    - **Action:**
        1. Replace `getByTestId` with semantic selectors where feasible in these test files.
        2. If a more semantic wrapper is appropriate for accessibility, implement it.
    - **Done‑when:**
        1. `getByTestId` is used only when no accessible selector is possible.
    - **Verification:**
        1. Code review confirms selector improvement.
    - **Depends‑on:** [T010], [T013]

## Coverage Verification
- [x] **T016 · Test · P0: generate and attach test coverage report to PR**
    - **Context:** cr-07 Address Test Coverage Verification Gap
    - **Action:**
        1. Run tests with coverage enabled.
        2. Attach the summary or artifact (HTML report link) to the PR or as a PR comment.
    - **Done‑when:**
        1. PR includes evidence of current coverage.
    - **Verification:**
        1. Reviewer can view and verify coverage numbers.
    - **Depends‑on:** none

- [x] **T017 · Chore · P0: confirm CI enforces test coverage thresholds**
    - **Context:** cr-07 Address Test Coverage Verification Gap
    - **Action:**
        1. Check CI pipeline config for test coverage enforcement (90%+).
        2. If missing, add coverage enforcement to CI config.
    - **Done‑when:**
        1. CI fails builds that fall below coverage thresholds.
    - **Verification:**
        1. Deliberately break coverage and confirm CI fails.
    - **Depends‑on:** none

## Minor Hygiene/Readability
- [x] **T018 · Chore · P2: remove commented-out dead jest.mock code from container.test.tsx**
    - **Context:** cr-08 Remove Commented-Out Dead Code
    - **Action:**
        1. Delete commented-out `jest.mock` block from `container.test.tsx`.
    - **Done‑when:**
        1. No dead code remains.
    - **Verification:**
        1. Code search for `jest.mock` comments is empty.
    - **Depends‑on:** none

- [x] **T019 · Chore · P2: ensure all test files have final newlines**
    - **Context:** cr-09 Add Missing Final Newlines in Test Files
    - **Action:**
        1. Run Prettier or configured formatter to enforce final newlines.
    - **Done‑when:**
        1. All test files end with a newline.
    - **Verification:**
        1. `git diff` shows no missing newlines; Prettier check passes.
    - **Depends‑on:** none

- [x] **T020 · Refactor · P2: change let to const in test files where reassignment does not occur**
    - **Context:** cr-11 Use `const` Over `let` Where Possible in Test Files
    - **Action:**
        1. Find all `let` declarations in test files that are not reassigned.
        2. Replace with `const`.
    - **Done‑when:**
        1. Only genuinely reassigned variables use `let`.
    - **Verification:**
        1. Lint passes; code review confirms.
    - **Depends‑on:** none

- [x] **T021 · Chore · P2: add comments explaining non-obvious test logic**
    - **Context:** cr-10 Add Documentation for Non-Obvious Test Logic
    - **Action:**
        1. Add concise comments to non-trivial test logic, e.g., DOM filtering in `noise-background.test.tsx:70-72`.
    - **Done‑when:**
        1. All non-obvious test setups are explained.
    - **Verification:**
        1. Code review confirms clarity.
    - **Depends‑on:** none

## Component Source Documentation
- [x] **T022 · Chore · P1: ensure TSDoc coverage for Container props**
    - **Context:** cr-12 Ensure TSDoc for Source Component Props
    - **Action:**
        1. Review Container props interface in `container.tsx`.
        2. Add/update TSDoc for each prop, covering type, usage, and default.
    - **Done‑when:**
        1. All Container props are comprehensively documented with TSDoc.
    - **Verification:**
        1. IDE hover shows TSDoc; code review confirms completeness.
    - **Depends‑on:** none

- [x] **T023 · Chore · P1: ensure TSDoc coverage for GridItem props**
    - **Context:** cr-12 Ensure TSDoc for Source Component Props
    - **Action:**
        1. Review GridItem props interface in `container.tsx`.
        2. Add/update TSDoc for each prop, covering type, usage, and default.
    - **Done‑when:**
        1. All GridItem props are comprehensively documented with TSDoc.
    - **Verification:**
        1. IDE hover shows TSDoc; code review confirms completeness.
    - **Depends‑on:** none

- [x] **T024 · Chore · P1: ensure TSDoc coverage for Logo props**
    - **Context:** cr-12 Ensure TSDoc for Source Component Props
    - **Action:**
        1. Review Logo props interface in `logo.tsx`.
        2. Add/update TSDoc for each prop, covering type, usage, and default.
    - **Done‑when:**
        1. All Logo props are comprehensively documented with TSDoc.
    - **Verification:**
        1. IDE hover shows TSDoc; code review confirms completeness.
    - **Depends‑on:** none

- [x] **T025 · Chore · P1: ensure TSDoc coverage for NoiseBackground props**
    - **Context:** cr-12 Ensure TSDoc for Source Component Props
    - **Action:**
        1. Review NoiseBackground props interface in `noise-background.tsx`.
        2. Add/update TSDoc for each prop, covering type, usage, and default.
    - **Done‑when:**
        1. All NoiseBackground props are comprehensively documented with TSDoc.
    - **Verification:**
        1. IDE hover shows TSDoc; code review confirms completeness.
    - **Depends‑on:** none