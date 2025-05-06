# Plan: Enable Strict TypeScript Configuration (TS-001)

## Chosen Approach (One‑liner)
Establish a single, fully strict TypeScript configuration as the source of truth for the entire project, including test files, by aligning `tsconfig.jest.json` with the root `tsconfig.json`, removing all weakening overrides, and systematically remediating all resulting type violations.

## Architecture Blueprint
-   **Modules / Packages**
    -   `tsconfig.json`: Root TypeScript configuration. Source of truth for strictness settings. Will enforce all flags recommended in `DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md`.
    -   `tsconfig.jest.json`: TypeScript configuration for Jest tests. Must extend `tsconfig.json` and *not* weaken any strictness settings. May contain Jest-specific non-strictness-related overrides (e.g., `isolatedModules: false` if technically required by `ts-jest` and doesn't compromise type safety).
    -   `src/`: Application source code (components, libraries, pages).
    -   `app/`: Next.js specific application code.
    -   `components/`: UI components.
    -   `lib/`: Shared utility functions and constants.
    -   `__tests__/`: All test files. Will be subject to the same strict type-checking as application code.

-   **Public Interfaces / Contracts**
    -   The primary contract is the `tsconfig.json` itself, enforcing strictness.
    -   Example `tsconfig.json` strict settings (to be verified/enforced):
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
            "noUnusedLocals": true,
            "noUnusedParameters": true,
            "noImplicitReturns": true,
            "noFallthroughCasesInSwitch": true,
            "exactOptionalPropertyTypes": true, // If feasible and TS version supports
            "noUncheckedIndexedAccess": true   // If feasible
            // ... other base settings like target, module, jsx, etc.
          }
        }
        ```
    -   `tsconfig.jest.json` extends `tsconfig.json`:
        ```json
        {
          "extends": "./tsconfig.json",
          "compilerOptions": {
            "jsx": "react-jsx", // Example test-specific override
            "isolatedModules": false // If required by ts-jest, verify no safety impact
            // NO "noImplicitAny": false or other strictness-weakening overrides
          },
          "include": ["next-env.d.ts", "**/*.test.ts", "**/*.test.tsx", "__mocks__/**/*"]
        }
        ```

-   **Data Flow Diagram**
    ```
    graph TD
        RootConfig["tsconfig.json (Strict Source of Truth)"] -->|extends| JestConfig["tsconfig.jest.json (Test Specifics)"]
        RootConfig --> AppCode["Application Code (src/**/*, app/**/*)"]
        JestConfig --> TestCode["Test Code (__tests__/**/*)"]
        AppCode --> TSC["TypeScript Compiler (tsc --noEmit)"]
        TestCode --> TSC
        TSC -- Reports Errors --> Developer["Developer"]
        TSC -- Must Pass --> CI["CI Pipeline (via AUTO-003)"]
    ```

-   **Error & Edge‑Case Strategy**
    -   **Error Identification:** All type errors will be identified by running `pnpm typecheck` (or `tsc --noEmit`).
    -   **Error Resolution Principle:** Address all violations directly; do not suppress.
        -   Implicit `any`: Replace with explicit types, `unknown` (with type guards), or generics.
        -   `strictNullChecks` violations: Explicitly handle `null`/`undefined` using type guards, optional chaining (`?.`), nullish coalescing (`??`), or refactor logic. Non-null assertions (`!`) are strongly discouraged and require justification and a comment if used as a last resort.
        -   Type mismatches: Correct type definitions, update function/component signatures, or use type assertions (`as T`) *only when the developer is certain and the compiler cannot infer*, with a comment explaining the rationale. Avoid `as any`.
    -   **Temporary Suppression (Extreme Cases Only):** `// @ts-expect-error <explanation & JIRA_TICKET_FOR_REMEDIATION>` may be used *exceptionally* for complex pre-existing issues in non-critical code to unblock the main task, *only if* an immediate fix is disproportionately costly. This creates immediate, tracked technical debt and is a violation of the "Address Violations" principle, requiring swift follow-up.

