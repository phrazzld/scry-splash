# Scry Splash Project Backlog

This backlog is organized by priority and logical grouping, with task complexity, rationale, expected outcomes, and dependencies.

## Critical Issues (P0)

### Configuration & Code Quality

- **[Enhancement]** Improve `glance` git hook implementation (DEV-001)
  - **Complexity**: Medium
  - **Rationale**: Robust pre-commit checks improve developer experience and reduce errors.
  - **Expected Outcome**: Reliable `glance` hook with installation docs, log file output, existence checks, and error reporting.
  - **Dependencies**: Infrastructure: Pre-commit hook setup
  - **Tasks**:
    * Add existence check for `glance` command
    * Create dedicated log file instead of sending to `/dev/null`
    * Implement better error handling and reporting
    * Use `husky` or `simple-git-hooks` for reliable setup
    * Document `glance` installation requirements in README.md

### Testing & Quality

- **[Feature]** Add tests for core UI atoms (TEST-001)
  - **Complexity**: Medium
  - **Rationale**: Increases coverage of foundational components and supports safe refactoring.
  - **Expected Outcome**: Unit tests for Container, Logo, NoiseBackground covering rendering, props, and a11y.
  - **Dependencies**: A11Y-001
  - **Tasks**:
    * Implement comprehensive tests for `Container` component
    * Implement comprehensive tests for `Logo` component
    * Implement comprehensive tests for `NoiseBackground` component
    * Ensure tests cover rendering, props, variants, and a11y

- **[Feature]** Set up end-to-end testing (TEST-002)
  - **Complexity**: Complex
  - **Rationale**: E2E tests validate critical user flows and catch integration issues early.
  - **Expected Outcome**: Basic Cypress/Playwright tests for page load and CTA flow integrated into CI.
  - **Dependencies**: AUTO-003
  - **Tasks**:
    * Integrate Cypress or Playwright
    * Implement basic test for page load and CTA interaction
    * Add E2E execution to CI pipeline

- **[Refactor]** Remediate critical mocking policy violations (TEST-008)
  - **Complexity**: Medium
  - **Rationale**: Complying with mocking policy yields maintainable tests focused on behavior over implementation.
  - **Expected Outcome**: No internal component mocks; tests mock only true external boundaries.
  - **Dependencies**: TEST-001, TEST-003
  - **Tasks**:
    * Systematically review all component tests (`__tests__/**/*.test.tsx`) to identify and list every instance of mocking internal UI components (atoms, molecules, organisms).
    * Prioritize refactoring components under test to eliminate these disallowed mocks, as per a strict mocking policy (focus on testing rendered output and interaction, not implementation details).
    * Ensure mocks are *only* used for true external boundaries (e.g., API calls, browser APIs not handled by JSDOM/testing-library).

- **[Feature]** Implement mandatory code quality CI gates (AUTO-003)
  - **Complexity**: Complex
  - **Rationale**: Automating linting, testing, and type-checking ensures consistent quality and prevents regressions.
  - **Expected Outcome**: CI fails on lint, test, type errors, and unmet coverage thresholds; status checks visible on PRs.
  - **Dependencies**: TS-001, TEST-001, TEST-002
  - **Tasks**:
    * Configure CI (GitHub Actions) to run linting, type checking (`"strict": true` enforced as per `TS-001`), and all tests (unit, integration, E2E) on every pull request and push to the main branch.
    * The CI pipeline must *fail* if any of these checks do not pass.
    * Implement and enforce test coverage thresholds (e.g., 90%+ for atoms/molecules, 85%+ for organisms, 100% for critical E2E flows) within the CI pipeline; the build fails if thresholds are not met.
    * Integrate coverage reporting (e.g., Codecov, Coveralls) for visibility.

