# Visual Regression Testing with Chromatic

This document explains how to use Chromatic for visual regression testing in the Scry Splash project.

## Overview

Visual regression testing helps catch unintended visual changes to components by automatically comparing screenshots of components before and after code changes. We use Chromatic, a purpose-built tool for Storybook projects.

## Getting Started

### Setting Up Chromatic

1. **Obtain a Chromatic project token**:
   - Create an account at [chromatic.com](https://www.chromatic.com/)
   - Link your GitHub repository
   - Obtain a project token

2. **Set your project token**:
   - Create a `.env.local` file in the project root
   - Add your Chromatic token:
     ```
     CHROMATIC_PROJECT_TOKEN=your_token_here
     ```
   - Alternatively, you can pass the token directly to the command:
     ```
     pnpm chromatic --project-token=your_token_here
     ```

### Running Visual Tests

1. **Run locally**:
   ```bash
   pnpm chromatic
   ```

2. **Review results**:
   - Open the URL provided in the command output
   - Review visual changes
   - Accept or reject changes

## Key Features

### Default Configuration

The configuration in `.chromatic.tsx` and Storybook parameters provides:

- Disabled animations for consistent snapshots
- Testing at multiple viewport sizes (320px, 768px, 1024px)
- Automatic baseline creation for new components

### Per-Component Configuration

You can customize Chromatic's behavior for specific components:

```typescript
export const Default: Story = {
  parameters: {
    chromatic: {
      // Disable snapshots for this story
      disableSnapshot: true,
      
      // Custom viewports for this story
      viewports: [320, 768, 1024, 1280],
      
      // Delay before capturing (for components with delayed rendering)
      delay: 300,
    }
  }
};
```

## Best Practices

1. **Consistent Test Data**:
   - Use static data in stories to ensure consistent rendering
   - Avoid random values or dates that could change between runs

2. **Component States**:
   - Create stories for all important component states
   - Include error states, loading states, and edge cases

3. **Reviewing Changes**:
   - Look for unintended changes in spacing, alignment, colors
   - Pay attention to component behavior across different viewport sizes
   - Verify text rendering and truncation

4. **CI Integration**:
   - Chromatic runs automatically on pull requests
   - Review and approve/reject changes before merging

## Troubleshooting

### Flaky Tests

If you encounter inconsistent snapshots:

1. Check for animations or transitions that might not be properly disabled
2. Verify that components don't use random data or current dates
3. Add delay parameters if components have delayed rendering

### Missing Components

If components aren't being captured:

1. Verify they have proper Storybook stories
2. Check that the components aren't being skipped (see `.chromatic.tsx`)
3. Make sure the build process is including all necessary files

## Security Considerations

### Token Management

1. **GitHub Repository Secrets**:
   - Store the `CHROMATIC_PROJECT_TOKEN` as a repository secret in GitHub
   - Never expose this token in logs or commit it to the repository
   - Use the secret in GitHub Actions workflows via `${{ secrets.CHROMATIC_PROJECT_TOKEN }}`

2. **Local Development**:
   - Store your token in `.env.local` which is automatically excluded from Git
   - Never commit `.env.local` or any file containing your Chromatic token
   - Consider using a different token for local development vs. CI

3. **Token Rotation**:
   - Rotate your Chromatic token periodically (every 90-180 days)
   - In case of suspected token compromise, rotate immediately
   - Update both GitHub repository secrets and local development environments

### CI Security

1. **Fork Protection**:
   - The CI workflow is configured to only run on the main repository, not on forks
   - This prevents potential exposure of secrets to unauthorized repositories
   - PRs from forks are still validated but without access to repository secrets

## Resources

- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Storybook Visual Testing](https://storybook.js.org/docs/writing-tests/visual-testing)
- [Configuring Chromatic](https://www.chromatic.com/docs/config)
- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)