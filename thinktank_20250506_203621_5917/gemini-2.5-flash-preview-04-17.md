```
# Plan: Enable Strict TypeScript Configuration (TS-001)

## Chosen Approach
Enable full strict TypeScript configuration across the project, including test files, and resolve all resulting type errors.

## Architecture Blueprint
- **Modules / Packages**
  - `tsconfig.json`: Root configuration for the entire project. Will define core strictness rules.
  - `tsconfig.jest.json`: Configuration specifically for Jest tests. Will inherit strictness from the root config.
  - `components/`: UI components (Atoms, Molecules, Organisms) - potential source of type errors.
  - `lib/`: Utility functions and constants - potential source of type errors.
  - `app/`: Next.js pages and layout - potential source of type errors.
  - `__tests__/`: Test files - will now be strictly type-checked.

- **Public Interfaces / Contracts**
  - Component Props: Explicitly typed interfaces (`Props`). Strictness will enforce correct usage and definition.
  - Utility Functions: Explicitly typed parameters and return values. Strictness will eliminate implicit `any`.

- **Data Flow Diagram** (ascii or mermaid)
```mermaid
graph TD
    TSConfig[tsconfig.json] --> TSC[TypeScript Compiler tsc --noEmit]
    TSConfig --> TSConfigJest[tsconfig.jest.json]
    TSConfigJest --> TSC

    SourceCode[src/**/*.ts(x), app/**/*.ts(x)] --> TSC
    TestCode[__tests__/**/*.ts(x)] --> TSConfigJest
    TestCode --> TSC

    TSC -- Reports Errors --> Developer[Developer]
    TSC -- Must Pass --> CI[CI Pipeline (AUTO-003)]
```

- **Error & Edge‑Case Strategy**
  - **Error Identification:** Type errors will be identified by running `tsc --noEmit`.
  - **Error Resolution:**
    - For implicit `any`: Add explicit type annotations.
    - For potential null/undefined issues: Use strict null checks (`strictNullChecks`) to identify potential `null` or `undefined` values where not expected. Refactor code to handle these cases explicitly (e.g., optional chaining `?.`, nullish coalescing `??`, type guards, or non-null assertions `!`, sparingly and with caution).
    - For type mismatches: Correct type definitions, update function signatures, or use appropriate type assertions (`as unknown as T`) *only* when the type checker cannot infer correctly and the developer is certain of the type, adding comments explaining the rationale. Avoid `as any`.
    - For complex types: Define clearer interfaces, union types, or utility types.
  - **Legacy Code:** If immediate strictness is overly disruptive for a small, well-contained legacy section, temporary `// @ts-expect-error` comments *with detailed explanations and a follow-up task* may be used as a last resort (Violation of "Address Violations, Don't Suppress" principle, but pragmatic for focused technical debt).

## Detailed Build Steps
1.  **Modify `tsconfig.jest.json`**: Open `tsconfig.jest.json` and remove the lines `"noImplicitAny": false,` and `"isolatedModules": false,`. Ensure it extends the base `tsconfig.json`.
2.  **Review `tsconfig.json`**: Open the root `tsconfig.json`. Verify `"strict": true` is present. Explicitly add or confirm the presence of strictness options recommended in `DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md` (e.g., `"strictNullChecks": true`, `"strictFunctionTypes": true`, `"strictBindCallApply": true`, `"strictPropertyInitialization": true`, `"noImplicitThis": true`, `"useUnknownInCatchVariables": true`, `"alwaysStrict": true`). While `"strict": true` enables most of these, explicitly listing them improves clarity.
3.  **Run Type Check**: Execute `pnpm typecheck` (`tsc --noEmit`) from the project root to compile and list all type errors introduced by the stricter settings.
4.  **Systematic Error Fixing**:
    *   Prioritize fixing errors in core/shared utilities (`lib/`) and foundational UI components (`components/ui/`).
    *   Then, address errors in molecules and organisms (`components/molecules/`, `components/organisms/`).
    *   Finally, fix errors in pages (`app/`).
    *   Address errors in test files (`__tests__/`) concurrently or immediately after fixing the corresponding component/utility errors.
    *   Focus on understanding the root cause of each error and applying the most type-safe fix (explicit types, improved logic, type guards).
