# Project Backlog

## Critical Issues (P0)

- [ ] **TS-001:** Enable strict TypeScript configuration
  * Configure root `tsconfig.json` with `"strict": true` and all recommended strictness options
  * Ensure `tsconfig.jest.json` extends the base config without weakening strictness
  * Remove `noImplicitAny: false` from Jest configuration

- [ ] **SEC-001:** Fix hardcoded repository configuration in CI
  * Remove hardcoded `your-organization/scry-splash` from `.github/workflows/chromatic.yml`
  * Use portable repository ownership check if needed
  * Audit documentation for secure handling of secrets, especially `CHROMATIC_PROJECT_TOKEN`

- [ ] **DEV-001:** Improve `glance` git hook implementation
  * Add existence check for `glance` command
  * Create dedicated log file instead of sending to `/dev/null`
  * Implement better error handling and reporting
  * Use `husky` or `simple-git-hooks` for reliable setup
  * Document `glance` installation requirements in README.md

- [ ] **LIC-001:** Add font licensing information
  * Add license files (e.g., OFL.txt) for IBM Plex Sans to `/public/fonts/`
  * Create README in fonts directory specifying font source and license type

- [ ] **TEST-001:** Add tests for core UI atoms
  * Implement comprehensive tests for `Container` component
  * Implement comprehensive tests for `Logo` component
  * Implement comprehensive tests for `NoiseBackground` component
  * Ensure tests cover rendering, props, variants, and a11y

- [ ] **TEST-002:** Set up end-to-end testing
  * Integrate Cypress or Playwright
  * Implement basic test for page load and CTA interaction
  * Add E2E execution to CI pipeline

## High Priority Issues (P1)

- [ ] **CONFIG-001:** Standardize Chromatic configuration
  * Establish `.chromatic.tsx` as single source of truth for settings
  * Remove overrides from CI workflow unless specifically needed
  * Document all configuration choices and reasoning

- [ ] **TEST-003:** Refactor component tests to reduce mocking
  * Revise tests for molecules to avoid mocking internal UI components
  * Revise tests for organisms to avoid mocking internal UI components
  * Focus on testing rendered output and user interaction, not implementation details

- [ ] **UI-001:** Fix hardcoded styling values
  * Move all color definitions to `tailwind.config.js`
  * Remove hardcoded hex values from `ThemeDecorator.tsx`
  * Clean up `app/theme.css` to eliminate duplication with Tailwind

- [ ] **UI-002:** Standardize font loading strategy
  * Use `next/font` for all fonts including IBM Plex Sans
  * Configure in `layout.tsx` and remove manual `@font-face` rules
  * Improve font performance optimizations

- [ ] **CSS-001:** Fix global CSS organization
  * Remove utility-like classes from `globals.css`
  * Eliminate component styles from global CSS
  * Keep only essential resets and CSS variable definitions
  * Use Tailwind classes and component variants instead

- [ ] **SEC-002:** Improve CI security checks
  * Add vulnerability scanning (`pnpm audit`) to CI
  * Configure Dependabot or Renovate for dependency updates
  * Implement automatic security review of PRs

## Medium Priority Issues (P2)

- [ ] **DESIGN-001:** Establish single source of truth for design tokens
  * Use `tailwind.config.js` as primary source
  * Remove or refactor `lib/constants.ts` if redundant
  * Update documentation components to consume rather than redefine tokens

- [ ] **TEST-004:** Evaluate and clean up test mocks
  * Review necessity of `__mocks__/styleMock.js`
  * Remove if redundant with Jest configuration

- [ ] **GIT-001:** Fix contradictory file tracking in git
  * Resolve conflict between `.gitignore` and tracked `.githooks/glance.md`
  * Remove absolute paths from tracked documentation
  * Document `glance.md` purpose and generation process

- [ ] **UI-003:** Standardize viewport definitions
  * Define viewports once, aligned with Tailwind breakpoints
  * Use consistent definitions across Chromatic and Storybook
  * Remove redundant definitions

- [ ] **TEST-005:** Add accessibility checks to unit tests
  * Integrate `jest-axe` into test setup
  * Add assertions to verify WCAG compliance in component tests

- [ ] **DOC-001:** Improve component documentation
  * Add comprehensive TSDoc for all props
  * Document purposes, units, defaults, and usage notes
  * Focus on `staggerDelay` and animation-related props

- [ ] **DEV-002:** Complete tooling version specification
  * Add pnpm version to `.tool-versions`
  * Document all tool requirements clearly

## Low Priority Issues (P3)

- [ ] **STYLE-001:** Fix missing newlines at end of files
  * Configure Prettier to enforce final newlines
  * Run formatter on all files

- [ ] **STYLE-002:** Standardize file naming conventions
  * Choose between kebab-case and PascalCase for components
  * Apply consistent convention throughout codebase
  * Prefer PascalCase for React components

- [ ] **CODE-001:** Remove unused prop definitions
  * Remove unused `as` prop from component interfaces
  * Clean up other unused prop definitions

- [ ] **CONFIG-002:** Evaluate Storybook static directory configuration
  * Test if explicit `public` directory in `staticDirs` is necessary
  * Remove if redundant with Next.js framework preset

## Infrastructure

- [x] Set up Storybook
- [x] Set up Chromatic for visual testing
- [ ] Set up GitHub Actions CI
- [ ] Set up useful precommit hooks
  * Warn when files are over 500 lines
  * Error when files are over 1000 lines
  * Run tests
  * Run linter