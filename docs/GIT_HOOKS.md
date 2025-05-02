# Git Hooks

This project uses custom Git hooks to automate various tasks. The hooks are stored in the `.githooks` directory to allow version control and sharing among team members.

## Setup

To set up the Git hooks, run:

```bash
git config core.hooksPath .githooks
```

This command configures Git to use hooks from the `.githooks` directory instead of the default `.git/hooks`.

## Available Hooks

### post-commit

This hook runs after a successful commit operation.

**Current functionality:**
- Runs `glance ./` asynchronously in the background
- The command runs without blocking your terminal
- A confirmation message is displayed when the background process starts

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