- **[Enhancement]** Integrate comprehensive accessibility checks into testing pipeline (A11Y-001)
  - **Complexity**: Medium
  - **Rationale**: Automated accessibility checks ensure WCAG 2.1 AA compliance and prevent regressions.
  - **Expected Outcome**: jest-axe in unit tests, axe checks in E2E; ESLint a11y plugin enabled; CI fails on violations.
  - **Dependencies**: TEST-001, TEST-002
  - **Tasks**:
    * Integrate `jest-axe` into all relevant unit/integration component tests to check for WCAG 2.1 AA violations (supports `TEST-005`).
    * Add automated accessibility checks to E2E tests (e.g., using Playwright's built-in capabilities or `axe-playwright`) for key user flows.
    * Configure CI to fail on reported accessibility violations from these automated checks.
    * Add an ESLint plugin for accessibility (e.g., `eslint-plugin-jsx-a11y`) to catch issues during development.

## High Priority (P1)

### Configuration & Release

- **[Enhancement]** Standardize Chromatic configuration (CONFIG-001)
  - **Complexity**: Simple
  - **Rationale**: A single source of truth reduces misconfiguration and streamlines visual testing.
  - **Expected Outcome**: `.chromatic.tsx` holds all settings; CI and local overrides removed; docs updated.
  - **Tasks**:
    * Establish `.chromatic.tsx` as single source of truth for settings
    * Remove overrides from CI workflow unless specifically needed
    * Document all configuration choices and reasoning
    * Fix "stop skipping chromatic in ci" issue

- **[Refactor]** Refactor component tests to reduce mocking (TEST-003)
  - **Complexity**: Medium
  - **Rationale**: Behavior-focused tests enhance maintainability and reliability.
  - **Expected Outcome**: Molecule and organism tests use rendered output only; no internal mocks.
  - **Dependencies**: TEST-008
  - **Tasks**:
    * Revise tests for molecules to avoid mocking internal UI components
    * Revise tests for organisms to avoid mocking internal UI components
    * Focus on testing rendered output and user interaction, not implementation details

- **[Refactor]** Move hardcoded styling values into Tailwind config (UI-001)
  - **Complexity**: Simple
  - **Rationale**: Centralized design tokens ensure consistency and simplify theme updates.
  - **Expected Outcome**: All colors and styles in `tailwind.config.js`; no inline hex values.
  - **Dependencies**: DESIGN-001
  - **Tasks**:
    * Move all color definitions to `tailwind.config.js`
    * Remove hardcoded hex values from `ThemeDecorator.tsx`
    * Clean up `app/theme.css` to eliminate duplication with Tailwind

- **[Enhancement]** Standardize font loading strategy (UI-002)
  - **Complexity**: Medium
  - **Rationale**: Next.js font API optimizes loading performance and simplifies code.
  - **Expected Outcome**: All fonts via `next/font`; manual `@font-face` removed; improved LCP.
  - **Dependencies**: LIC-001
  - **Tasks**:
    * Use `next/font` for all fonts including IBM Plex Sans
    * Configure in `layout.tsx` and remove manual `@font-face` rules
    * Improve font performance optimizations

- **[Refactor]** Clean up global CSS organization (CSS-001)
  - **Complexity**: Medium
  - **Rationale**: Minimal global CSS reduces conflicts and aligns with Tailwind utility-first design.
  - **Expected Outcome**: `globals.css` limited to resets/variables; component styles use utilities.
  - **Dependencies**: UI-001
  - **Tasks**:
    * Remove utility-like classes from `globals.css`
    * Eliminate component styles from global CSS
    * Keep only essential resets and CSS variable definitions
    * Use Tailwind classes and component variants instead

- **[Enhancement]** Improve CI security checks (SEC-002)
  - **Complexity**: Medium
  - **Rationale**: Proactive scanning prevents known vulnerabilities from entering the codebase.
  - **Expected Outcome**: `pnpm audit` in CI; Dependabot configured; CI fails on high/critical issues.
  - **Dependencies**: CONFIG-004
  - **Tasks**:
    * Add vulnerability scanning (`pnpm audit`) to CI
    * Configure Dependabot or Renovate for dependency updates
    * Implement automatic security review of PRs

- **[Feature]** Enforce Conventional Commits and automate changelog/versioning (AUTO-004)
  - **Complexity**: Medium
  - **Rationale**: Standardized commits and automated releases accelerate delivery and transparency.
  - **Expected Outcome**: commitlint in hooks and CI; semantic-release updating version and `CHANGELOG.md`.
  - **Dependencies**: DEV-001
  - **Tasks**:
    * Implement pre-commit hooks (e.g., `commitlint` integrated with `husky` or `simple-git-hooks`) to validate commit messages against the Conventional Commits specification.
    * Configure CI to perform the same validation on PR titles or commit messages.
    * Integrate and configure `semantic-release` or `standard-version` to automate version bumping in `package.json`, Git tagging, and `CHANGELOG.md` generation based on Conventional Commits.

- **[Refactor]** Align component structure with Atomic Design and feature organization (ARCH-001)
  - **Complexity**: Complex
  - **Rationale**: A clear, modular structure improves discoverability and maintainability.
  - **Expected Outcome**: Components organized by atoms, molecules, organisms within feature folders; imports updated.
  - **Dependencies**: STORY-001
  - **Tasks**:
    * Review and refine the component folder structure to clearly delineate Atomic Design levels (atoms, molecules, organisms).
    * Where appropriate, organize components by feature/domain in addition to their atomic level to improve discoverability and modularity.
    * Refactor existing components into the revised structure.
    * Update all import paths and relevant documentation (e.g., `CONTRIBUTING.md`, internal architecture docs).

- **[Feature]** Achieve comprehensive Storybook coverage and interactive documentation (STORY-001)
  - **Complexity**: Complex
  - **Rationale**: Detailed component documentation accelerates onboarding and prevents integration errors.
  - **Expected Outcome**: Stories for all atoms, molecules, organisms covering variants, edge cases, and accessibility.
  - **Dependencies**: None
  - **Tasks**:
    * Audit all UI components (atoms, molecules, organisms) to ensure comprehensive Storybook coverage, including:
      * Default states, all props/variants, interactive states (hover, focus, active, disabled).
      * Edge cases (long text, empty states, error states).
      * Accessibility (a11y) checks within stories using Storybook addons.
    * Ensure all component props are documented (TSDoc automatically picked up or manually via `argTypes`).
    * Add clear usage guidelines and "why" notes for complex components or patterns directly within Storybook.

- **[Refactor]** Externalize all environment-specific configuration and secrets (CONFIG-004)
  - **Complexity**: Medium
  - **Rationale**: Environment variables secure secrets and increase deployment flexibility.
  - **Expected Outcome**: No hardcoded API keys or URLs; use `.env` and `NEXT_PUBLIC_`; updated docs.
  - **Dependencies**: SEC-001
  - **Tasks**:
    * Audit the entire codebase (including `lib/constants.ts`) for any hardcoded API keys, URLs (e.g., `FORMSPARK.SUBMIT_URL`), or other environment-specific values.
    * Migrate all such configurations to environment variables (e.g., using `.env` files and `NEXT_PUBLIC_` prefix for client-side variables).
    * Update documentation regarding environment variable setup and ensure no secrets are committed to the repository (supports `SEC-001`).

- **[Enhancement]** Implement standardized structured logging (LOG-001)
  - **Complexity**: Medium
  - **Rationale**: Structured logs are essential for production debugging and monitoring.
  - **Expected Outcome**: pino or winston configured for JSON output; `console.log` replaced; docs added.
  - **Dependencies**: CONFIG-004
  - **Tasks**:
    * Select and integrate a standard structured logging library (e.g., `pino`, `winston`).
    * Replace all `console.log/warn/error` calls used for operational logging (e.g., API interactions, significant events, errors in `CTASection`) with the structured logger.
    * Configure the logger for JSON output in production/staging environments and human-readable format in development.
    * Document basic logging practices and conventions for the project.

## Medium Priority (P2)

### Design & UI Improvements

- **[Enhancement]** Establish single source of truth for design tokens (DESIGN-001)
  - **Complexity**: Simple
  - **Rationale**: Consolidating tokens prevents drift between design docs and implementation.
  - **Expected Outcome**: `tailwind.config.js` is primary token source; docs reference it.
  - **Tasks**:
    * Use `tailwind.config.js` as primary source
    * Remove or refactor `lib/constants.ts` if redundant
    * Update documentation components to consume rather than redefine tokens

- **[Enhancement]** Improve Email Input Focus State
  - **Complexity**: Simple
  - **Rationale**: Enhances user experience and visual polish of a key interactive element.
  - **Expected Outcome**: The email address text input has a visually clear, aesthetically pleasing, and accessible focus state, consistent with the overall design.
  - **Tasks**:
    * Implement smoother, cleaner, more simple and elegant focus state for email address text input

- **[Enhancement]** Standardize viewport definitions for testing and Storybook (UI-003)
  - **Complexity**: Simple
  - **Rationale**: Ensures consistency in responsive testing across different tools and aligns with design breakpoints.
  - **Expected Outcome**: Viewport definitions are defined once (e.g., in a shared config or Storybook setup), aligned with Tailwind breakpoints, and used consistently by Chromatic and Storybook.
  - **Tasks**:
    * Define viewports once, aligned with Tailwind breakpoints
    * Use consistent definitions across Chromatic and Storybook
    * Remove redundant definitions

### Testing & QA

- **[Chore]** Evaluate and clean up test mocks (TEST-004)
  - **Complexity**: Simple
  - **Rationale**: Reduces unnecessary configuration and potential confusion in the test setup.
  - **Expected Outcome**: `__mocks__/styleMock.js` is reviewed. If redundant with Jest's built-in handling or `jest-transform-stub`, it is removed and Jest configuration updated if necessary.
  - **Tasks**:
    * Review necessity of `__mocks__/styleMock.js`
    * Remove if redundant with Jest configuration

- **[Feature]** Add accessibility checks to unit tests (TEST-005)
  - **Complexity**: Medium
  - **Rationale**: Ensures components meet accessibility standards through automated testing.
  - **Expected Outcome**: All component tests include accessibility checks using jest-axe.
  - **Dependencies**: A11Y-001
  - **Tasks**:
    * Integrate `jest-axe` into test setup
    * Add assertions to verify WCAG compliance in component tests

- **[Enhancement]** Expand E2E test coverage for key user journeys (TEST-009)
  - **Complexity**: Medium
  - **Rationale**: Increases confidence in application stability by testing critical paths and interactions.
  - **Expected Outcome**: E2E tests cover the full form submission flow (valid/invalid email, error messages, success states), keyboard navigation, and responsiveness across defined breakpoints.
  - **Dependencies**: TEST-002
  - **Tasks**:
    * Building on `TEST-002`, implement E2E tests using Cypress or Playwright for:
      * Full form submission flow, including validation (valid/invalid email, error messages) and success states.
      * Keyboard navigation and focus management across all interactive elements.
      * Theme switching and persistence (if applicable and a core feature).
      * Responsiveness checks across defined breakpoints (`UI-003`).

### Developer Experience

- **[Enhancement]** Enhance pre-commit hooks for local quality enforcement (AUTO-005)
  - **Complexity**: Medium
  - **Rationale**: Robust pre-commit hooks catch issues before they enter the codebase.
  - **Expected Outcome**: A comprehensive suite of pre-commit hooks ensuring code quality standards.
  - **Dependencies**: DEV-001, AUTO-003
  - **Tasks**:
    * Building on the `glance` hook (`DEV-001`) and general pre-commit hook setup (`Infrastructure` backlog), add or ensure hooks for:
      * Running critical vulnerability scans (e.g., `pnpm audit --audit-level=critical`).
      * Enforcing file length limits (e.g., warn >500 lines, error >1000 lines, as per `Infrastructure` backlog).
      * Validating consistent file naming conventions (`STYLE-002`).

- **[Enhancement]** Enforce code complexity and length conventions via ESLint (STYLE-003)
  - **Complexity**: Medium
  - **Rationale**: Automated complexity checks maintain readability and adhere to standards.
  - **Expected Outcome**: ESLint rules for complexity, max-lines, nested callbacks; enforced in CI and hooks.
  - **Dependencies**: AUTO-003
  - **Tasks**:
    * Configure ESLint with rules like `complexity`, `max-lines`, `max-lines-per-function`, `max-nested-callbacks` to align with philosophy guidelines (e.g., from `Infrastructure` backlog: warn > 500 lines, error > 1000 lines).
    * Integrate these ESLint checks into CI (covered by `AUTO-003`) and pre-commit hooks (`AUTO-005`).

- **[Fix]** Fix contradictory git tracking of hooks and docs (GIT-001)
  - **Complexity**: Simple
  - **Rationale**: Inconsistent `.gitignore` and tracked files cause confusion and build issues.
  - **Expected Outcome**: `.githooks/glance.md` untracked or documented; clear docs for `glance.md` generation.
  - **Dependencies**: DEV-001
  - **Tasks**:
    * Resolve conflict between `.gitignore` and tracked `.githooks/glance.md`
    * Remove absolute paths from tracked documentation
    * Document `glance.md` purpose and generation process

- **[Chore]** Complete tooling version specification (DEV-002)
  - **Complexity**: Simple
  - **Rationale**: Ensures consistent development environments for all contributors.
  - **Expected Outcome**: `.tool-versions` file includes pnpm version. README or contributing guide documents all required tool versions (Node, pnpm, etc.).
  - **Tasks**:
    * Add pnpm version to `.tool-versions`
    * Document all tool requirements clearly

### Feature Enhancements

- **[Enhancement]** Refine typewriter animation and cursor behavior
  - **Complexity**: Simple
  - **Rationale**: Improves the polish and visual appeal of the hero animation.
  - **Expected Outcome**: The typewriter cursor blinks a few times after typing "remember everything" before the animation concludes, creating a more finished feel.
  - **Tasks**:
    * Have the typewriter cursor blink a couple times once it gets to "remember everything" before ending the cursor/typewriter animation (instead of current behavior, which is the cursor/typewriter animation just ends the moment "remember everything" gets typed out)

- **[Content]** Review and optimize "Remember X/Y/Z" copy
  - **Complexity**: Simple
  - **Rationale**: Enhances clarity and impact of the core marketing message.
  - **Expected Outcome**: The "remember x / y / z" tagline variants are reviewed and updated for conciseness, engagement, and brand alignment.
  - **Tasks**:
    * Create better set of "remember x / y / z" copy

### Documentation

- **[Enhancement]** Improve component prop documentation with TSDoc (DOC-001)
  - **Complexity**: Medium
  - **Rationale**: Clear prop docs aid developer understanding and reduce review cycles.
  - **Expected Outcome**: All component props have TSDoc comments reflecting units, defaults, and usage.
  - **Dependencies**: ARCH-001
  - **Tasks**:
    * Add comprehensive TSDoc for all props
    * Document purposes, units, defaults, and usage notes
    * Focus on `staggerDelay` and animation-related props

- **[Enhancement]** Standardize "why" documentation and decision records (DOC-004)
  - **Complexity**: Medium
  - **Rationale**: Documenting rationale supports onboarding and future refactoring.
  - **Expected Outcome**: `DECISIONS.md` with ADRs; existing docs updated with rationale.
  - **Dependencies**: None
  - **Tasks**:
    * Review existing documentation (TSDoc, Storybook, READMEs) and code comments.
    * Prioritize adding "why" explanations for non-obvious design choices, architectural decisions, and complex logic, not just "what" or "how".
    * Create or update a `DECISIONS.md` or similar ADR (Architectural Decision Record) log for significant choices (e.g., font loading strategy, testing library choices).
    * Document the Atomic Design structure, component boundaries, and composition guidelines in `CONTRIBUTING.md` or a dedicated architecture document (supports `ARCH-001` and `DOC-001`).

- **[Enhancement]** Define and implement consistent error handling patterns (ERROR-001)
  - **Complexity**: Medium
  - **Rationale**: Improves robustness and user experience by standardizing how errors are managed and presented.
  - **Expected Outcome**: Project-wide strategy for error handling (custom error classes, reporting to logger) is defined. User-facing errors are graceful. `CTASection` form submission uses these patterns.
  - **Dependencies**: LOG-001
  - **Tasks**:
    * Establish a project-wide strategy for error handling (e.g., custom error classes, consistent reporting to the chosen logging service `LOG-001`).
    * Ensure user-facing errors are graceful and provide meaningful feedback without exposing sensitive details.
    * Refactor areas like form submissions (`CTASection`) to use these standardized patterns.

## Low Priority (P3)

### Style & Code Hygiene

- **[Refactor]** Enforce final newlines at end of files (STYLE-001)
  - **Complexity**: Simple
  - **Rationale**: Consistent file endings improve diff clarity and align with style guides.
  - **Expected Outcome**: Prettier enforces final newlines; all files reformatted.
  - **Tasks**:
    * Configure Prettier to enforce final newlines
    * Run formatter on all files

- **[Enhancement]** Standardize file naming conventions (STYLE-002)
  - **Complexity**: Simple
  - **Rationale**: Consistent naming reduces cognitive load and improves imports.
  - **Expected Outcome**: PascalCase for React components; ESLint enforces convention.
  - **Dependencies**: STYLE-003
  - **Tasks**:
    * Choose between kebab-case and PascalCase for components
    * Apply consistent convention throughout codebase
    * Prefer PascalCase for React components

- **[Refactor]** Remove unused prop definitions (CODE-001)
  - **Complexity**: Simple
  - **Rationale**: Removing dead code reduces maintenance overhead and bundle size.
  - **Expected Outcome**: Unused `as` prop and others removed; interfaces cleaned.
  - **Dependencies**: ARCH-001
  - **Tasks**:
    * Remove unused `as` prop from component interfaces
    * Clean up other unused prop definitions

### Configuration & Build

- **[Research]** Evaluate Storybook static directory configuration (CONFIG-002)
  - **Complexity**: Simple
  - **Rationale**: Removing redundant config can simplify setup and reduce build time.
  - **Expected Outcome**: Decision on necessity of `public` in `staticDirs`; remove if unnecessary.
  - **Dependencies**: STORY-001
  - **Tasks**:
    * Test if explicit `public` directory in `staticDirs` is necessary
    * Remove if redundant with Next.js framework preset

### Documentation & Process

- **[Documentation]** Document and implement dependency evaluation process (SEC-004)
  - **Complexity**: Simple
  - **Rationale**: Formalizing dependency criteria ensures security, licensing, and performance considerations.
  - **Expected Outcome**: `docs/dependency-evaluation.md`; linked from CONTRIBUTING.
  - **Dependencies**: CONFIG-004
  - **Tasks**:
    * Create a lightweight document (e.g., in `docs/` or `CONTRIBUTING.md`) outlining the process and criteria for evaluating and adding new third-party dependencies.
    * Criteria should include necessity, maintenance status, license compatibility (`LIC-001`), security posture (known vulnerabilities), and bundle size impact.
    * Include steps for checking licenses and running `pnpm audit` before proposing a new dependency.

- **[Documentation]** Create comprehensive contributing guidelines (DOC-005)
  - **Complexity**: Medium
  - **Rationale**: A clear guide streamlines contributions and enforces project standards.
  - **Expected Outcome**: `CONTRIBUTING.md` covering setup, workflow, commit conventions, and code style.
  - **Dependencies**: AUTO-004, DEV-002
  - **Tasks**:
    * Develop or expand a `CONTRIBUTING.md` file that covers:
      * Project setup and development workflow (linking to `DEV-002` tool versions).
      * Running tests, linters, and other quality checks.
      * Branching strategy and pull request process, including Conventional Commit (`AUTO-004`) requirements.
      * Coding style and conventions (linking to relevant philosophy docs or ESLint/Prettier configs).

- **[Enhancement]** Reconcile AESTHETIC.md with design token implementation (DESIGN-003)
  - **Complexity**: Simple
  - **Rationale**: Aligning documentation prevents divergent design guidance.
  - **Expected Outcome**: Updated AESTHETIC.md or config matching `tailwind.config.js`.
  - **Dependencies**: DESIGN-001
  - **Tasks**:
    * Review AESTHETIC.md against the implemented design tokens in `tailwind.config.js` and `app/theme.css` (`DESIGN-001`, `UI-001`).
    * Ensure consistency in definitions (color names, typography scales, spacing units).
    * Update either the document or the code to reflect a single source of truth for design tokens, prioritizing `tailwind.config.js`.

## Future Considerations

- **[Research]** Initial scaffolding for internationalization readiness (I18N-001)
  - **Complexity**: Medium
  - **Rationale**: Preparing for multi-language support broadens user reach.
  - **Expected Outcome**: Proof-of-concept using chosen i18n library; documentation of next steps.
  - **Dependencies**: DOC-005
  - **Tasks**:
    * Identify all user-facing strings in UI components.
    * Research and select a suitable i18n library/framework compatible with Next.js (e.g., `next-i18next`, `react-i18next`).
    * Abstract a few key strings using the chosen library as a proof-of-concept.
    * Document the chosen i18n strategy and next steps for future full implementation.

- **[Feature]** GitHub Actions CI & improved pre-commit hooks
  - **Complexity**: Medium
  - **Rationale**: Reliable automated workflows reduce manual toil and enforce standards.
  - **Expected Outcome**: CI workflow templates and robust pre-commit hooks implementing file-length warnings and other checks.
  - **Dependencies**: AUTO-003, AUTO-005
  - **Tasks**:
    * Set up GitHub Actions CI
    * Set up useful precommit hooks
      * Warn when files are over 500 lines
      * Error when files are over 1000 lines
      * Run tests
      * Run linter
