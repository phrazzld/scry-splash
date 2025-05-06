# Todo

## TypeScript strictness
- [ ] **T001 · Chore · P1: verify and update root tsconfig.json**
    - Context: Detailed Build Steps – step 1
    - Action:
        1. Open root `tsconfig.json`.
        2. Ensure `"strict": true` and explicitly list all individual strict flags per Appendix TypeScript (e.g., `noImplicitAny`, `strictNullChecks`, etc.).
        3. Commit the updated `tsconfig.json`.
    - Done-when:
        1. `tsconfig.json` contains `"strict": true` and all specified strict compilerOptions.
    - Verification:
        1. Run `tsc --noEmit` locally and confirm no missing-flag errors.
    - Depends-on: none

- [ ] **T002 · Chore · P1: verify and update tsconfig.jest.json**
    - Context: Detailed Build Steps – step 2
    - Action:
        1. Open `tsconfig.jest.json`.
        2. Ensure it `extends` the root `tsconfig.json` and remove any strictness-weakening overrides.
        3. Confirm its `include` patterns cover all test files and mocks.
    - Done-when:
        1. `tsconfig.jest.json` extends root config without weakening strict flags.
    - Verification:
        1. Run `tsc --noEmit --project tsconfig.jest.json` and verify only code errors appear.
    - Depends-on: T001

- [ ] **T003 · Chore · P1: add pnpm typecheck script and pre-commit hook**
    - Context: CI Integration (Detailed Build Steps – steps 8–9)
    - Action:
        1. Add `"typecheck": "tsc --noEmit"` to `package.json` scripts.
        2. Configure pre-commit hook (e.g., Husky + lint-staged) to run `pnpm typecheck`.
        3. Update CI pipeline to execute `pnpm typecheck`.
    - Done-when:
        1. `pnpm typecheck` runs successfully without syntax errors.
        2. Pre-commit hook blocks commits when type errors exist.
        3. CI pipeline fails on type errors.
    - Verification:
        1. Introduce a deliberate type error and confirm failure locally and in CI.
    - Depends-on: T001, T002

- [ ] **T004 · Chore · P2: fix strict type errors in shared utilities (lib/)**
    - Context: Detailed Build Steps – step 4 Phase 1
    - Action:
        1. Run `pnpm typecheck` and filter errors under `lib/`.
        2. Remediate implicit `any`, null/undefined issues, and type mismatches in `lib/`.
        3. Replace non-null assertions with proper type guards when needed.
    - Done-when:
        1. No type errors reported in `lib/` by `pnpm typecheck`.
    - Verification:
        1. Run `pnpm typecheck --include lib/**/*` and confirm zero errors.
    - Depends-on: T003

- [ ] **T005 · Chore · P2: fix strict type errors in foundational UI components**
    - Context: Detailed Build Steps – step 4 Phase 1
    - Action:
        1. Run `pnpm typecheck` and filter errors under UI component directories (e.g., `components/ui/`).
        2. Update props interfaces, handle optional values, and add explicit types.
        3. Remove unsafe non-null assertions or justify with comments if absolutely necessary.
    - Done-when:
        1. `pnpm typecheck` reports no errors in foundational UI component directories.
    - Verification:
        1. Build and view Storybook; ensure components render without runtime errors.
    - Depends-on: T003

- [ ] **T006 · Chore · P2: fix strict type errors in application and feature code (app/, src/)**
    - Context: Detailed Build Steps – step 4 Phase 2
    - Action:
        1. Identify and fix type errors in `app/` and `src/` directories.
        2. Update component/page signatures, add type guards, and handle optional/null values explicitly.
        3. Refactor code to simplify complex patterns impeding type safety.
    - Done-when:
        1. No type errors in `app/` and `src/` reported by `pnpm typecheck`.
    - Verification:
        1. Run `pnpm build` and confirm successful compilation.
    - Depends-on: T003

- [ ] **T007 · Chore · P2: fix strict type errors in test code (__tests__/)**
    - Context: Detailed Build Steps – step 4 Phase 3
    - Action:
        1. Run `pnpm typecheck --project tsconfig.jest.json` and filter errors in `__tests__/`.
        2. Update mocks, test helpers, and test data types (e.g., use `jest.MockedFunction`).
        3. Replace unsafe assertions with proper type-safe patterns.
    - Done-when:
        1. `pnpm typecheck --project tsconfig.jest.json` reports no errors in tests.
    - Verification:
        1. Run `pnpm test` and confirm all tests pass.
    - Depends-on: T003

- [ ] **T008 · Chore · P2: document internal mocking policy violations in tests**
    - Context: Detailed Build Steps – step 5
    - Action:
        1. Search `__tests__/` for mocks of internal modules (e.g., `jest.mock('../components/...')`).
        2. List file paths and mocked modules in a markdown document (`TEST-008-mocking-violations.md`).
        3. Reference documented violations for a follow-up TEST-008 ticket.
    - Done-when:
        1. Document lists all instances of internal-module mocking.
    - Verification:
        1. Review the document and confirm coverage of violations.
    - Depends-on: T007

### Clarifications & Assumptions
- [ ] Issue: identification of large legacy modules heavily relying on implicit `any`.  
    - Context: PLAN.md Open Questions – bullet 1  
    - Blocking?: no
- [ ] Issue: completeness of TypeScript definitions for third-party dependencies.  
    - Context: PLAN.md Open Questions – bullet 2  
    - Blocking?: no
- [ ] Issue: acceptable process for temporary use of `// @ts-expect-error`.  
    - Context: PLAN.md Open Questions – bullet 3  
    - Blocking?: no
- [ ] Issue: adding an ESLint rule to disallow `any` and suppression comments.  
    - Context: PLAN.md Open Questions – bullet 4  
    - Blocking?: no