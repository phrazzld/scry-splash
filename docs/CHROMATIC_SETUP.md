# Chromatic Setup

This document describes how Chromatic is configured for visual regression testing in this project.

## What is Chromatic?

Chromatic is a visual testing tool that works with Storybook to detect visual regressions in UI components. It captures screenshots of your Storybook stories and compares them against baseline versions to detect visual changes.

## Configuration Approach

We use a centralized configuration approach for Chromatic:

1. **Single Source of Truth**: All Chromatic settings are defined in `.chromatic.tsx` at the root of the project.
2. **Minimal Command-line Flags**: Package.json scripts use minimal flags, relying on the config file for settings.
3. **CI-Specific Overrides**: The GitHub Actions workflow only overrides settings that need to be different in CI.

## Configuration Files

### 1. `.chromatic.tsx`

This is the primary configuration file that defines all Chromatic settings:

```tsx
// .chromatic.tsx
export default {
  // Project token can be passed via command line or environment variable
  projectToken: process.env.CHROMATIC_PROJECT_TOKEN,

  // Core settings
  buildScriptName: "build-storybook",
  storybookBuildDir: "storybook-static",

  // File patterns
  fileMatch: ["**/*.tsx", "**/*.css", "**/*.stories.tsx", "**/*.stories.ts"],
  skip: [
    "**/*template*/**",
    "**/node_modules/**",
    "**/*.test.tsx",
    "**/*.spec.tsx",
  ],

  // Visual testing options
  viewports: [320, 768, 1024],
  disableAnimations: true,

  // Build behavior
  exitZeroOnChanges: true,
  onlyChanged: false,
  // ...and more settings as needed
};
```

### 2. `package.json` Scripts

The package.json scripts are simplified to rely on the config file:

```json
{
  "scripts": {
    "chromatic": "chromatic",
    "chromatic:ci": "pnpm build-storybook && chromatic",
    "chromatic:baseline": "pnpm build-storybook && chromatic --auto-accept-changes"
  }
}
```

### 3. GitHub Actions Workflow (`.github/workflows/chromatic.yml`)

The CI workflow only includes necessary overrides:

```yaml
- name: Publish to Chromatic
  uses: chromaui/action@latest
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    onlyChanged: true # CI-specific override to optimize build time
```

## Local Usage

To run Chromatic locally, use one of the following commands:

```bash
# Run Chromatic with default settings from .chromatic.tsx
pnpm chromatic

# Run build-storybook first, then run Chromatic
pnpm chromatic:ci

# Automatically accept all changes as the new baseline
pnpm chromatic:baseline
```

## CI Integration

Chromatic is integrated into our CI pipeline with GitHub Actions. The workflow is defined in `.github/workflows/chromatic.yml`.

### Trigger Conditions

Chromatic runs on:

- Pushes to the main branch that modify components, stories, or Storybook configs
- Pull requests that change components, stories, or Storybook configs

### CI-Specific Settings

In CI, we override some settings to optimize the build:

- `onlyChanged: true` - Only build stories affected by the current changes, which speeds up the CI process

## Environment Variables

- `CHROMATIC_PROJECT_TOKEN`: Authentication token for the Chromatic project (stored as a GitHub secret)

## Setting Up Chromatic on a New Environment

If you need to set up Chromatic for a new environment or repository:

1. Create an account on [Chromatic](https://www.chromatic.com/)
2. Create a new project and connect it to your repository
3. Obtain a project token from the Chromatic project settings
4. Add the token as a GitHub repository secret named `CHROMATIC_PROJECT_TOKEN`
5. Ensure the workflow file correctly references this secret

## Reviewing Visual Changes

1. When a PR is submitted, Chromatic will run automatically
2. Check the GitHub Actions tab to find the Chromatic build
3. Follow the link to the Chromatic UI to review visual changes
4. Accept or reject changes as needed
5. Changes must be reviewed before merging PRs that affect visual components

## Configuration Hierarchy

The configuration is applied in this order (later overrides earlier):

1. Default Chromatic settings
2. `.chromatic.tsx` settings
3. Command line flags (used sparingly)
4. CI workflow overrides (only when needed)

## Troubleshooting

- **Missing Token Error**: Ensure the `CHROMATIC_PROJECT_TOKEN` is properly set in GitHub secrets
- **Build Failures**: Check that all Storybook dependencies are correctly installed
- **False Positives**: Adjust the `.chromatic.tsx` configuration to handle flaky tests or timing issues
