# Todo

## TypeScript Configuration

- [ ] **T001 · Refactor · P1: Update root tsconfig.json to enforce strict settings**
    - **Context:** Chosen Approach and Architecture Blueprint from PLAN.md
    - **Action:**
        1. Open tsconfig.json and set "strict": true.
        2. Add or confirm individual strict flags (e.g., "noImplicitAny", "strictNullChecks").
    - **Done‑when:**
        1. tsconfig.json file is updated and passes pnpm typecheck.
    - **Verification:**
        1. Run pnpm typecheck to confirm no configuration errors.
    - **Depends‑on:** none

- [ ] **T002 · Refactor · P1: Align tsconfig.jest.json to extend root configuration**
    - **Context:** Architecture Blueprint from PLAN.md
    - **Action:**
        1. Open tsconfig.jest.json and ensure it extends tsconfig.json.
        2. Remove any strictness-weakening overrides.
    - **Done‑when:**
        1. tsconfig.jest.json extends tsconfig.json without weakening strict settings.
    - **Verification:**
        1. Run pnpm typecheck on test files to verify alignment.
    - **Depends‑on:** T001

- [ ] **T003 · Chore · P2: Perform initial type check**
    - **Context:** Detailed Build Steps from PLAN.md
    - **Action:**
        1. Run pnpm typecheck on the project.
    - **Done‑when:**
        1. Type check output is generated and errors are logged.
    - **Verification:**
        1. Review output for type errors in IDE or CLI.
    - **Depends‑on:** T002

- [ ] **T004 · Refactor · P2: Remediate type errors in core and shared code**
    - **Context:** Detailed Build Steps (Phase 1) from PLAN.md
    - **Action:**
        1. Identify and fix type errors in lib/ and components/ui/.
    - **Done‑when:**
        1. All errors in specified areas are resolved and pnpm typecheck passes.
    - **Verification:**
        1. Run unit tests in affected areas to confirm no regressions.
    - **Depends‑on:** T003

- [ ] **T005 · Refactor · P2: Remediate type errors in application and feature code**
    - **Context:** Detailed Build Steps (Phase 2) from PLAN.md
    - **Action:**
        1. Identify and fix type errors in app/, src/, and components/.
    - **Done‑when:**
        1. All errors in specified areas are resolved and pnpm typecheck passes.
    - **Verification:**
        1. Run integration tests to verify behavior.
    - **Depends‑on:** T004

- [ ] **T006 · Refactor · P2: Remediate type errors in test code**
    - **Context:** Detailed Build Steps (Phase 3) from PLAN.md
    - **Action:**
        1. Identify and fix type errors in __tests__/ files.
    - **Done‑when:**
        1. All errors in test files are resolved and pnpm test passes.
    - **Verification:**
        1. Execute full test suite to ensure type fixes don't break tests.
    - **Depends‑on:** T005

- [ ] **T007 · Chore · P2: Verify full project after remediation**
    - **Context:** Detailed Build Steps from PLAN.md
    - **Action:**
        1. Run pnpm typecheck and pnpm test.
    - **Done‑when:**
        1. All checks pass with no type errors.
    - **Verification:**
        1. Build the application to confirm success.
    - **Depends‑on:** T006

- [ ] **T008 · Chore · P2: Configure pre-commit hooks for type checking**
    - **Context:** Detailed Build Steps from PLAN.md
    - **Action:**
        1. Update package.json scripts to include pnpm typecheck.
    - **Done‑when:**
        1. Pre-commit hooks run type checks successfully.
    - **Verification:**
        1. Attempt a commit to test hook execution.
    - **Depends‑on:** T007

- [ ] **T009 · Chore · P2: Commit changes with Conventional Commit message**
    - **Context:** Detailed Build Steps from PLAN.md
    - **Action:**
        1. Commit updated files with a message like "fix(types): enforce strict TS".
    - **Done‑when:**
        1. Changes are committed and follow Conventional Commits.
    - **Verification:** none
    - **Depends‑on:** T008

- [ ] **T010 · Feature · P2: Integrate strict type checking into CI pipeline**
    - **Context:** Detailed Build Steps and CI Integration from PLAN.md
    - **Action:**
        1. Update CI configuration to run pnpm typecheck.
    - **Done‑when:**
        1. CI pipeline fails on type errors.
    - **Verification:**
        1. Trigger a CI build to confirm integration.
    - **Depends‑on:** T009

## Risks and Mitigations

- [ ] **Issue: Large number of type errors requiring significant refactoring effort**
    - **Context:** Risk Matrix from PLAN.md
    - **Blocking?:** no

- [ ] **Issue: Potential runtime bugs from type-fixing refactors**
    - **Context:** Risk Matrix from PLAN.md
    - **Blocking?:** no

- [ ] **Issue: Difficulty typing complex existing code or mocks**
    - **Context:** Risk Matrix from PLAN.md
    - **Blocking?:** no

- [ ] **Issue: Developer workflow disruption**
    - **Context:** Risk Matrix from PLAN.md
    - **Blocking?:** no

- [ ] **Issue: Uncovering mocking policy violations**
    - **Context:** Risk Matrix from PLAN.md
    - **Blocking?:** no

- [ ] **Issue: CI configuration issues**
    - **Context:** Risk Matrix from PLAN.md
    - **Blocking?:** no

- [ ] **Issue: tsconfig.jest.json overrides weakening strictness**
    - **Context:** Risk Matrix from PLAN.md
    - **Blocking?:** no

## Open Questions and Clarifications

- [ ] **Issue: Identify specific legacy modules relying on implicit any**
    - **Context:** Open Questions from PLAN.md
    - **Blocking?:** no

- [ ] **Issue: Verify third-party dependencies have adequate types**
    - **Context:** Open Questions from PLAN.md
    - **Blocking?:** no

- [ ] **Issue: Establish policy for @ts-expect-error usage**
    - **Context:** Open Questions from PLAN.md
    - **Blocking?:** no

- [ ] **Issue: Add automated lint rule for type suppressions**
    - **Context:** Open Questions from PLAN.md
    - **Blocking?:** no