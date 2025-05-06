```markdown
# Plan Title: Enable Strict TypeScript Configuration (TS-001)

## Chosen Approach (One-liner)

Establish a single-source-of-truth TypeScript config enforcing full strictness (including in tests), with zero weakening or `any` suppression, and remediate all codebase violations up front to guarantee type safety.

---

## Architecture Blueprint

- **Modules / Packages**
  - `tsconfig.json` → Root TypeScript config, strictest settings, source of truth.
  - `tsconfig.jest.json` → Extends root config, *no* weakening, test-only overrides must not reduce strictness.
  - All `*.ts`/`*.tsx` code and tests → Must pass strict rules, no `any`, no disables.
- **Public Interfaces / Contracts**
  - `tsconfig.json`:
    ```json
    {
      "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "strictBindCallApply": true,
        "strictPropertyInitialization": true,
        "noImplicitThis": true,
        "useUnknownInCatchVariables": true,
        "alwaysStrict": true,
        ...
      }
    }
    ```
  - `tsconfig.jest.json`:
    ```json
    {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "jsx": "react-jsx",
        "isolatedModules": false
        // NO "noImplicitAny": false or any strictness reduction!
      },
      ...
    }
    ```
- **Data Flow Diagram**
  ```mermaid
  flowchart TD
    tsconfig.json --> tsconfig.jest.json
    tsconfig.json & tsconfig.jest.json --> AllCode[All *.ts(x) code & tests]
    AllCode --> [TypeScript Compiler ("strict": true enforced everywhere)]
  ```
- **Error & Edge‑Case Strategy**
  - Any code using implicit `any`, or violating strict type checks, must be refactored or have precise, justified types.
  - No type suppression (`as any`, `@ts-ignore`, etc.) except in rare, explicit, documented cases (per philosophy).
  - Third-party types: use `unknown` and assert, or create precise type wrappers if @types are missing.

---

## Detailed Build Steps

1. **Audit Current Configurations**
   - Open `tsconfig.json` and confirm `"strict": true` and all individual strictness flags are present and enabled.
   - Audit for any missing flags (see above); add them explicitly for clarity and future-proofing.

2. **Update `tsconfig.jest.json`**
   - Remove `"noImplicitAny": false`. 
   - Ensure `"extends": "./tsconfig.json"` is present and *no* strictness-reducing overrides remain.
   - Only test-specific options (e.g., `"jsx": "react-jsx"`, `"isolatedModules": false`) allowed if they do **not** reduce type safety.

3. **Re-run Full TypeScript Check**
   - Execute `pnpm typecheck` (or `tsc --noEmit`) at project root.
   - Expect failures where existing code violates strict typing.

4. **Systematic Violation Remediation**
   - For each type error:
     - Refactor code to use precise types/interfaces. 
     - Replace all implicit `any` with explicit types or `unknown` + type guards.
     - Remove any `@ts-ignore`, `@ts-expect-error`, or `as any` unless *absolutely unavoidable* (must add a comment with explanation if used).
   - For test files:
     - Apply the same standard—tests are production code.
     - Update mocks, test helpers, and custom render utilities to be strictly typed.

5. **Third-Party Library Typings**
   - If any dependency lacks types:
     - Prefer `unknown` and explicit type assertion (with runtime guards if possible).
     - If a type is critical, add minimal local type definitions in `@types/` or `global.d.ts`—do **not** use global `any`.

6. **CI Enforcement (Preparation)**
   - Ensure `"pnpm typecheck"` is run in local hooks and CI (as per AUTO-003), and fails the build on type errors.
   - Document this requirement in README/contributing docs.

7. **Developer Guidance & Documentation**
   - Update README and CONTRIBUTING.md to state strict typing is non-negotiable, applies equally to tests, and that all code must pass `pnpm typecheck` before commit/merge.

8. **Final Verification**
   - Confirm: 
     - All code (including tests) compiles with strict settings.
     - No `any` types remain (except justified, rare exceptions).
     - No strictness reduction in any tsconfig variant.
   - Run full test suite to ensure refactoring did not cause regressions.

---

## Testing Strategy

- **Test layers**
  - Typechecking is enforced for all code: app, components, and test files.
  - No mock-specific, type-lax test layers; strict typing applies everywhere.
- **What to mock**
  - Only true externals (e.g., browser APIs, fetch, node modules) may be mocked—always typed via interfaces or `unknown`, never `any`.
  - NEVER mock or cast internal code to `any`. Refactor for testability instead.
- **Coverage targets & edge-case notes**
  - 100% of code and tests must pass strict type checking.
  - All type errors, including in rarely-invoked code paths, must be remediated.

---

## Logging & Observability

- **Log events**
  - N/A for this config task.
- **Correlation ID propagation**
  - N/A.

---

## Security & Config

- **Input validation hotspots**
  - Any user input or external data used in types must be validated (e.g., when asserting `unknown` to specific types).
- **Secrets handling**
  - N/A for config, but verify that no sensitive info is typed as `any` (prevents accidental misuse).
- **Least-privilege notes**
  - Do not grant broad type permissions; specific over general.

---

## Documentation

- **Code self-doc patterns**
  - Add TSDoc comments *only* where type signature alone is not self-explanatory (per philosophy).
  - For any unavoidable `as any` or disables (should be zero), comment *why* with a link to the issue or upstream blocker.
- **README and contributing updates**
  - Add a "TypeScript Strictness" section: document that `"strict": true` is mandatory everywhere, including all test code, and that `any`/suppression is prohibited except in rare, justified cases.
  - Example blurb:
    ```
    All code (including tests) must pass TypeScript's strictest settings. Use of `any`, `@ts-ignore`, or similar is forbidden unless explicitly reviewed and justified.
    ```
- **Onboarding checklist**
  - Document that editors must use project tsconfig and show errors inline.

---

## Risk Matrix

| Risk                                  | Severity  | Mitigation                                                  |
|----------------------------------------|-----------|-------------------------------------------------------------|
| Existing code/tests fail strict check  | critical  | Systematic, up-front refactoring; no timeline shortcuts     |
| Future config drift (re-adding disables) | high      | Pre-commit hook/CI enforcement; document in code review template |
| Type suppression gets (re-)introduced  | high      | Lint for `any`, `@ts-ignore`; code review checklist         |
| Test utilities or mocks break          | medium    | Add/adjust precise typings for test helpers; refactor as needed |
| 3rd-party types missing                | medium    | Use `unknown` + assertions; add minimal local types         |
| Developer pushback ("too strict")      | medium    | Document benefits, enforce strictly, support with pairing   |
| False positives from tsconfig          | low       | Tune only as last resort; document any exceptions           |

---

## Open Questions

- Are there any test-specific utilities that *must* weaken typing for technical reasons? (Should be rare; if so, document and isolate.)
- Do we have any legacy code or dependencies that make `strict` impossible in the near term? (If yes, enumerate blockers and propose a remediation path.)
- Are all editors/IDEs using the correct tsconfig? (Add dev setup notes if not.)
- Should we add automated linting for `any`/suppression, or is CI/typecheck sufficient?
- Any builds, scripts, or dev tools that use a non-root tsconfig and thus could bypass strictness?

---
```