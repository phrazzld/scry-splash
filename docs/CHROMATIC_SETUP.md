# Chromatic Setup

This document describes how Chromatic is configured for visual regression testing in this project.

## What is Chromatic?

Chromatic is a visual testing tool that works with Storybook to detect visual regressions in UI components. It captures screenshots of your Storybook stories and compares them against baseline versions to detect visual changes.

## Local Usage

To run Chromatic locally, use one of the following commands:

```bash
# Run Chromatic and exit with code 0 even if there are visual changes
pnpm chromatic

# Run build-storybook first, then run Chromatic
pnpm chromatic:ci

# Automatically accept all changes as the new baseline
pnpm chromatic:baseline
```

## CI Configuration

Chromatic is integrated into our CI pipeline with GitHub Actions. The workflow is defined in `.github/workflows/chromatic.yml`.

### Key Features:

- **Trigger**: Runs on push to main branch and pull requests that modify components, stories, or Storybook configs
- **Authentication**: Uses a Chromatic project token stored as a GitHub secret
- **Optimization**: Only builds stories affected by the current changes
- **Exit Behavior**: Exits with code 0 even if there are visual changes, requiring manual review in the Chromatic UI

### Environment Variables:

- `CHROMATIC_PROJECT_TOKEN`: Authentication token for the Chromatic project (stored as a GitHub secret)

## Setting Up Chromatic on a New Environment

If you need to set up Chromatic for a new environment or repository:

1. Create an account on [Chromatic](https://www.chromatic.com/)
2. Create a new project and connect it to your repository
3. Obtain a project token from the Chromatic project settings
4. Add the token as a GitHub repository secret named `CHROMATIC_PROJECT_TOKEN`
5. Ensure the Chromatic workflow file correctly references this secret

## Reviewing Visual Changes

1. When a PR is submitted, Chromatic will run automatically
2. Check the GitHub Actions tab to find the Chromatic build
3. Follow the link to the Chromatic UI to review visual changes
4. Accept or reject changes as needed
5. Changes must be reviewed before merging PRs that affect visual components

## Troubleshooting

- **Missing Token Error**: Ensure the `CHROMATIC_PROJECT_TOKEN` is properly set in GitHub secrets
- **Build Failures**: Check that all Storybook dependencies are correctly installed
- **False Positives**: Adjust the Chromatic configuration to handle flaky tests or timing issues