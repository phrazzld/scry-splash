```md
# Todo

## TypeScript Strictness (TS-001)
- [ ] **T001 · Chore · P1:** Harden root tsconfig with strict flags
    - **Context:** Plan: Detailed Build Steps 1, Architecture Blueprint, TypeScript Appendix 4
    - **Action:**
        1. Open `tsconfig.json`.
        2. Ensure `"strict": true` is set.
        3. Explicitly add/confirm presence of all individual strictness flags recommended in `DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md` and the plan's example (`noImplicitAny`, `strictNullChecks`, etc.).
        4. Verify `target`, `module`, `moduleResolution`, `esModuleInterop`, `isolatedModules`, and other essential options align with project needs and philosophy.
    - **Done‑when:**
        1. `tsconfig.json` includes `"strict": true` and explicit strictness flags.
        2. Configuration aligns with philosophy appendix guidelines.
        3. `pnpm typecheck` command runs and shows initial errors based on the new config (this task enables the next steps).
    - **Depends‑on:** none

- [ ] **T002 · Chore · P1:** Align jest tsconfig to extend root and remove strict overrides
    - **Context:** Plan: Detailed Build Steps 2, Architecture Blueprint
    - **Action:**
        1. Open `tsconfig.jest.json`.
        2. Ensure it includes `"extends": "./tsconfig.json"`.
        3. Remove any `compilerOptions` that weaken strictness (e.g., `"noImplicitAny": false`).
        4. Verify `isolatedModules` is set to `false` if required by `ts-jest` and document confirmation that this doesn't compromise type safety enforcement.
        5. Ensure `include` patterns correctly cover all test files (`**/*.test.ts`, `**/*.test.tsx`) and test-related files (`__mocks__/**/*`).
    - **Done‑when:**
        1. `tsconfig.jest.json` extends root config.
        2. No strictness-weakening options are present in `tsconfig.jest.json`.
        3. Test file includes are correct.
        4. `pnpm typecheck` command continues to run, incorporating the updated jest config for test files.
    - **Depends‑on:** [T001]

- [ ] **T003 · Refactor · P1:** Remediate type errors in core and shared code
    - **Context:** Plan: Detailed Build Steps 4 (Phase 1), Error & Edge-Case Strategy
    - **Action:**
        1. Run `pnpm typecheck` to see current errors.
        2. Systematically fix type errors identified in `lib/` and foundational UI components (`components/ui/` or similar).
        3. Apply remediation principles: replace `any`, handle null/undefined, fix type mismatches, use type guards/assertions judiciously with comments/justification.
        4. Note any instances where fixing type errors reveals potential Mocking Policy violations (TEST-008) for later refactoring.
    - **Done‑when:**
        1. `pnpm typecheck` reports no errors in `lib/` and foundational UI component directories.
        2. Relevant unit tests (`pnpm test <affected_dirs>`) pass.
    - **Verification:** Run `pnpm typecheck` and verify output contains no errors for the specified directories.
    - **Depends‑on:** [T002]

- [ ] **T004 · Refactor · P1:** Remediate type errors in application and feature code
    - **Context:** Plan: Detailed Build Steps 4 (Phase 2), Error & Edge-Case Strategy
    - **Action:**
        1. Run `pnpm typecheck` to see current errors.
        2. Systematically fix type errors identified in application logic, remaining components (`components/molecules/`, `components/organisms/`), and pages (`app/`).
        3. Apply remediation principles: replace `any`, handle null/undefined, fix type mismatches, use type guards/assertions judiciously with comments/justification.
        4. Note any instances where fixing type errors reveals potential Mocking Policy violations (TEST-008) for later refactoring.
    - **Done‑when:**
        1. `pnpm typecheck` reports no errors in application/feature code directories.
        2. Relevant unit tests (`pnpm test <affected_dirs>`) pass.
    - **Verification:** Run `pnpm typecheck` and verify output contains no errors for the specified directories.
    - **Depends‑on:** [T003]

- [ ] **T005 · Refactor · P1:** Remediate type errors in test code
    - **Context:** Plan: Detailed Build Steps 4 (Phase 3), Error & Edge-Case Strategy, Testing Strategy
    - **Action:**
        1. Run `pnpm typecheck` to see current errors.
        2. Systematically fix type errors identified in `__tests__/`.
        3. Ensure mock functions and test helpers are correctly typed (e.g., `jest.MockedFunction`).
        4. Ensure test data and component props used in tests are correctly typed.
        5. Apply remediation principles: replace `any`, handle null/undefined, fix type mismatches, use type guards/assertions judiciously with comments/justification.
    - **Done‑when:**
        1. `pnpm typecheck` reports no errors across the entire project.
        2. The full test suite (`pnpm test`) passes.
        3. The application build (`pnpm build`) completes successfully.
    - **Verification:**
        1. Run `pnpm typecheck` from the project root and confirm zero errors.
        2. Run `pnpm test` and confirm all tests pass.
        3. Run `pnpm build` and confirm it completes successfully.
    - **Depends‑on:** [T004]

- [ ] **T006 · Chore · P2:** Update developer documentation regarding strict TypeScript policy
    - **Context:** Plan: Documentation, Open Questions (Consensus on `@ts-expect-error`)
    - **Action:**
        1. Update `CONTRIBUTING.md` or relevant developer guide.
        2. Add a section titled "TypeScript Strictness Policy".
        3. State that full strictness (`strict: true`) is enforced across all code (app and tests).
        4. Explicitly prohibit the use of `any`.
        5. Define the policy for temporary type suppression (`@ts-expect-error`): require a detailed comment explaining justification and a link to a tracking ticket (JIRA/GitHub Issue) for remediation.
        6. Mention that `pnpm typecheck` must pass before committing/merging, and that CI enforces this.
    - **Done‑when:**
        1. Developer documentation is updated with the strict TS policy.
        2. Policy on type suppression is clearly defined and documented.
    - **Depends‑on:** [T005]

- [ ] **T007 · Chore · P2:** Configure pre-commit hook for typescript typecheck
    - **Context:** Plan: Detailed Build Steps 8, Automation, Quality Gates, and CI/CD 1
    - **Action:**
        1. Configure the pre-commit hook framework (e.g., Husky + lint-staged).
        2. Add a step to run `pnpm typecheck` on staged `.ts` and `.tsx` files.
        3. Ensure the hook fails the commit if `pnpm typecheck` reports errors.
    - **Done‑when:**
        1. Pre-commit hook is configured.
        2. Committing files with type errors is prevented by the hook.
    - **Depends‑on:** [T005]

## Clarifications & Assumptions
- [ ] **Issue:** Identify specific large or complex legacy modules that might require focused effort.
    - **Context:** Plan: Open Questions
    - **Blocking?:** no

- [ ] **Issue:** Verify if all third-party dependencies have adequate TypeScript definitions (`@types/` packages).
    - **Context:** Plan: Open Questions
    - **Blocking?:** no

- [ ] **Issue:** Establish consensus on the process for using, tracking, and remediating temporary `@ts-expect-error` suppressions.
    - **Context:** Plan: Open Questions (already partially addressed in T006 action, but needs team/stakeholder agreement).
    - **Blocking?:** no

- [ ] **Issue:** Consider adding an automated lint rule to disallow `any` and/or enforce the suppression comment policy.
    - **Context:** Plan: Open Questions
    - **Blocking?:** no (suggested as a follow-up task)
```