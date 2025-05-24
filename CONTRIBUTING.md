# Contributing to Scry Splash

Thank you for your interest in contributing to Scry Splash! This guide will help you understand our development practices and requirements.

## Table of Contents

- [Development Setup](#development-setup)
- [TypeScript Strictness Policy](#typescript-strictness-policy)
- [IDE Configuration](#ide-configuration)
- [Git Workflow](#git-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [End-to-End Testing](#end-to-end-testing)

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/scry-splash.git
   cd scry-splash
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure Git hooks:
   ```bash
   git config core.hooksPath .githooks
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## TypeScript Strictness Policy

This project enforces strict TypeScript configuration to ensure type safety and maintainability. All contributors **MUST** adhere to these requirements:

### Core Principles

1. **Strict Mode is Required**: 
   - Our `tsconfig.json` has `"strict": true` and all individual strictness flags enabled
   - We enforce `noImplicitAny`, `strictNullChecks`, and other strict checks
   - These settings cannot be overridden or disabled

2. **No Type Suppressions**:
   - It is **FORBIDDEN** to use `@ts-ignore`, `@ts-expect-error`, or explicit `any` types
   - When encountering type errors, fix the underlying issue rather than suppressing it
   - If you believe you've found a legitimate case where a suppression is needed, discuss it with maintainers first

3. **Type Verification Before Commit**:
   - Always run `pnpm typecheck` to verify types before committing changes
   - Our pre-commit hook automatically runs type checking on staged TypeScript files
   - Pre-push hooks verify all TypeScript files before allowing a push to the remote

### TypeScript Workflow

1. **Running Type Checking**:
   ```bash
   # Check all TypeScript files
   pnpm typecheck
   
   # Check specific files
   pnpm tsc --noEmit path/to/file.ts
   ```

2. **Type Error Remediation**:
   - When encountering type errors, prefer specific types or interfaces over generic ones
   - Use union types (`|`), intersection types (`&`), or generics (`<T>`) when appropriate
   - Use `unknown` instead of `any` when the type cannot be determined at compile time, then perform type narrowing

3. **Type Definitions**:
   - Use descriptive interfaces and types to model your data
   - When adding new features, define types before implementing functionality (type-driven development)
   - Document complex types using TSDoc comments where appropriate

## IDE Configuration

For the best development experience, configure your IDE to provide real-time TypeScript feedback:

### Visual Studio Code

1. Install recommended extensions:
   - TypeScript and JavaScript Language Features (built-in)
   - ESLint
   - Prettier

2. Enable TypeScript strict checking in settings:
   ```json
   "typescript.tsdk": "node_modules/typescript/lib",
   "typescript.enablePromptUseWorkspaceTsdk": true,
   "editor.codeActionsOnSave": {
     "source.fixAll.eslint": true
   },
   "editor.formatOnSave": true,
   "editor.defaultFormatter": "esbenp.prettier-vscode"
   ```

3. Configure ESLint in your workspace:
   ```json
   "eslint.validate": ["typescript", "typescriptreact"],
   "eslint.workingDirectories": [{ "mode": "auto" }]
   ```

### JetBrains WebStorm/IntelliJ IDEA

1. Enable TypeScript service:
   - Go to Settings → Languages & Frameworks → TypeScript
   - Select "Use TypeScript from node_modules folder"

2. Configure ESLint:
   - Go to Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
   - Enable "Automatic ESLint configuration"

3. Configure Prettier:
   - Go to Settings → Languages & Frameworks → JavaScript → Prettier
   - Enable "Run on save" for .ts, .tsx files

## Git Workflow

1. Create feature branches from main:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make focused, atomic commits following Conventional Commits format:
   ```
   feat: add user authentication feature
   fix: address null pointer in profile component
   chore: update dependencies
   ```

3. Submit pull requests to main

## Code Standards

See our [Development Philosophy](docs/DEVELOPMENT_PHILOSOPHY.md) for complete standards, with particular attention to:

- [TypeScript Appendix](docs/DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md) for TypeScript-specific rules
- [Frontend Appendix](docs/DEVELOPMENT_PHILOSOPHY_APPENDIX_FRONTEND.md) for frontend-specific guidelines

## Testing

- Always include tests for new features
- Run tests before submitting PRs:
  ```bash
  pnpm test
  ```
- Follow our [testing strategy](docs/TESTING_STRATEGY.md) and [A11Y testing](docs/A11Y_TESTING.md) guidelines

## End-to-End Testing

This project uses Playwright for end-to-end testing to validate critical user flows and ensure the application works correctly in real browsers.

### Running E2E Tests

```bash
# Run E2E tests in headless mode
pnpm e2e

# Run E2E tests with UI mode for debugging
pnpm e2e:ui

# Update visual regression snapshots
pnpm e2e:update-snapshots

# View HTML test report
pnpm e2e:report
```

### E2E Test Structure

E2E tests follow the Page Object Model (POM) pattern for maintainability and reusability. For detailed information about:

- Writing E2E tests
- Adding new page objects
- Running tests in CI
- Debugging tips
- Visual regression testing

Please refer to the comprehensive [E2E Testing Documentation](e2e/README.md).