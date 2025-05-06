# Todo

## TypeScript Configuration Strictness

- [ ] **T001 · Feature · P1: Harden root tsconfig.json for strict type checking**
    - **Context:** PLAN.md - Detailed Build Steps #1
    - **Action:**
        1. Update `tsconfig.json` to include `"strict": true` and explicitly list all strictness flags as per `DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md`.
        2. Verify settings like `noImplicitAny`, `strictNullChecks`, and others are enabled.
    - **Done-when:**
        1. `tsconfig.json` reflects all strict settings as outlined in the plan.
    - **Verification:**
        1. Manually inspect `tsconfig.json` to confirm strict flags are set.
    - **Depends-on:** none

- [ ] **T002 · Feature · P1: Align tsconfig.jest.json with root strictness**
    - **Context:** PLAN.md - Detailed Build Steps #2
    - **Action:**
        1. Ensure `tsconfig.jest.json` extends `tsconfig.json` without weakening strictness settings.
        2. Remove any strictness-weakening overrides and verify `isolatedModules` if set to `false` does not impact type safety.
    - **Done-when:**
        1. `tsconfig.jest.json` inherits strict settings from `tsconfig.json` with no weakening overrides.
    - **Verification:**
        1. Manually compare `tsconfig.jest.json` with `tsconfig.json` to confirm strictness alignment.
    - **Depends-on:** [T001]

- [ ] **T003 · Feature · P1: Run initial type check across project**
    - **Context:** PLAN.md - Detailed Build Steps #3
    - **Action:**
        1. Execute `pnpm typecheck` or `tsc --noEmit` to identify type errors.
        2. Catalog errors for remediation planning.
    - **Done-when:**
        1. Initial type check is completed, and errors are documented for further action.
    - **Verification:**
        1. Review output of `pnpm typecheck` to ensure all errors are logged.
    - **Depends-on:** [T002]

- [ ] **T004 · Feature · P2: Fix type errors in core and shared code**
    - **Context:** PLAN.md - Detailed Build Steps #4 (Phase 1)
    - **Action:**
        1. Address type errors in shared utilities (`lib/`) and foundational UI components (`components/ui/`).
        2. Apply error resolution principles (e.g., explicit types, handle `null`/`undefined`).
    - **Done-when:**
        1. All type errors in core and shared code are resolved, and `pnpm typecheck` passes for these modules.
    - **Verification:**
        1. Run `pnpm typecheck` on affected files and confirm no errors remain in `lib/` and `components/ui/`.
    - **Depends-on:** [T003]

- [ ] **T005 · Feature · P2: Fix type errors in application and feature code**
    - **Context:** PLAN.md - Detailed Build Steps #4 (Phase 2)
    - **Action:**
        1. Address type errors in application logic, remaining components, and pages (`app/`).
        2. Follow error resolution principles for type mismatches and strict checks.
    - **Done-when:**
        1. All type errors in application and feature code are resolved, and `pnpm typecheck` passes for these modules.
    - **Verification:**
        1. Run `pnpm typecheck` on affected files and confirm no errors remain in `app/` and other feature modules.
    - **Depends-on:** [T004]

- [ ] **T006 · Feature · P2: Fix type errors in test code**
    - **Context:** PLAN.md - Detailed Build Steps #4 (Phase 3)
    - **Action:**
        1. Address type errors in test files (`__tests__/`), including typing mocks and test data.
        2. Ensure test helpers and component props are correctly typed.
    - **Done-when:**
        1. All type errors in test code are resolved, and `pnpm typecheck` passes for test files.
    - **Verification:**
        1. Run `pnpm typecheck` on test files and confirm no errors remain in `__tests__/`.
    - **Depends-on:** [T005]

