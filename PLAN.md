# Plan: Add Tests for Core UI Atoms (TEST-001)

## Chosen Approach (One‑liner)

Implement comprehensive, behavior-focused unit tests for `Container`, `Logo`, and `NoiseBackground` components using React Testing Library and Jest, co‑located in `__tests__`, with integrated accessibility checks via `jest-axe` (WCAG AA), strictly adhering to the no-internal-mocking policy and TypeScript best practices.

## Architecture Blueprint

-   **Modules / Packages Affected**:
    -   `components/ui/container.tsx` (Source for `Container` and `GridItem` atoms)
    -   `components/ui/logo.tsx` (Source for `Logo` atom)
    -   `components/ui/noise-background.tsx` (Source for `NoiseBackground` atom)
    -   `lib/utils.ts` (Contains `cn` utility, which **must not** be mocked)
-   **New Test Modules**:
    -   `__tests__/components/ui/container.test.tsx`
    -   `__tests__/components/ui/logo.test.tsx`
    -   `__tests__/components/ui/noise-background.test.tsx`
-   **Test Support Files**:
    -   `jest.setup.js`: To be updated for `jest-axe` global integration (e.g., `expect.extend(toHaveNoViolations)`).
-   **Public Interfaces / Contracts Tested**:
    -   `ContainerProps`: (e.g., `as`, `className`, `maxWidth`, `padding`, `center`, `gap`, `gapX`, `gapY`, `children`).
    -   `GridItemProps`: (e.g., `as`, `className`, `span`, responsive spans like `sm`, `md`, `start`, responsive starts, `children`).
    -   `LogoProps`: (e.g., `as`, `className`, `size`, `color`, `aria-label`).
    -   `NoiseBackgroundProps`: (e.g., `baseColor`, `noiseOpacity`, `className`, `children`).
    -   Rendered HTML structure, applied CSS classes (derived from props/variants), and ARIA attributes.
    -   Accessibility tree conformance (via `jest-axe`).
-   **Data Flow Diagram**:
    ```mermaid
    graph TD
        A[Test Case: Props & RTL Render] --> B(Component Under Test: Container/Logo/NoiseBackground)
        B --> C{Rendered DOM Output}
        C -- Query/Assert --> D[React Testing Library Assertions]
        C -- Scan --> E[jest-axe Accessibility Engine]
        E -- Report Violations --> F[Jest Assertions for A11y]
    ```
-   **Error & Edge‑Case Strategy**:
    -   Tests will cover default rendering, all documented prop variants, and common combinations.
    -   `jest-axe` will automatically detect a wide range of WCAG AA violations in the rendered output.
    -   Props not explicitly defined in TypeScript interfaces will result in type errors, aligning with strict TypeScript practices. Graceful handling of unexpected runtime props is not a primary concern for these presentational atoms if TypeScript is correctly enforced.
    -   Focus on ensuring components render predictably and accessibly for all valid prop inputs.

## Detailed Build Steps

1.  **Setup `jest-axe`**:
    *   Install `jest-axe`: `pnpm add -D jest-axe`.
    *   In `jest.setup.js`, integrate `jest-axe` matchers:
        ```javascript
        import { toHaveNoViolations } from 'jest-axe';
        expect.extend(toHaveNoViolations);
        ```
2.  **Create Test Files**:
    *   Create `__tests__/components/ui/container.test.tsx`.
    *   Create `__tests__/components/ui/logo.test.tsx`.
    *   Create `__tests__/components/ui/noise-background.test.tsx`.
    *   Ensure all test files adhere to strict TypeScript and existing naming conventions.

3.  **Implement `Container` & `GridItem` Tests (`container.test.tsx`)**:
    *   **Rendering**:
        *   Verify `Container` and `GridItem` render children correctly.
        *   Verify default HTML element (`div`).
        *   Test `as` prop for rendering different semantic elements (e.g., `section`, `aside`).
    *   **Props & Variants (`Container`)**:
        *   `className`: Applied and merged.
        *   `maxWidth`: All variants (e.g., `sm`, `md`, `xl`, `full`, `none`) apply correct Tailwind classes.
        *   `padding`: All variants (e.g., `none`, `sm`, `md`, `lg`, `xl`, `responsive`) apply correct Tailwind classes.
        *   `center`: `mx-auto` class applied/not applied.
        *   `gap`, `gapX`, `gapY`: All variants apply correct Tailwind classes.
    *   **Props & Variants (`GridItem`)**:
        *   `className`: Applied and merged.
        *   `span` and responsive span props (`sm`, `md`, etc.): Apply correct `col-span-*` classes.
        *   `start` and responsive start props (`smStart`, `mdStart`, etc.): Apply correct `col-start-*` classes.
    *   **Accessibility (A11Y-001)**: For each distinct rendered state:
        ```typescript
        const { container } = render(<Container {...props} />);
        expect(await axe(container)).toHaveNoViolations();
        ```

4.  **Implement `Logo` Tests (`logo.test.tsx`)**:
    *   **Rendering**:
        *   Verify text "Scry." renders, with the period (`.`) in a `span` with specific styling (e.g., `opacity-70`).
        *   Verify default HTML element (`h1`).
        *   Test `as` prop for rendering different elements (e.g., `div`, `p`).
    *   **Props & Variants**:
        *   `className`: Applied.
        *   `size`: All variants (`default`, `small`, `medium`, `large`) apply correct Tailwind typography classes.
        *   `color`: All variants (`chalk`, `ink`, `cobalt`) apply correct Tailwind text color classes.
        *   `aria-label`: Applied correctly; verify default if not provided.
    *   **Accessibility (A11Y-001)**: For each distinct rendered state, run `axe` checks. Pay specific attention to the `aria-label` and ensure sufficient contrast if colors are hardcoded (though Tailwind classes should manage this).