5.  **Refactor Mocking (if necessary)**: If strictness highlights issues with internal component mocking (due to the Mocking Policy violation in TEST-008), this task may uncover *where* refactoring is needed, but the refactoring itself belongs to TEST-008. Note such instances for follow-up.
6.  **Verify Build**: Run `pnpm build` to ensure the application still builds correctly after type fixes.
7.  **Run All Tests**: Execute `pnpm test` to confirm that the type fixes did not introduce any runtime regressions in the application logic or component behavior.
8.  **Commit Changes**: Commit the updated `tsconfig.json`, `tsconfig.jest.json`, and all files with type fixes. Ensure commit messages follow Conventional Commits standard (AUTO-004).
9.  **CI Integration (Deferred)**: This task is a prerequisite for AUTO-003. The CI pipeline must be configured in AUTO-003 to run `pnpm typecheck` and fail on errors.

## Testing Strategy
- **Test layers**
  - **Type Check (`tsc --noEmit`)**: Primary verification layer for this task. Confirms all code adheres to the strict type rules.
  - **Unit Tests (`pnpm test`)**: Verifies the behavior of individual components and utilities. Essential to catch runtime regressions introduced by type-fixing refactors. Run *after* type errors are resolved.
  - **Integration / E2E Tests (Future, AUTO-003, TEST-009)**: Will provide higher-level confidence in critical flows once implemented.

- **What to mock and why**
  - Follow the strict Mocking Policy: Mock *only* true external system boundaries (API calls, etc.).
  - **NO Mocking Internal Collaborators**: If type strictness reveals tests are mocking internal UI components or logic, this indicates a design flaw and a TEST-008 violation. Note these for refactoring under TEST-008, but the immediate goal is to make the *tests themselves* type-safe, even if the underlying design is not yet ideal.

- **Coverage targets & edge‑case notes**
  - **Type Coverage**: Aim for 100% passing type checks under strict mode. Any temporary suppressions (`@ts-expect-error`) should be documented and tracked as technical debt.
  - **Runtime Coverage**: Existing test coverage targets should be maintained. This task does not directly increase code coverage but ensures the *test code* itself is type-safe and helps prevent future regressions.
  - **Edge Cases**: Pay close attention to edge cases highlighted by `strictNullChecks` and potential `undefined` issues. Ensure type-safe handling of these scenarios.

## Logging & Observability
- This task does not directly modify logging or observability implementation.
- **Benefit**: Stricter typing makes it easier to understand data flow and types passed to logging calls, improving the clarity and reliability of structured logs (LOG-001) in the future.
- **Correlation ID propagation**: Not directly impacted by this task.

## Security & Config
- **Input validation hotspots**: Strict typing helps ensure input validation functions are correctly typed, but the validation logic itself is separate.
- **Secrets handling**: Not directly impacted. Environment variables (CONFIG-004) are the correct mechanism.
- **Least-privilege notes**: Not directly impacted.
- **Configuration**: The task directly modifies `tsconfig.json` and `tsconfig.jest.json`. CONFIG-004 (Externalize config) should ensure that any configuration values used in TS files are accessed in a type-safe manner (e.g., via a typed config object loaded from environment variables).

## Documentation
- **Code self-doc patterns**: Adhering to strict typing naturally improves self-documenting code ("Leverage Types Diligently"). Types serve as machine-checked documentation.
- **Any required readme or openapi updates**: No direct updates required by this task. TSDoc comments (DOC-001) should be added to public interfaces where the *why* is not obvious from types alone ("Document Decisions").

## Risk Matrix

| Risk                                            | Severity   | Mitigation                                                                                                |
| :---------------------------------------------- | :--------- | :-------------------------------------------------------------------------------------------------------- |
| Large number of type errors / Time sink         | critical   | Systematic fixing; prioritize core/critical paths; use temporary `@ts-expect-error` with clear comments & tasks (last resort); pair programming. |
| Introducing runtime bugs through type fixes     | high       | Comprehensive unit/integration test execution after fixes; code review focusing on logic changes alongside types. |
| Difficulty understanding complex type errors    | medium     | Leverage TS documentation; break down complex types/functions; seek help from team members.               |
| Developer workflow disruption                   | medium     | Communicate changes clearly; ensure editors/IDEs are configured for real-time TS feedback; provide clear error resolution guidance. |
| Uncovering Mocking Policy violations (TEST-008) | medium     | Note violations for TEST-008; ensure tests pass type checks even if underlying design needs refactor.      |

## Open Questions
- Are there any known significant areas of the codebase with complex type challenges or heavy implicit `any` usage that might require dedicated attention or prior analysis?
- Are there any third-party libraries without sufficient TypeScript definitions that might block strict mode? (Mitigation: Find `@types` packages or contribute definitions).
```