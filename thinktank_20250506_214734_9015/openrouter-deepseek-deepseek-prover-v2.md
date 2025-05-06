```markdown
# Todo

## TypeScript Configuration
- [ ] **T001 · Chore · P0: Verify and Harden Root `tsconfig.json`**
    - **Context:** Step 1 of Detailed Build Steps
    - **Action:**
        1. Open `tsconfig.json`.
        2. Ensure `"strict": true` is present and enabled.
        3. Explicitly add or confirm all individual strictness flags.
    - **Done-when:**
        1. `tsconfig.json` enforces all strictness flags as per the example.
    - **Depends-on:** none

- [ ] **T002 · Chore · P0: Align `tsconfig.jest.json` with Root Config**
    - **Context:** Step 2 of Detailed Build Steps
    - **Action:**
        1. Open `tsconfig.jest.json`.
        2. Ensure it extends `tsconfig.json`.
        3. Remove any options that weaken strictness.
        4. Verify `isolatedModules` is set to `false` if required.
        5. Ensure `include` patterns cover all test files.
    - **Done-when:**
        1. `tsconfig.jest.json` extends `tsconfig.json` and does not weaken strictness.
    - **Depends-on:** [T001]

## Initial Type Check
- [ ] **T003 · Test · P0: Run Initial Type Check**
    - **Context:** Step 3 of Detailed Build Steps
    - **Action:**
        1. Run `pnpm typecheck` (or `tsc --noEmit`).
        2. Catalog all type errors.
    - **Done-when:**
        1. All type errors are identified and cataloged.
    - **Depends-on:** [T002]

## Systematic Error Remediation
- [ ] **T004 · Refactor · P1: Fix Errors in Core & Shared Code (`lib/`)**
    - **Context:** Phase 1 of Step 4 in Detailed Build Steps
    - **Action:**
        1. Prioritize fixing errors in `lib/` and foundational UI components.
        2. Apply error resolution principles (no `any`, handle `null`/`undefined`, etc.).
    - **Done-when:**
        1. All type errors in `lib/` and foundational UI components are resolved.
    - **Depends-on:** [T003]

- [ ] **T005 · Refactor · P1: Fix Errors in Application & Feature Code (`components/`, `app/`)**
    - **Context:** Phase 2 of Step 4 in Detailed Build Steps
    - **Action:**
        1. Address errors in application logic, remaining components, and pages.
        2. Apply error resolution principles.
    - **Done-when:**
        1. All type errors in application and feature code are resolved.
    - **Depends-on:** [T004]

- [ ] **T006 · Refactor · P1: Fix Errors in Test Code (`__tests__/`)**
    - **Context:** Phase 3 of Step 4 in Detailed Build Steps
    - **Action:**
        1. Address all type errors in `__tests__/`.
        2. Ensure mock functions and test data are correctly typed.
    - **Done-when:**
        1. All type errors in test code are resolved.
    - **Depends-on:** [T005]

## Refactor Mocking (if needed)
- [ ] **T007 · Refactor · P2: Document Mocking Policy Violations**
    - **Context:** Step 5 of Detailed Build Steps
    - **Action:**
        1. Document any tests that mock internal collaborators (violating TEST-008).
    - **Done-when:**
        1. All mocking policy violations are documented for refactoring under TEST-008.
    - **Depends-on:** [T006]

## Iterative Verification
- [ ] **T008 · Test · P0: Run Iterative Type Checks**
    - **Context:** Step 6 of Detailed Build Steps
    - **Action:**
        1. After fixing errors in a group of files, re-run `pnpm typecheck`.
        2. Run relevant unit tests (`pnpm test <path_to_affected_files>`).
    - **Done-when:**
        1. No new type errors are introduced, and unit tests pass.
    - **Depends-on:** [T006]

## Full Project Verification
- [ ] **T009 · Test · P0: Run Full Type Check and Test Suite**
    - **Context:** Step 7 of Detailed Build Steps
    - **Action:**
        1. Run `pnpm typecheck` for the entire project.
        2. Run `pnpm test` to confirm no regressions.
        3. Run `pnpm build` to ensure successful build.
    - **Done-when:**
        1. `pnpm typecheck` passes, all tests pass, and build completes successfully.
    - **Depends-on:** [T008]

## Pre-Commit Hook Configuration
- [ ] **T010 · Chore · P2: Configure Pre-Commit Hook for Type Checking**
    - **Context:** Step 8 of Detailed Build Steps
    - **Action:**
        1. Configure pre-commit hooks (e.g., Husky + lint-staged) to run `pnpm typecheck` on staged files.
    - **Done-when:**
        1. Pre-commit hook runs `pnpm typecheck` on staged files.
    - **Depends-on:** [T009]

## Commit Changes
- [ ] **T011 · Chore · P0: Commit Updated Config and Fixed Files**
    - **Context:** Step 9 of Detailed Build Steps
    - **Action:**
        1. Commit `tsconfig.json`, `tsconfig.jest.json`, and all files with type fixes.
        2. Use Conventional Commits standard (e.g., `fix(types): enforce strict TypeScript across project and tests`).
    - **Done-when:**
        1. All changes are committed with a Conventional Commit message.
    - **Depends-on:** [T010]

## CI Integration
- [ ] **T012 · Chore · P0: Integrate Type Checking into CI Pipeline**
    - **Context:** Step 10 of Detailed Build Steps
    - **Action:**
        1. Configure CI pipeline to run `pnpm typecheck` and fail on any type errors.
    - **Done-when:**
        1. CI pipeline runs `pnpm typecheck` and fails on type errors.
    - **Depends-on:** [T011]

## Documentation
- [ ] **T013 · Chore · P2: Update `CONTRIBUTING.md` with TypeScript Strictness Policy**
    - **Context:** Documentation section
    - **Action:**
        1. Add a section on "TypeScript Strictness Policy" to `CONTRIBUTING.md`.
        2. State that full strictness is enforced across all code, including tests.
        3. Prohibit `any` and type suppression directives.
        4. Mention that `pnpm typecheck` must pass before committing/merging.
    - **Done-when:**
        1. `CONTRIBUTING.md` is updated with the new policy.
    - **Depends-on:** [T011]

## Clarifications & Assumptions
- [ ] **Issue:** Are all third-party dependencies equipped with adequate TypeScript definitions?
    - **Context:** Open Questions
    - **Blocking?:** No
- [ ] **Issue:** Is there a consensus on the acceptable use of `// @ts-expect-error` as a temporary measure?
    - **Context:** Open Questions
    - **Blocking?:** No
- [ ] **Issue:** Should an automated lint rule be added to prevent regressions?
    - **Context:** Open Questions
    - **Blocking?:** No
```