## Detailed Build Steps
1.  **Verify and Harden Root `tsconfig.json`**:
    *   Open the root `tsconfig.json`.
    *   Ensure `"strict": true` is present and enabled.
    *   Explicitly add or confirm the presence of all individual strictness flags as listed in `DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md` and the example above (e.g., `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, etc.). This improves clarity and guards against future `tsc` behavior changes if `"strict"` defaults evolve.
2.  **Align `tsconfig.jest.json`**:
    *   Open `tsconfig.jest.json`.
    *   Ensure it `extends` the root `tsconfig.json`.
    *   Remove any options that weaken strictness inherited from the root config, specifically `"noImplicitAny": false"`.
    *   Verify that `isolatedModules` is set to `false` (often required for `ts-jest` when not using Babel for transpilation) and confirm this does not negatively impact type safety enforcement.
    *   Ensure its `include` patterns correctly cover all test files and test-related utility files.
3.  **Initial Type Check**:
    *   Run `pnpm typecheck` (or equivalent `tsc --noEmit` command) from the project root.
    *   Expect errors. Catalog them or use IDE features to navigate.
4.  **Systematic Error Remediation**:
    *   **Phase 1: Core & Shared Code:**
        *   Prioritize fixing errors in shared utilities (`lib/`) and foundational UI components (`components/ui/` or similar).
    *   **Phase 2: Application & Feature Code:**
        *   Address errors in application logic, remaining components (`components/molecules/`, `components/organisms/`), and pages (`app/`).
    *   **Phase 3: Test Code:**
        *   Address all type errors within `__tests__/`. This includes:
            *   Typing mock functions (e.g., `jest.MockedFunction<(args) => ret>`).
            *   Ensuring test data and component props used in tests are correctly typed.
            *   Typing test helper functions.
    *   For each error, apply the principles from "Error & Edge-Case Strategy".
5.  **Refactor Mocking (as needed, inform TEST-008)**:
    *   If strict typing reveals tests are mocking internal components/modules (violating Mocking Policy TEST-008), these are design issues.
    *   The immediate goal of TS-001 is to make the *tests themselves* type-safe. Document these mocking policy violations for refactoring under TEST-008.
6.  **Iterative Verification**:
    *   After fixing errors in a logical group of files, re-run `pnpm typecheck`.
    *   Run relevant unit tests (`pnpm test <path_to_affected_files>`) to ensure fixes don't introduce runtime regressions.
7.  **Full Project Verification**:
    *   Once all individual errors are addressed, run `pnpm typecheck` for the entire project.
    *   Run the full test suite (`pnpm test`) to confirm no regressions.
    *   Run the application build (`pnpm build`) to ensure it completes successfully.
8.  **Pre-Commit Hook Configuration (if applicable)**:
    *   Ensure pre-commit hooks (e.g., Husky + lint-staged) are configured to run `pnpm typecheck` on staged files.
9.  **Commit Changes**:
    *   Commit the updated `tsconfig.json`, `tsconfig.jest.json`, and all files with type fixes.
    *   Adhere to Conventional Commits standard (AUTO-004), e.g., `fix(types): enforce strict TypeScript across project and tests`.
10. **CI Integration (Prerequisite for AUTO-003)**:
    *   This task enables AUTO-003. The CI pipeline must be configured (as part of AUTO-003) to run `pnpm typecheck` and fail the build on any type errors.

## Testing Strategy
-   **Test Layers Impacted**:
    -   **Static Type Checking (`tsc --noEmit`)**: This is the primary verification for this task. It ensures all code, *including test files*, adheres to strict TypeScript rules.
    -   **Unit Tests (`pnpm test`)**: Essential for catching any runtime regressions introduced while refactoring code to fix type errors. Must pass after all type errors are resolved.
-   **What to Mock (and how it relates to this task)**:
    -   Adhere strictly to the Mocking Policy: Mock *only* true external system boundaries (APIs, browser features not in JSDOM, etc.).
    -   Strict typing will apply to mock implementations. Mocks must have accurate types (e.g., `jest.MockedFunction<typeof originalFunction>`).
    -   If strict typing reveals issues with tests mocking internal collaborators (violating TEST-008), these instances should be noted for refactoring under TEST-008. The immediate fix for TS-001 is to make the existing mock type-safe, even if the mock itself is an anti-pattern.
-   **Coverage Targets & Edge‑Case Notes**:
    -   **Type Coverage**: 100% of the codebase (application and test files) must pass strict type checking. Any `// @ts-expect-error` is a tracked deviation.
    -   **Code Coverage**: Existing code coverage targets (e.g., per `DEVELOPMENT_PHILOSOPHY_APPENDIX_FRONTEND.md`) must be maintained or improved. Refactoring for type safety should not reduce test coverage.
    -   **Edge Cases**: `strictNullChecks` will highlight many edge cases related to `null` or `undefined` values. These must be handled explicitly and safely.

## Logging & Observability
-   This task does not directly modify logging or observability implementations.
-   **Indirect Benefit**: Enforcing strict types improves code clarity, making it easier to reason about data flowing into logging functions. This supports LOG-001 (Structured Logging) by ensuring logged data structures are well-defined.
-   **Correlation ID Propagation**: Not directly impacted.

## Security & Config
-   **Input Validation Hotspots**: Strict typing is a prerequisite for robust input validation but not a replacement. When asserting types (e.g., from `unknown` after parsing external data), ensure validation has occurred.
-   **Secrets Handling**: Not directly impacted. CONFIG-004 (Externalize Config) should ensure any configuration values are accessed in a type-safe manner.
-   **Least-Privilege Notes**: Not directly impacted.
-   **Configuration Files**: This task directly modifies `tsconfig.json` and `tsconfig.jest.json`. These are development configurations and do not contain secrets.

## Documentation
-   **Code Self-Documentation**: Strict typing significantly enhances self-documentation by making data structures and function signatures explicit and machine-checked ("Leverage Types Diligently").
-   **TSDoc Comments (DOC-001)**: Add or update TSDoc comments for public APIs or complex types where the types alone do not sufficiently explain the *intent* or *usage constraints*.
-   **`CONTRIBUTING.md` / Developer Guide Updates**:
    -   Add a section on "TypeScript Strictness Policy".
    -   State that full strictness is enforced across all code, including tests.
    -   Prohibit `any` and type suppression directives (`@ts-ignore`, `@ts-expect-error` without explicit, temporary, tracked exceptions).
    -   Mention that `pnpm typecheck` must pass before committing/merging.
-   **Onboarding Documentation**: Ensure new developers are guided to configure their IDEs to use the project's TypeScript version and `tsconfig.json` for real-time feedback.

## Risk Matrix

| Risk                                                                    | Severity | Mitigation                                                                                                                                                              |
| :---------------------------------------------------------------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Large number of type errors leading to significant refactoring effort.  | High     | Systematic, phased remediation (core -> features -> tests). Allocate sufficient time. Pair programming on complex areas. Use temporary `@ts-expect-error` (with JIRA ticket) as an absolute last resort for truly intractable legacy areas to avoid blocking the entire initiative. |
| Introducing runtime bugs during type-fixing refactors.                  | High     | Thorough execution of existing unit and integration tests after fixes. Code reviews focusing on both type changes and logic. Gradual rollout if possible (not for config). |
| Difficulty accurately typing complex existing code or 3rd-party mocks.  | Medium   | Leverage advanced TypeScript features (generics, conditional types). Use `unknown` with type guards. Consult TypeScript documentation/community. Add minimal local type definitions for untyped 3rd-party libs if necessary. |
| Developer workflow disruption / Resistance to strictness.               | Medium   | Clear communication of benefits and requirements. Provide guidance and support. Ensure IDEs provide good feedback. Enforce consistently in CI and code reviews.         |
| Uncovering widespread Mocking Policy violations (TEST-008).             | Medium   | Document violations for TEST-008. Focus TS-001 on making current tests type-safe, deferring major mock refactoring to TEST-008.                                        |
| Build/CI configuration issues with stricter type checking.              | Low      | Test `pnpm typecheck` thoroughly in local and CI environments. Ensure CI fails correctly on type errors.                                                              |
| `tsconfig.jest.json` overrides inadvertently weakening strictness.      | Low      | Careful review of `tsconfig.jest.json` to ensure only non-strictness-related, Jest-essential overrides are present. Explicitly list strict flags in root config.      |

## Open Questions
-   Are there any specific large or complex legacy modules known to heavily rely on implicit `any` that might require a dedicated sub-task or more focused effort?
-   Are all third-party dependencies used in the project equipped with adequate TypeScript definitions (`@types/` packages)? If not, list them for mitigation (e.g., find/contribute types, wrap in `unknown`).
-   Is there a consensus on the acceptable use (if any) of `// @ts-expect-error` as a temporary measure, including the process for tracking and remediating such suppressions? (Proposed: only with explicit JIRA ticket and explanation).
-   Should an automated lint rule be added (e.g., via ESLint with `@typescript-eslint/no-explicit-any` or disallowing suppression comments) to further prevent regressions? (Consider for a follow-up task).