- [ ] **T007 · Refactor · P2: Document mocking policy violations for future refactoring**
    - **Context:** PLAN.md - Detailed Build Steps #5
    - **Action:**
        1. Identify and document instances where tests mock internal collaborators, violating TEST-008 policy.
        2. Note these for refactoring in a separate task (TEST-008) while ensuring type safety for current mocks.
    - **Done-when:**
        1. All mocking policy violations are documented with references for future refactoring.
    - **Verification:**
        1. Review documentation to ensure all identified violations are listed with context.
    - **Depends-on:** [T006]

- [ ] **T008 · Test · P2: Verify fixes with iterative type checks and unit tests**
    - **Context:** PLAN.md - Detailed Build Steps #6
    - **Action:**
        1. After fixing errors in logical groups, re-run `pnpm typecheck` on affected files.
        2. Run relevant unit tests (`pnpm test <path>`) to ensure no runtime regressions.
    - **Done-when:**
        1. Type checks pass for remediated files, and unit tests confirm no regressions.
    - **Verification:**
        1. Confirm `pnpm typecheck` output shows no errors for fixed files.
        2. Confirm unit test results show no failures.
    - **Depends-on:** [T006]

- [ ] **T009 · Test · P1: Perform full project type check and test suite execution**
    - **Context:** PLAN.md - Detailed Build Steps #7
    - **Action:**
        1. Run `pnpm typecheck` for the entire project.
        2. Execute full test suite (`pnpm test`) and build (`pnpm build`) to confirm no regressions.
    - **Done-when:**
        1. Full type check passes with no errors, and test suite/build complete successfully.
    - **Verification:**
        1. Review `pnpm typecheck` output to confirm zero errors.
        2. Check test and build logs for successful completion.
    - **Depends-on:** [T008]

- [ ] **T010 · Chore · P2: Configure pre-commit hooks for type checking**
    - **Context:** PLAN.md - Detailed Build Steps #8
    - **Action:**
        1. Ensure pre-commit hooks (e.g., Husky + lint-staged) run `pnpm typecheck` on staged files.
    - **Done-when:**
        1. Pre-commit hooks are updated to include type checking on commits.
    - **Verification:**
        1. Test pre-commit hook by staging a file with a type error and confirm it fails.
    - **Depends-on:** [T009]

- [ ] **T011 · Chore · P2: Commit changes with conventional commits standard**
    - **Context:** PLAN.md - Detailed Build Steps #9
    - **Action:**
        1. Commit updated configuration files and type fixes using Conventional Commits format (e.g., `fix(types): enforce strict TypeScript across project and tests`).
    - **Done-when:**
        1. All changes are committed with a message adhering to Conventional Commits.
    - **Verification:**
        1. Review commit message to ensure it follows the standard format.
    - **Depends-on:** [T010]

- [ ] **T012 · Chore · P1: Update documentation for TypeScript strictness policy**
    - **Context:** PLAN.md - Documentation
    - **Action:**
        1. Add a section to `CONTRIBUTING.md` on "TypeScript Strictness Policy".
        2. Include guidelines on strictness enforcement, prohibition of `any`, and type checking requirements.
    - **Done-when:**
        1. Documentation is updated with clear strictness policy and guidelines.
    - **Verification:**
        1. Review `CONTRIBUTING.md` to confirm the new section is present and accurate.
    - **Depends-on:** [T011]

## Clarifications & Assumptions
- [ ] **Issue:** Are there specific legacy modules with heavy reliance on implicit `any` requiring focused effort?**
    - **Context:** PLAN.md - Open Questions
    - **Blocking?:** no
- [ ] **Issue:** Are all third-party dependencies equipped with adequate TypeScript definitions?**
    - **Context:** PLAN.md - Open Questions
    - **Blocking?:** no
- [ ] **Issue:** Is there consensus on acceptable use of `// @ts-expect-error` as a temporary measure with tracking?**
    - **Context:** PLAN.md - Open Questions
    - **Blocking?:** no
- [ ] **Issue:** Should an automated lint rule be added to prevent regressions on `any` or suppressions?**
    - **Context:** PLAN.md - Open Questions
    - **Blocking?:** no