# Todo

## Strict TypeScript Configuration (TS-001)
- [ ] **T001 · Refactor · P1: harden root tsconfig.json for full strictness**
    - **Context:** PLAN.md > Detailed Build Steps > 1. Verify and Harden Root `tsconfig.json`; PLAN.md > Architecture Blueprint > Public Interfaces / Contracts > Example `tsconfig.json` strict settings
    - **Action:**
        1. Open the root `tsconfig.json` and ensure `"strict": true` is enabled.
        2. Explicitly add or confirm all individual strictness flags as specified in `DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md` (e.g., `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `useUnknownInCatchVariables`, etc.).
        3. Evaluate and enable `"exactOptionalPropertyTypes": true` and `"noUncheckedIndexedAccess": true` if feasible for the current TypeScript version and project.
    - **Done‑when:**
        1. Root `tsconfig.json` is updated with all required strictness settings.
        2. The configuration aligns with `DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md` regarding strictness.
        3. Decisions on `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are made and implemented.
    - **Verification:**
        1. Review `tsconfig.json` against the requirements.
        2. Run `pnpm typecheck` (or `tsc --noEmit -p tsconfig.json`) and observe initial error output (errors are expected at this stage for project files).
    - **Depends‑on:** none

- [ ] **T002 · Refactor · P1: align tsconfig.jest.json with strict root configuration**
    - **Context:** PLAN.md > Detailed Build Steps > 2. Align `tsconfig.jest.json`; PLAN.md > Architecture Blueprint > Public Interfaces / Contracts > `tsconfig.jest.json` extends `tsconfig.json`
    - **Action:**
        1. Open `tsconfig.jest.json` and ensure it `extends` the root `tsconfig.json`.
        2. Remove any options that weaken strictness inherited from the root config (e.g., remove `"noImplicitAny": false`).
        3. Set/confirm `"isolatedModules": false` if required by `ts-jest`, and verify this setting does not compromise overall type safety enforcement by `tsc --noEmit`.
        4. Ensure `include` patterns correctly cover all test files (`**/*.test.ts`, `**/*.test.tsx`, `__mocks__/**/*`, etc.).
    - **Done‑when:**
        1. `tsconfig.jest.json` is updated to extend the root config and not weaken strictness.
        2. `isolatedModules` setting is confirmed appropriate for `ts-jest` without harming type safety.
        3. Test file inclusion patterns are correct.
    - **Verification:**
        1. Review `tsconfig.jest.json` changes.
        2. Run `pnpm typecheck` (or `tsc --noEmit -p tsconfig.jest.json`) and observe initial error output for test files.
    - **Depends‑on:** [T001]

- [ ] **T003 · Refactor · P1: remediate type errors in core and shared code**
    - **Context:** PLAN.md > Detailed Build Steps > 4. Systematic Error Remediation > Phase 1: Core & Shared Code
    - **Action:**
        1. Address all TypeScript errors reported by `pnpm typecheck` within shared utilities (`lib/`) and foundational UI components (`components/ui/` or similar).
        2. Apply error resolution principles: replace `any`, handle `null`/`undefined` explicitly, correct type mismatches. Use type assertions (`as T`) sparingly with justification.
        3. Add/update TSDoc comments for public APIs or complex types in this scope if types alone don't explain intent/usage, in accordance with DOC-001.
    - **Done‑when:**
        1. `pnpm typecheck` reports no errors for `lib/` and `components/ui/` (or designated core/shared modules).
        2. Any temporary `@ts-expect-error` suppressions used are documented with an explanation and a JIRA ticket reference for follow-up.
        3. Relevant TSDoc comments are added/updated.
        4. Existing unit tests for affected code pass.
    - **Verification:**
        1. Run `pnpm typecheck` and confirm no errors in the specified scope.
        2. Run relevant unit tests (e.g., `pnpm test lib/ components/ui/`) and confirm they pass.
        3. Review changes for adherence to type-fixing strategies and TSDoc.
    - **Depends‑on:** [T001, T002]

- [ ] **T004 · Refactor · P1: remediate type errors in application and feature code**
    - **Context:** PLAN.md > Detailed Build Steps > 4. Systematic Error Remediation > Phase 2: Application & Feature Code
    - **Action:**
        1. Address all TypeScript errors reported by `pnpm typecheck` within application logic, remaining components (`components/molecules/`, `components/organisms/`), and pages (`app/`).
        2. Apply error resolution principles: replace `any`, handle `null`/`undefined` explicitly, correct type mismatches. Use type assertions (`as T`) sparingly with justification.
        3. Add/update TSDoc comments for public APIs or complex types in this scope if types alone don't explain intent/usage, in accordance with DOC-001.
    - **Done‑when:**
        1. `pnpm typecheck` reports no errors for the specified application/feature code scope.
        2. Any temporary `@ts-expect-error` suppressions used are documented with an explanation and a JIRA ticket reference for follow-up.
        3. Relevant TSDoc comments are added/updated.
        4. Existing unit/integration tests for affected code pass.
    - **Verification:**
        1. Run `pnpm typecheck` and confirm no errors in the specified scope.
        2. Run relevant tests (e.g., `pnpm test app/ components/`) and confirm they pass.
        3. Review changes for adherence to type-fixing strategies and TSDoc.
    - **Depends‑on:** [T003]

- [ ] **T005 · Refactor · P1: remediate type errors in test code**
    - **Context:** PLAN.md > Detailed Build Steps > 4. Systematic Error Remediation > Phase 3: Test Code
    - **Action:**
        1. Address all TypeScript errors reported by `pnpm typecheck` within test files (`__tests__/`).
        2. Ensure mock functions, test data, and component props used in tests are correctly typed (e.g., `jest.MockedFunction`).
        3. Add/update TSDoc comments for complex test helper functions if types alone don't explain intent/usage, in accordance with DOC-001.
    - **Done‑when:**
        1. `pnpm typecheck` reports no errors for `__tests__/`.
        2. Any temporary `@ts-expect-error` suppressions used are documented with an explanation and a JIRA ticket reference for follow-up.
        3. All tests in the suite (`pnpm test`) pass.
    - **Verification:**
        1. Run `pnpm typecheck` and confirm no errors in `__tests__/`.
        2. Run the full test suite (`pnpm test`) and confirm all tests pass.
        3. Review changes for correct typing of test constructs.
    - **Depends‑on:** [T004]

- [ ] **T006 · Chore · P2: document identified mocking policy violations for TEST-008**
    - **Context:** PLAN.md > Detailed Build Steps > 5. Refactor Mocking (as needed, inform TEST-008); PLAN.md > Risk Matrix > Uncovering widespread Mocking Policy violations
    - **Action:**
        1. Collate all instances identified during T003, T004, T005 where tests mock internal components/modules (violating Mocking Policy / TEST-008).
        2. Create a document or issue summarizing these violations, providing context for each, to inform the work planned under TEST-008.
    - **Done‑when:**
        1. A list of mocking policy violations, with locations and brief descriptions, is compiled.
        2. This information is formally passed to the team/individual responsible for TEST-008.
    - **Depends‑on:** [T005]

- [ ] **T007 · Chore · P2: update CONTRIBUTING.md with typescript strictness policy**
    - **Context:** PLAN.md > Documentation > `CONTRIBUTING.md` / Developer Guide Updates
    - **Action:**
        1. Add a new section to `CONTRIBUTING.md` (or relevant developer guide) titled "TypeScript Strictness Policy".
        2. Document that full strictness is enforced, `any` is prohibited, and type suppression directives (`@ts-ignore`, `@ts-expect-error`) are forbidden without tracked exceptions.
        3. State that `pnpm typecheck` must pass before committing/merging.
    - **Done‑when:**
        1. `CONTRIBUTING.md` (or equivalent) is updated with the TypeScript strictness policy.
    - **Verification:**
        1. Review the updated section in `CONTRIBUTING.md`.
    - **Depends‑on:** [T005]

- [ ] **T008 · Chore · P2: update onboarding documentation for ide typescript settings**
    - **Context:** PLAN.md > Documentation > Onboarding Documentation
    - **Action:**
        1. Review and update onboarding materials for new developers.
        2. Ensure guidance is included for configuring IDEs to use the project's TypeScript version and `tsconfig.json` for real-time feedback.
    - **Done‑when:**
        1. Onboarding documentation includes clear instructions for IDE TypeScript integration.
    - **Verification:**
        1. Review the updated onboarding documentation.
    - **Depends‑on:** [T005]

- [ ] **T009 · Chore · P2: configure pre-commit hook for typescript type checking**
    - **Context:** PLAN.md > Detailed Build Steps > 8. Pre-Commit Hook Configuration
    - **Action:**
        1. If pre-commit hooks (e.g., Husky + lint-staged) are in use, configure them to run `pnpm typecheck` (or `tsc --noEmit`) on staged TypeScript files.
        2. If pre-commit hooks are not in use, evaluate and propose their setup as a separate initiative. For this ticket, document the decision.
    - **Done‑when:**
        1. Pre-commit hook is configured to run type checks on staged files, or a decision about not implementing it now is documented.
        2. The hook successfully prevents commits if type errors are present in staged files (if implemented).
    - **Verification:**
        1. Attempt to commit a file with a type error; verify the commit is blocked by the hook (if implemented).
        2. Attempt to commit a file without type errors; verify the commit proceeds.
    - **Depends‑on:** [T005]

### Clarifications & Assumptions
- [ ] **Issue:** Potential for large, complex legacy modules heavily reliant on implicit `any`.
    - **Context:** PLAN.md > Open Questions
    - **Blocking?:** no (Mitigation via phased approach and temporary `@ts-expect-error` with tracking if absolutely necessary)
- [ ] **Issue:** Status of TypeScript definitions for all third-party dependencies.
    - **Context:** PLAN.md > Open Questions
    - **Blocking?:** no (Remediation tasks T003-T005 will uncover these; mitigation includes finding/adding `@types/` packages or local declarations)
- [ ] **Issue:** Formal consensus and process for using temporary `// @ts-expect-error`.
    - **Context:** PLAN.md > Open Questions (Plan proposes: "only with explicit JIRA ticket and explanation")
    - **Blocking?:** no (The proposed process will be followed; formal consensus can be sought in parallel or as a follow-up)
- [ ] **Issue:** Decision on adding automated lint rules to prevent strictness regressions (e.g., disallow `any`, suppression comments).
    - **Context:** PLAN.md > Open Questions
    - **Blocking?:** no (Considered a follow-up task; current plan focuses on initial enablement and remediation)
- [ ] **Assumption:** The project uses `pnpm` as its package manager and `pnpm typecheck` is an existing script alias for `tsc --noEmit` or a similar command. If not, commands will be adjusted.
    - **Context:** Inferred from `PLAN.md` > Detailed Build Steps > 3. Initial Type Check
    - **Blocking?:** no
- [ ] **Assumption:** `DOC-001`, `TEST-008`, `AUTO-003` are existing external policies/ticket IDs that this plan's tasks will align with or inform.
    - **Context:** References in PLAN.md
    - **Blocking?:** no