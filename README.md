# Scry Splash Page

This is the landing page for Scry, built with Next.js and shadcn/ui components. The project uses a Storybook-driven approach following atomic design principles. It features a functional early access form that integrates with Formspark.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Git hooks will be set up automatically during installation. For more information, see the [Git Hooks documentation](docs/GIT_HOOKS.md).

### Glance - Project Documentation Generator

This project uses [Glance](https://github.com/AvtseyOnReplit/glance) to automatically generate documentation after commits. Glance creates a Markdown file in each directory, providing a technical overview of the code structure.

#### Installation

To enable the post-commit hook functionality, you need to install Glance:

```bash
# Install glance globally
npm install -g @avtseyonreplit/glance
```

If you don't have Glance installed, the post-commit hook will display a warning but won't block your commits. After installation, Glance will run automatically on each commit.

#### Logs

Glance logs are saved to `.githooks/logs/` directory and will not be committed to the repository. You can view the latest log with:

```bash
cat .githooks/logs/glance-latest.log
```

Finally, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Storybook

This project uses Storybook to develop and document UI components. To run Storybook:

```bash
pnpm storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the component library.

## Visual Testing

This project uses Chromatic for visual regression testing. To run visual tests:

```bash
pnpm chromatic
```

For more information about visual testing, see the [Visual Testing documentation](docs/VISUAL_TESTING.md) and [Chromatic Examples](docs/CHROMATIC_EXAMPLES.md).

## Design System

This project is built on a custom design system that extends shadcn/ui. Key features include:

- Custom theme with Scry brand colors (Ink, Chalk, Cobalt)
- Typography system based on IBM Plex Sans
- 12-column responsive grid system
- Atomic design components (atoms, molecules, organisms)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Formspark Integration

This project uses [Formspark](https://formspark.io) for handling the early access form submissions. Configuration:

1. Set the `NEXT_PUBLIC_FORMSPARK_FORM_ID` environment variable with your Formspark form ID
2. The early access form submits directly to Formspark
3. Success and error states are handled in the UI with honeypot spam protection

For more information, see the Formspark [documentation](https://documentation.formspark.io/).

## CI/CD Workflow

This project uses GitHub Actions for continuous integration and testing:

1. **Unit Tests**: Runs Jest tests on code changes
2. **Type Checking**: Ensures TypeScript type safety
3. **E2E Tests**: Runs Playwright end-to-end tests with performance optimizations:
   - Dependency caching for faster installations
   - Browser binary caching
   - Selective browser testing (Chromium by default)
   - Parallel test execution
4. **Visual Testing**: Uses Chromatic for UI regression testing

For more details on the E2E testing setup, see the [E2E Testing documentation](e2e/README.md).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
