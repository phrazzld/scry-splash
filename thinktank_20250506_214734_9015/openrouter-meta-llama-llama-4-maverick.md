# Todo

## Enable Strict TypeScript Configuration

- [ ] **T001 · Chore · P1: Verify and Harden Root `tsconfig.json`**
    - **Context:** Ensure `"strict": true` is present and enabled. Add/confirm individual strictness flags (e.g., `noImplicitAny`, `strictNullChecks`).
    - **Action:**
        1. Open `tsconfig.json`.
        2. Confirm `"strict": true`.
        3. Add individual strict flags as per `DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md`.
    - **Done‑when:**
        1. `tsconfig.json` has `"strict": true` and listed strict flags.
    - **Depends‑on:** none

- [ ] **T002 · Chore · P1: Align `tsconfig.jest.json` with Root Config**
    - **Context:** `tsconfig.jest.json` should extend `tsconfig.json` without weakening strictness.
    - **Action:**
        1. Open `tsconfig.jest.json`.
        2. Ensure it extends `tsconfig.json`.
        3. Remove strictness-weakening overrides.
        4. Verify `isolatedModules: false` if required and safe.
    - **Done‑when:**
        1. `tsconfig.jest.json` extends root config without weakening strictness.
    - **Depends‑on:** T001

- [ ] **T003 · Chore · P2: Initial Type Check and Error Cataloging**
    - **Context:** Run `pnpm typecheck` to identify type errors.
    - **Action:**
        1. Run `pnpm typecheck`.
        2. Catalog or navigate type errors.
    - **Done‑when:**
        1. Type errors are identified and cataloged.
    - **Depends‑on:** T002

- [ ] **T004 · Chore · P2: Systematic Error Remediation (Core & Shared Code)**
    - **Context:** Prioritize fixing errors in shared utilities and foundational UI components.
    - **Action:**
        1. Fix type errors in `lib/` and foundational UI components.
        2. Re-run `pnpm typecheck` after fixes.
    - **Done‑when:**
        1. Core and shared code type errors are resolved.
    - **Depends‑on:** T003

- [ ] **T005 · Chore · P2: Systematic Error Remediation (Application & Feature Code)**
    - **Context:** Address errors in application logic, remaining components, and pages.
    - **Action:**
        1. Fix type errors in application logic and remaining components.
        2. Re-run `pnpm typecheck` after fixes.
    - **Done‑when:**
        1. Application and feature code type errors are resolved.
    - **Depends‑on:** T004

- [ ] **T006 · Chore · P2: Systematic Error Remediation (Test Code)**
    - **Context:** Address type errors within test files.
    - **Action:**
        1. Fix type errors in `__tests__/`.
        2. Re-run `pnpm typecheck` after fixes.
    - **Done‑when:**
        1. Test code type errors are resolved.
    - **Depends‑on:** T005

- [ ] **T007 · Chore · P2: Refactor Mocking as Needed**
    - **Context:** Document mocking policy violations for refactoring under TEST-008.
    - **Action:**
        1. Identify and document mocking policy violations.
    - **Done‑when:**
        1. Mocking policy violations are documented.
    - **Depends‑on:** T006

- [ ] **T008 · Chore · P2: Full Project Verification**
    - **Context:** Verify the entire project has no type errors and tests pass.
    - **Action:**
        1. Run `pnpm typecheck` for the entire project.
        2. Run `pnpm test`.
        3. Run `pnpm build`.
    - **Done‑when:**
        1. `pnpm typecheck`, `pnpm test`, and `pnpm build` all succeed.
    - **Depends‑on:** T007

- [ ] **T009 · Chore · P2: Pre-Commit Hook Configuration**
    - **Context:** Ensure pre-commit hooks run `pnpm typecheck` on staged files.
    - **Action:**
        1. Configure pre-commit hooks (e.g., Husky + lint-staged).
    - **Done‑when:**
        1. Pre-commit hooks are configured to run `pnpm typecheck`.
    - **Depends‑on:** T008

- [ ] **T010 · Chore · P1: Commit Changes and Update Documentation**
    - **Context:** Commit changes and update `CONTRIBUTING.md` and onboarding documentation.
    - **Action:**
        1. Commit updated configs and fixed files.
        2. Update `CONTRIBUTING.md` and onboarding docs.
    - **Done‑when:**
        1. Changes are committed and documentation is updated.
    - **Depends‑on:** T009

- [ ] **T011 · Chore · P1: CI Integration**
    - **Context:** Configure CI to run `pnpm typecheck` and fail on type errors (AUTO-003).
    - **Action:**
        1. Configure CI pipeline to run `pnpm typecheck`.
    - **Done‑when:**
        1. CI pipeline is configured and fails on type errors.
    - **Depends‑on:** T010

### Clarifications & Assumptions
- [ ] **Issue: Handling Large Legacy Modules**
    - **Context:** PLAN.md reference to large legacy modules.
    - **Blocking?:** yes

- [ ] **Issue: Third-Party Dependencies Type Definitions**
    - **Context:** PLAN.md reference to third-party dependencies.
    - **Blocking?:** yes

- [ ] **Issue: Acceptable Use of `@ts-expect-error`**
    - **Context:** PLAN.md reference to `@ts-expect-error`.
    - **Blocking?:** yes