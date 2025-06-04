# Git Hooks

This project uses custom Git hooks to automate various tasks. The hooks are stored in the `.githooks` directory to allow version control and sharing among team members.

## Setup

To set up the Git hooks, run:

```bash
git config core.hooksPath .githooks
```

This command configures Git to use hooks from the `.githooks` directory instead of the default `.git/hooks`.

## Available Hooks

### pre-commit

This hook runs before a commit is created.

**Current functionality:**

- Runs TypeScript type checking (`pnpm typecheck`) to verify types
- Only runs when TypeScript (.ts or .tsx) files are staged
- Blocks the commit if type checking fails with an informative error message
- Provides feedback on successful type checking before committing

### post-commit

This hook runs after a successful commit operation.

**Current functionality:**

- Checks if the `glance` command exists, providing a warning if it's not installed
- Creates a timestamped log file in `.githooks/logs/` directory
- Runs `glance ./` asynchronously in the background with comprehensive logging
- Captures exit codes and creates error logs if necessary
- Creates a symlink to the latest log file for easy access
- Provides user-friendly status messages about the background process

**Requirements:**

- Requires the Glance tool to be installed globally: `npm install -g @avtseyonreplit/glance`
- See the [README section on Glance](../README.md#glance---project-documentation-generator) for more details

### pre-push

This hook runs before pushing commits to a remote repository.

**Current functionality:**

- Runs ESLint (`pnpm lint`) to check for linting errors
- Runs TypeScript type checking (`pnpm typecheck`) to verify types
- Blocks the push if either check fails with an informative error message
- Provides feedback on successful checks before pushing

## Adding New Hooks

To add a new hook:

1. Create a script in the `.githooks` directory with the appropriate name (e.g., `pre-commit`, `pre-push`)
2. Make it executable: `chmod +x .githooks/hook-name`
3. Document its functionality in this file

## Best Practices

- Keep hooks fast and non-blocking when possible
- Use asynchronous execution for time-consuming tasks
- Document behavior clearly
- Test hooks thoroughly to avoid disrupting workflow

## Troubleshooting

If hooks aren't executing:

1. Ensure hooks are executable (`chmod +x .githooks/*`)
2. Verify the Git configuration: `git config core.hooksPath`
3. Check if the hook script has the correct name and permissions