5.  **Implement `NoiseBackground` Tests (`noise-background.test.tsx`)**:
    *   **Rendering**:
        *   Verify it renders children correctly.
        *   Verify the presence of an inner `div` for the noise effect with `aria-hidden="true"`.
        *   Verify default `baseColor` and `noiseOpacity` are applied as inline styles.
        *   Verify `backgroundImage` for the noise pattern.
    *   **Props & Variants**:
        *   `className`: Applied to the main wrapper.
        *   `baseColor`: Dynamically updates `backgroundColor` style.
        *   `noiseOpacity`: Dynamically updates `opacity` style of the noise `div`.
    *   **Accessibility (A11Y-001)**: Run `axe` checks. Ensure the component itself is inert and doesn't introduce a11y issues.

6.  **Adherence to Philosophy & Code Quality**:
    *   **CRITICAL**: Ensure no internal collaborators (e.g., `cn` utility, other atoms/molecules) are mocked. Tests must verify the component's behavior as it would operate in the application.
    *   All tests must pass `pnpm typecheck` and `pnpm lint`.
    *   Test descriptions must be clear, behavior-focused, and follow existing conventions.

7.  **Coverage Verification**:
    *   Run `pnpm test --coverage`.
    *   Ensure statement, branch, function, and line coverage for `container.tsx`, `logo.tsx`, and `noise-background.tsx` meets or exceeds project standards (target 90%+ for atoms).
    *   Add meaningful tests for any uncovered, user-relevant behavior.

## Testing Strategy

-   **Test Layers**: **Unit Tests**. These components are foundational atoms and will be tested in isolation to verify their specific contracts.
-   **What to Mock**: **Strictly no mocking of internal collaborators.**
    -   The `cn` utility function from `@/lib/utils` **MUST NOT** be mocked. Its correct functioning is part of the component's behavior.
    -   Other UI atoms or internal components **MUST NOT** be mocked. If an atom depends on another atom, it should be rendered as part of the test.
    -   Only true external dependencies (e.g., browser APIs not polyfilled by JSDOM, third-party network services – none of which are expected for these atoms) would be candidates for mocking.
-   **Coverage Targets & Edge‑Case Notes**:
    -   **Coverage Target**: Aim for >90% statement, branch, function, and line coverage for each atom. This will be enforced by CI (per `AUTO-003` and Frontend Appendix).
    -   **Accessibility (A11Y-001)**: Every significant visual state/variant rendered in a test **MUST** be asserted against `jest-axe` for WCAG 2.1 AA compliance.
    -   **Edge Cases**:
        -   `Container`/`GridItem`: Test with `as` prop using various valid HTML tags. Test rendering with no children. Test responsive prop interactions.
        -   `Logo`: Test `as` prop. Ensure default and custom `aria-label` are correctly applied.
        -   `NoiseBackground`: Test rendering with no children.
        -   All components: Test passthrough of standard HTML attributes like `id`, `data-*`.

## Logging & Observability

-   **Log Events**: Not applicable. UI atoms do not typically emit logs. Test failures reported by Jest are the primary "observability" mechanism for this task.
-   **Correlation ID Propagation**: Not applicable at this level.

## Security & Config

-   **Input Validation Hotspots**: Props are validated by TypeScript at build time. These atoms do not handle user-generated content directly, minimizing runtime security risks.
-   **Secrets Handling**: Not applicable.
-   **Least‑Privilege Notes**: Components expose only necessary props for their defined functionality.

## Documentation

-   **Code Self‑Doc Patterns**:
    -   TSDoc comments for component props should be comprehensive and accurate (as per `DOC-001`).
    -   Test descriptions (`describe`, `it` blocks) must clearly state the behavior being tested.
-   **README/OpenAPI Updates**: No updates required for this task.

## Risk Matrix

| Risk                                                                 | Severity | Mitigation                                                                                                                                                             |
| :------------------------------------------------------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mocking internal collaborators (e.g., `cn`, other atoms)             | CRITICAL | Strict adherence to "no internal mocking" policy. Rigorous code reviews. CI checks could potentially be enhanced to detect common mocking anti-patterns.             |
| Incomplete accessibility (a11y) test coverage or missed violations   | CRITICAL | Mandate `await axe(container)` checks for all relevant rendering tests. Peer review focusing on a11y test inclusion. Adherence to A11Y-001 guidelines.             |
| Insufficient test coverage for props, variants, or edge cases        | HIGH     | Systematic test planning for each prop and variant. Use coverage reports (`pnpm test --coverage`) to identify gaps. Peer review of test comprehensiveness.             |
| Tests focus on implementation details rather than behavior           | MEDIUM   | Emphasize testing what the user (or consuming component) experiences. Use React Testing Library queries that are user-centric. Code reviews to enforce this.          |
| Non-strict TypeScript usage in tests or components                   | MEDIUM   | Enforce `strict: true` in `tsconfig.json` and `tsconfig.jest.json`. Fail CI builds on TypeScript errors. No `// @ts-ignore` or `any` without strong justification. |
| Test file naming/structure deviates from existing patterns           | LOW      | Review existing test files for conventions. Linters/formatters may enforce some structural consistency. Code review.                                                   |

## Open Questions

-   Are there any highly specific, non-standard accessibility scenarios for these atoms that `jest-axe` with default WCAG AA rules might miss? (Assumption: Standard WCAG AA via `jest-axe` is sufficient).
-   Is there a project-preferred method for organizing tests within a single `*.test.tsx` file (e.g., nested `describe` blocks for props vs. a11y vs. variants)? (Assumption: Follow common sense and existing patterns for clarity).