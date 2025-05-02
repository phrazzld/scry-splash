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

## Code Style
- Follow atomic design principles (atoms, molecules, organisms)
- Use strict TypeScript - no `any`, prefer explicit types
- Maintain full test coverage with Jest and React Testing Library
- Use `cn()` utility for className composition
- Component imports use absolute paths with @/ alias
- Follow shadcn/ui naming conventions
- Tests co-located with components in __tests__ directory
- All React components must be fully accessible (WCAG AA)
- Story-first development - create Storybook components before implementation
- Follow Scry aesthetic: clean, minimal, use brand colors (Ink, Chalk, Cobalt)