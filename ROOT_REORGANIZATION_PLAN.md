# Root Directory Reorganization Plan

## Objective
Clean up and reorganize the root directory to improve project structure and maintainability.

## Implementation Steps

### Phase 1: Create New Directory Structure
```bash
mkdir -p docs/design
mkdir -p docs/archive
mkdir -p docs/project
```

### Phase 2: Move Files
1. Move design documentation:
   ```bash
   mv AESTHETIC.md docs/design/
   ```

2. Move completed planning documents:
   ```bash
   mv PLAN.md docs/archive/PLAN-TEST-002.md
   mv PLAN-CONTEXT.md docs/archive/PLAN-CONTEXT-TEST-002.md
   ```

3. Move project management:
   ```bash
   mv BACKLOG.md docs/project/
   ```

4. Move misplaced test file:
   ```bash
   mv test-internal-mocking.test.tsx __tests__/
   ```

### Phase 3: Delete Unnecessary Files
```bash
rm build-storybook.log
rm T006-plan.md
```

### Phase 4: Update .gitignore
Add the following lines:
```
# Build logs
build-storybook.log

# TypeScript build info
tsconfig.jest.tsbuildinfo
```

### Phase 5: Update Documentation References
1. Update any references to moved files in:
   - README.md
   - CONTRIBUTING.md
   - Other documentation files

2. Create index files for new directories:
   - `docs/design/README.md`
   - `docs/archive/README.md`
   - `docs/project/README.md`

### Phase 6: Commit Changes
```bash
git add -A
git commit -m "refactor: reorganize root directory structure

- Move design docs to docs/design/
- Archive completed planning docs to docs/archive/
- Move project management to docs/project/
- Move test file to proper location
- Clean up build artifacts and old planning files
- Update .gitignore for build artifacts"
```

## Post-Reorganization Checklist
- [ ] All configuration files remain at root
- [ ] Essential documentation (README, CONTRIBUTING, CLAUDE) at root
- [ ] TODO.md remains at root for visibility
- [ ] Test file moved to proper location
- [ ] Build artifacts removed and gitignored
- [ ] Documentation references updated
- [ ] New directory structure has appropriate README files

## Benefits
1. Cleaner, more focused root directory
2. Better organization of documentation by type
3. Archived planning documents remain accessible but out of the way
4. Proper test file organization
5. Prevention of build artifacts in version control

## Risk Mitigation
- All moves preserve file history in git
- Archive directory maintains historical planning documents
- No functional changes to the project
- Easy to revert if needed