# Todo

## TypeScript Configuration
- [ ] **T001 · Chore · P1: Harden root TypeScript configuration**
    - **Context:** "Verify and Harden Root `tsconfig.json`" section
    - **Action:**
        1. Add all strict compiler flags to tsconfig.json per development philosophy
        2. Explicitly list individual strictness flags beyond "strict": true
    - **Done-when:**
        1. tsconfig.json contains all required strictness flags from Appendix TypeScript
    - **Verification:**
        1. Run `tsc --showConfig | grep strict` to verify enabled flags

- [ ] **T002 · Chore · P1: Align Jest TypeScript configuration**
    - **Context:** "Align `tsconfig.jest.json`" section
    - **Action:**
        1. Make tsconfig.jest.json extend root config
        2. Remove any strictness-weakening overrides
    - **Done-when:**
        1. Jest config inherits all root strictness rules
        1. `isolatedModules` set to false if required by ts-jest
    - **Depends-on:** [T001]

## Type Error Remediation
- [ ] **T003 · Refactor · P2: Fix core/shared code type errors**
    - **Context:** "Phase 1: Core & Shared Code" section
    - **Action:**
        1. Address type errors in lib/ and foundational components
        2. Replace implicit any with explicit types/guards
    - **Done-when:**
        1. `pnpm typecheck` shows zero errors in lib/**/* and components/ui/**
    - **Depends-on:** [T001, T002]

- [ ] **T004 · Refactor · P2: Fix application feature code type errors**
    - **Context:** "Phase 2: Application & Feature Code" section
    - **Action:**
        1. Resolve type errors in app/ and feature components
        2. Implement proper null/undefined handling
    - **Done-when:**
        1. `pnpm typecheck` shows zero errors in app/**/* and components/{molecules,organisms}/**/*
    - **Depends-on:** [T003]

- [ ] **T005 · Test · P2: Fix test code type violations**
    - **Context:** "Phase 3: Test Code" section
    - **Action:**
        1. Type all test mocks and helper functions
        2. Annotate test cases with proper types
    - **Done-when:**
        1. `pnpm typecheck` passes on __tests__/**/* 
    - **Verification:**
        1. All Jest tests pass after type fixes
    - **Depends-on:** [T004]

## Infrastructure
- [ ] **T006 · Chore · P1: Enforce type checking in CI**
    - **Context:** "CI Integration" section
    - **Action:**
        1. Add `pnpm typecheck` to CI pipeline
        2. Configure build failure on type errors
    - **Done-when:**
        1. CI job fails if any TypeScript errors exist
    - **Depends-on:** [T005]

## Documentation
- [ ] **T007 · Chore · P2: Document TypeScript strictness policies**
    - **Context:** Documentation section
    - **Action:**
        1. Add TypeScript guidelines to CONTRIBUTING.md
        2. Update onboarding docs with typecheck requirements
    - **Done-when:**
        1. Documentation contains enforced strictness rules
        1. Docs mention prohibition of @ts-ignore/@ts-expect-error

### Clarifications & Assumptions
- [ ] **Issue:** Third-party type definition gaps
    - **Context:** Open Questions section
    - **Blocking?:** No
- [ ] **Issue:** Legacy module remediation process
    - **Context:** Risk Matrix
    - **Blocking?:** No
- [ ] **Issue:** Temporary @ts-expect-error approval process
    - **Context:** Open Questions
    - **Blocking?:** No