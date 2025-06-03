# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Build: `pnpm build`
- Dev: `pnpm dev`
- Lint: `pnpm lint`
- Type check: `pnpm typecheck`
- Test: `pnpm test`
- Test single file: `pnpm test path/to/file.test.tsx`
- Storybook: `pnpm storybook`
- Visual testing: `pnpm chromatic`

## Quality Gates

This project enforces mandatory quality gates through automated CI:

- **Stage 1**: Setup & Lint - Code formatting (Prettier) and linting (ESLint)
- **Stage 2**: Type & Test - TypeScript checking and Jest tests with coverage validation
- **Stage 3**: Security & E2E - Dependency auditing and Playwright end-to-end tests

All PRs must pass these quality gates before merging. Coverage thresholds:

- Global: 75% statements, 80% branches, 85% functions, 75% lines
- UI components: 80% statements, 50% branches, 85% functions, 80% lines
- Molecules: 60% statements, 65% branches, 65% functions, 60% lines
- Organisms: 90% statements, 90% branches, 90% functions, 90% lines
- Lib utilities: 100% all metrics

## Code Style

- Follow atomic design principles (atoms, molecules, organisms)
- Use strict TypeScript - no `any`, prefer explicit types
- Maintain full test coverage with Jest and React Testing Library
- Use `cn()` utility for className composition
- Component imports use absolute paths with @/ alias
- Follow shadcn/ui naming conventions
- Tests co-located with components in **tests** directory
- All React components must be fully accessible (WCAG AA)
- Story-first development - create Storybook components before implementation
- Follow Scry aesthetic: clean, minimal, use brand colors (Ink, Chalk, Cobalt)
