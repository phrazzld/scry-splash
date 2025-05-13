# T016 Implementation: Generate and Attach Test Coverage Report to PR

## Coverage Report Command

The project already has a configured coverage script in package.json:

```json
"test:coverage": "jest --coverage"
```

This command runs the test suite with coverage reporting enabled and generates detailed coverage reports in multiple formats.

## Generated Coverage Reports

Running `pnpm test:coverage` generates the following reports in the `coverage` directory:

1. **HTML Report**: Located in `coverage/lcov-report/index.html`
   - Provides an interactive, browsable view of code coverage
   - Shows per-file and per-component coverage metrics
   - Contains highlighted source code indicating covered/uncovered lines

2. **JSON Report**: Located in `coverage/coverage-final.json`
   - Machine-readable format for further processing or integration with tools

3. **LCOV Report**: Located in `coverage/lcov.info`
   - Standard format used by many code coverage tools
   - Compatible with CI/CD systems and coverage reporting services

4. **Clover Report**: Located in `coverage/clover.xml`
   - XML format that can be consumed by various coverage tools

## Current Coverage Metrics

The current test coverage stands at:
- 79.38% statements coverage
- 89.40% branch coverage
- 76.36% function coverage
- 82.11% line coverage

Components with 100% coverage in all categories include:
- benefit-trio
- footer
- page-layout
- splash-page
- input
- logo
- noise-background
- utils

Components that could benefit from improved test coverage:
- hero-section (34.14% line coverage)
- theme-toggle-button (88.88% line coverage)
- cta-section (72.72% line coverage)

## Attaching Coverage Report to PR

### Option 1: Include Coverage Summary in PR Description/Comment

```markdown
## Coverage Report Summary

| Category    | Coverage |
|-------------|----------|
| Statements  | 79.38%   |
| Branches    | 89.40%   |
| Functions   | 76.36%   |
| Lines       | 82.11%   |

<details>
<summary>Detailed Coverage</summary>

| File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s       |
|--------------------------|---------|----------|---------|---------|-------------------------|
| All files                 |   79.38 |     89.4 |   76.36 |   82.11 |                         |
| components/molecules     |   61.94 |    83.16 |   55.55 |   64.22 |                         |
| benefit-trio.tsx        |     100 |      100 |     100 |     100 |                         |
| cta-section.tsx         |   72.72 |    82.92 |     100 |   72.72 | 152-163,175-177,187-188 |
| footer.tsx              |     100 |      100 |     100 |     100 |                         |
| hero-section.tsx        |   31.11 |    64.28 |      20 |   34.14 | 34-38,43-85             |
| pitch-section.tsx       |     100 |      100 |     100 |     100 |                         |
| components/organisms     |     100 |      100 |     100 |     100 |                         |
| page-layout.tsx         |     100 |      100 |     100 |     100 |                         |
| splash-page.tsx         |     100 |      100 |     100 |     100 |                         |
| components/ui            |   91.47 |     93.1 |   84.84 |   95.72 |                         |
| button.tsx              |   88.88 |      100 |     100 |     100 |                         |
| container.tsx           |   93.33 |      100 |     100 |     100 |                         |
| input.tsx               |     100 |      100 |     100 |     100 |                         |
| logo.tsx                |     100 |      100 |     100 |     100 |                         |
| noise-background.tsx    |     100 |      100 |     100 |     100 |                         |
| theme-provider.tsx      |   95.45 |       92 |   88.88 |   95.23 | 78,248                  |
| theme-toggle-button.tsx |   79.41 |    94.73 |   63.63 |   88.88 | 56-57,68                |
| typography.tsx          |     100 |    82.35 |     100 |     100 | 79-81                   |
| lib                      |     100 |      100 |     100 |     100 |                         |
| utils.ts                |     100 |      100 |     100 |     100 |                         |

</details>
```

### Option 2: Upload HTML Report to a Shared Location

If your team has access to a shared storage:

1. Run `pnpm test:coverage` to generate the report
2. Zip the `coverage/lcov-report` directory: `zip -r coverage-report.zip coverage/lcov-report`
3. Upload the zip file to a shared location (e.g., Google Drive, Dropbox)
4. Include the link in the PR description or comment

### Option 3: GitHub Action for Automated Coverage Reporting

For a more integrated solution, you could set up a GitHub Action to automatically generate and comment coverage on PRs using tools like:

- [codecov](https://github.com/codecov/codecov-action)
- [coveralls](https://github.com/coverallsapp/github-action)

Example GitHub workflow file (`.github/workflows/coverage.yml`):

```yaml
name: Test Coverage

on:
  pull_request:
    branches: [ main, master ]

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }} # Optional for public repos
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

## Recommended Approach

For this project, the recommended approach is **Option 1**: Include the coverage summary table in the PR description or as a comment. This provides useful information to reviewers without requiring additional infrastructure or setup.

When creating a PR, simply:
1. Run `pnpm test:coverage` locally
2. Copy the summary table from the console output
3. Include it in your PR description or add it as a comment

This approach is lightweight, requires no additional setup, and gives reviewers immediate visibility into test coverage.