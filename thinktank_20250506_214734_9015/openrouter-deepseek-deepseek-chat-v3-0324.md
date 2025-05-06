# Todo

## TypeScript Configuration
- [ ] **T001 · Refactor · P0: verify and harden root tsconfig.json**
    - **Context:** Detailed Build Steps - Step 1
    - **Action:**
        1. Open root tsconfig.json
        2. Ensure "strict": true is present
        3. Add all individual strictness flags from DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md
    - **Done-when:**
        1. Root tsconfig.json contains all required strictness flags
    - **Depends-on:** none

- [ ] **T002 · Refactor · P0: align tsconfig.jest.json with root config**
    - **Context:** Detailed Build Steps - Step 2
    - **Action:**
        1. Ensure tsconfig.jest.json extends root config
        2. Remove any strictness-weakening overrides
        3. Verify isolatedModules setting
    - **Done-when:**
        1. Jest config inherits all strictness from root without weakening
    - **Depends-on:** [T001]

## Type Error Remediation
- [ ] **T003 · Refactor · P1: fix type errors in core/shared code**
    - **Context:** Detailed Build Steps - Step 4, Phase 1
    - **Action:**
        1. Run initial type check
        2. Fix errors in lib/ and foundational UI components
    - **Done-when:**
        1. All type errors in shared code are resolved
    - **Depends-on:** [T002]
    - **Verification:**
        1. Run pnpm typecheck
        2. Run affected unit tests

- [ ] **T004 · Refactor · P1: fix type errors in application code**
    - **Context:** Detailed Build Steps - Step 4, Phase 2
    - **Action:**
        1. Fix errors in components/ and app/
    - **Done-when:**
        1. All type errors in application code are resolved
    - **Depends-on:** [T003]
    - **Verification:**
        1. Run pnpm typecheck
        2. Run affected unit tests

- [ ] **T005 · Refactor · P1: fix type errors in test code**
    - **Context:** Detailed Build Steps - Step 4, Phase 3
    - **Action:**
        1. Fix type errors in __tests__/
        2. Document any TEST-008 violations found
    - **Done-when:**
        1. All test files pass type checking
    - **Depends-on:** [T004]
    - **Verification:**
        1. Run pnpm typecheck
        2. Run full test suite

## Verification & CI
- [ ] **T006 · Chore · P1: configure pre-commit type checking**
    - **Context:** Detailed Build Steps - Step 8
    - **Action:**
        1. Set up pre-commit hook to run typecheck on staged files
    - **Done-when:**
        1. Attempting to commit type errors fails the commit
    - **Depends-on:** [T005]

- [ ] **T007 · Chore · P1: verify full project type safety**
    - **Context:** Detailed Build Steps - Step 7
    - **Action:**
        1. Run pnpm typecheck for entire project
        2. Run full test suite
        3. Verify build completes
    - **Done-when:**
        1. All verification steps pass
    - **Depends-on:** [T005]

## Documentation
- [ ] **T008 · Docs · P2: update contributing docs for strict TS**
    - **Context:** Documentation section
    - **Action:**
        1. Add TypeScript Strictness Policy section to CONTRIBUTING.md
        2. Document prohibition of any and suppression directives
    - **Done-when:**
        1. Documentation reflects current strict type requirements
    - **Depends-on:** [T007]

### Clarifications and Assumptions
- [ ] **Issue:** Handling of complex legacy modules with implicit any
    - **Context:** Open Questions
    - **Blocking?:** no

- [ ] **Issue:** Third-party type definitions completeness
    - **Context:** Open Questions
    - **Blocking?:** no

- [ ] **Issue:** Policy on temporary @ts-expect-error usage
    - **Context:** Open Questions
    - **Blocking?:** no