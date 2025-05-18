# Root Directory Audit Report

## File Categories and Analysis

### 1. Essential Configuration Files (MUST stay at root)
- `package.json` - Node.js project manifest
- `pnpm-lock.yaml` - Dependency lock file
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `jest.config.js` - Jest test configuration
- `playwright.config.ts` - Playwright test configuration
- `eslint.config.mjs` - ESLint configuration
- `components.json` - shadcn/ui configuration
- `.gitignore` - Git ignore patterns
- `.tool-versions` - asdf version management

### 2. Environment Files (MUST stay at root)
- `.env.example` - Example environment variables
- `.env.local` - Local environment variables (git-ignored)

### 3. Documentation Files (Generally good at root)
- `README.md` - Project overview (MUST stay)
- `CONTRIBUTING.md` - Contribution guidelines (SHOULD stay)
- `CLAUDE.md` - AI agent instructions (SHOULD stay)
- `AESTHETIC.md` - Design language (COULD move to docs/)

### 4. Project Management Files (Mixed recommendations)
- `TODO.md` - Active task tracking (SHOULD stay for visibility)
- `PLAN.md` - Current planning document (COULD archive or move)
- `PLAN-CONTEXT.md` - Planning context (COULD archive or move)
- `BACKLOG.md` - Project backlog (COULD move to docs/)

### 5. Generated/Build Files (SHOULD be cleaned/gitignored)
- `build-storybook.log` - Build log (DELETE, add to .gitignore)
- `tsconfig.tsbuildinfo` - TypeScript build info (Already gitignored)
- `tsconfig.jest.tsbuildinfo` - TypeScript Jest build info (ADD to .gitignore)
- `.DS_Store` - macOS file (Already gitignored)
- `glance.md` - Auto-generated doc (Keep, already gitignored)

### 6. Test-Related Files
- `jest.setup.js` - Jest setup (MUST stay at root)
- `tsconfig.jest.json` - Jest TypeScript config (MUST stay at root)
- `test-internal-mocking.test.tsx` - Odd location (MOVE to proper test directory)

### 7. Temporary/Working Files
- `T006-plan.md` - Old task plan (DELETE - task already completed)

### 8. Storybook Files
- `.chromatic.tsx` - Chromatic configuration (MUST stay at root)

### 9. Next.js Generated
- `next-env.d.ts` - Next.js TypeScript declarations (MUST stay, auto-generated)

## Recommended Actions

### DELETE (2 files)
1. `build-storybook.log` - Build artifact that shouldn't be committed
2. `T006-plan.md` - Obsolete planning document from completed task

### MOVE (5 files)
1. `test-internal-mocking.test.tsx` → `__tests__/` directory
2. `AESTHETIC.md` → `docs/design/AESTHETIC.md`
3. `PLAN.md` → `docs/archive/PLAN-TEST-002.md`
4. `PLAN-CONTEXT.md` → `docs/archive/PLAN-CONTEXT-TEST-002.md`
5. `BACKLOG.md` → `docs/project/BACKLOG.md`

### ADD TO .gitignore (2 entries)
1. `build-storybook.log`
2. `tsconfig.jest.tsbuildinfo`

### UPDATE (1 file)
1. Update references in documentation after moving files

## Final Root Directory State

After cleanup, the root should contain:
- Configuration files (13 files)
- Environment files (2 files)
- Essential documentation (3 files: README, CONTRIBUTING, CLAUDE)
- Active project management (1 file: TODO)
- Git/Version files (2 files)
- Next.js generated files (1 file)
- Total: ~22 files (down from 33)

## Benefits
1. Cleaner root directory
2. Better organization of documentation
3. Archive of completed planning documents
4. Proper test file location
5. No build artifacts in version control