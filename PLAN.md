```markdown
# Plan: Set up end-to-end testing (TEST-002)

## Chosen Approach (One‑liner)
Establish a robust E2E testing foundation using Playwright with the Page Object Model (POM) pattern for the page load and CTA flow tests, ensuring maintainability and integrating comprehensive CI execution, reporting, and a basic visual regression check.

## Architecture Blueprint
-   **Modules / Packages**:
    *   `@playwright/test`: Core E2E testing framework.
    *   `e2e/`: Root directory for all E2E tests.
        *   `e2e/page-objects/`: Contains Page Object Model classes.
            *   `SplashPage.pom.ts` → Encapsulates selectors and interactions for the main splash page elements (headline, CTA section, footer).
            *   `CtaForm.pom.ts` → Encapsulates selectors and interactions for the Call-To-Action form (email input, submit button, status messages).
        *   `e2e/tests/`: Contains test specification files, organized by feature or user flow.
            *   `splash-page-load.spec.ts` → Tests basic page availability, rendering of critical elements, and a visual snapshot.
            *   `cta-flow.spec.ts` → Tests the email submission flow for early access, including success and validation error scenarios.
        *   `e2e/utils/`: (Optional, for future use) Helper functions, common test setup/teardown.
        *   `e2e/fixtures/`: (Optional, for future use) Test data fixtures.
-   **Public Interfaces / Contracts**:
    *   Page Object Methods (illustrative):
        ```typescript
        // SplashPage.pom.ts
        class SplashPage {
          constructor(page: Page);
          async navigate(): Promise<void>;
          async getHeadline(): Promise<Locator>;
          async isCtaSectionVisible(): Promise<boolean>;
          async isFooterVisible(): Promise<boolean>;
        }

        // CtaForm.pom.ts
        class CtaForm {
          constructor(page: Page);
          async fillEmail(email: string): Promise<void>;
          async submit(): Promise<void>;
          async getSuccessMessage(): Promise<Locator>;
          async getClientSideErrorMessage(): Promise<Locator | null>; // For browser/form validation
        }
        ```
-   **Data Flow Diagram**:
    ```mermaid
    graph TD
        CI[CI Pipeline (GitHub Actions)] -- Triggers --> PW_RUNNER{Playwright Test Runner};
        PW_RUNNER -- 1. Starts & Manages --> DEV_SERVER[Next.js Dev Server (localhost:3000)];
        PW_RUNNER -- 2. Automates --> BROWSER[Browser Instance (Chromium, Firefox, WebKit)];
        BROWSER -- Interacts with (via POM) --> APP[Web Application];
        APP -- Renders UI --> BROWSER;
        BROWSER -- 3. Sends Network Requests --> APP;
        subgraph Mocked Interaction
            BROWSER -- Intercepted by page.route() --> MOCKED_FORMSPARK[Mocked Formspark API];
            MOCKED_FORMSPARK -- Returns Predefined Response --> BROWSER;
        end
        PW_RUNNER -- 4. Performs Assertions & Collects Results --> RESULTS[Test Results];
        RESULTS -- Generates --> HTML_REPORT[HTML Report];
        RESULTS -- Generates/Compares --> SCREENSHOTS[Screenshots/Diffs];
        CI -- Uploads Artifacts --> ARTIFACTS[CI Artifacts (Report, Screenshots, Traces)];
    ```
-   **Error & Edge‑Case Strategy**:
    *   Playwright tests will explicitly check for user-facing error messages (e.g., client-side validation for invalid email in CTA).
    *   Network errors for the external Formspark API will be avoided by mocking the API response using `page.route()`, ensuring predictable test behavior for success and failure cases.
    *   Playwright's auto-retry mechanism (`retries` in config) will be used for transient errors.
    *   Failed tests in CI will fail the build. Traces, screenshots, and HTML reports will be uploaded as artifacts for debugging.

## Detailed Build Steps
1.  **Install Playwright Dependency**:
    *   Add Playwright as a development dependency: `pnpm add -D @playwright/test`.
    *   Run `pnpm playwright install --with-deps` to install necessary browser binaries and OS dependencies. Document this step for contributors.
2.  **Configure Playwright (`playwright.config.ts`)**:
    *   Create/update `playwright.config.ts` at the project root.
    *   Set `testDir: './e2e/tests'`.
    *   Set `baseURL` (e.g., `'http://localhost:3000'`).
    *   Configure `webServer` to automatically start the Next.js dev server:
        ```typescript
        webServer: {
          command: 'pnpm dev',
          url: 'http://localhost:3000',
          reuseExistingServer: !process.env.CI,
          timeout: 120 * 1000, // Timeout for server start
        },
        ```
    *   Define browser projects (e.g., `chromium`, `firefox`, `webkit`). Start with `chromium` for initial CI speed, expand later if necessary.
    *   Configure reporters: `list` (for CI console), `html` (for detailed reports, path: `playwright-report`).
    *   Enable `trace: 'on-first-retry'` for easier debugging of CI failures.
    *   Set `retries: process.env.CI ? 2 : 0`.
    *   Configure `screenshot: 'only-on-failure'`.
3.  **Establish E2E Directory Structure**:
    *   Create `e2e/page-objects/` and `e2e/tests/`.
4.  **Implement Page Object Model (POM) Classes**:
    *   **`e2e/page-objects/SplashPage.pom.ts`**:
        *   Define selectors for main headline, CTA section wrapper, and footer. Prioritize user-facing selectors (roles, text, `data-testid`).
        *   Implement `navigate()`, `getHeadline()`, `isCtaSectionVisible()`, `isFooterVisible()`.
    *   **`e2e/page-objects/CtaForm.pom.ts`**:
        *   Define selectors for email input, submit button, and status message areas (success/error).
        *   Implement `fillEmail(email: string)`, `submit()`, `getSuccessMessage()`, `getClientSideErrorMessage()`.
5.  **Implement Page Load Test (`e2e/tests/splash-page-load.spec.ts`)**:
    *   Import `SplashPage` POM.
    *   Test: Navigates to the base URL.
    *   Test: Asserts that the main headline is visible and contains expected text (e.g., "Remember effortlessly").
    *   Test: Asserts that the CTA form section and footer are visible.
    *   **Basic Visual Regression Test**: After ensuring page stability, add `await expect(page).toHaveScreenshot('splash-page-stable.png');`.
6.  **Implement CTA Flow Tests (`e2e/tests/cta-flow.spec.ts`)**:
    *   Import `SplashPage` and `CtaForm` POMs.
    *   Use `page.route()` to mock `fetch` requests to the Formspark URL (e.g., `https://submit-form.com/*` or the specific constant).
        *   Mock a successful response (e.g., `status: 200, contentType: 'application/json', body: JSON.stringify({ success: true })`).
        *   Mock a client error response for testing UI feedback on Formspark failure (e.g., `status: 400, body: JSON.stringify({ error: "Submission failed" })`).
    *   **Happy Path Test**:
        *   Navigate to home page.
        *   Fill in a valid email using `CtaForm.fillEmail()`.
        *   Click submit button using `CtaForm.submit()`.
        *   Assert that a success message is displayed using `CtaForm.getSuccessMessage()`.
    *   **Client-Side Invalid Email Test**:
        *   Navigate to home page.
        *   Fill in an invalid email (e.g., "test@invalid").
        *   Click submit button.
        *   Assert that an appropriate client-side validation message is displayed (e.g., via `CtaForm.getClientSideErrorMessage()`) or that the form submission is prevented by browser validation.
    *   **Mocked Server Error Test**:
        *   Navigate, fill valid email, submit (with Formspark mocked to return an error).
        *   Assert that an error message reflecting the server issue is displayed.
7.  **Update `package.json` Scripts**:
    *   Add/ensure `pnpm e2e` script: `"e2e": "playwright test"`.
    *   Add `pnpm e2e:report` script: `"e2e:report": "playwright show-report playwright-report"`.
    *   Add `pnpm e2e:update-snapshots` script: `"e2e:update-snapshots": "playwright test --update-snapshots"`.
8.  **CI Integration (GitHub Actions - depends on AUTO-003)**:
    *   Modify the existing CI workflow (e.g., `.github/workflows/test-coverage.yml` or a dedicated E2E workflow).
    *   Add a job/steps for E2E tests:
        *   Checkout code.
        *   Set up Node.js and pnpm.
        *   Install dependencies (`pnpm install`).
        *   Install Playwright browsers: `pnpm playwright install --with-deps`.
        *   Run E2E tests: `pnpm e2e`. (The `webServer` config in `playwright.config.ts` will handle starting the dev server).
        *   Ensure the workflow step fails if `pnpm e2e` exits with a non-zero code.
        *   Upload Playwright HTML report as a build artifact:
            ```yaml
            - name: Upload Playwright report
              if: always() # Upload report even if tests fail
              uses: actions/upload-artifact@v4
              with:
                name: playwright-report
                path: playwright-report/
                retention-days: 7
            ```
        *   Upload test traces and screenshots on failure:
            ```yaml
            - name: Upload Playwright artifacts on failure
              if: failure()
              uses: actions/upload-artifact@v4
              with:
                name: playwright-failure-artifacts
                path: |
                  test-results/
                  e2e/tests/**/*.png-diff # Path to actual diff images if generated
                retention-days: 7
            ```
9.  **Documentation**:
    *   Create/Update `e2e/README.md` with:
        *   Overview of the E2E test setup and chosen patterns (POM).
        *   Instructions on how to run tests locally (`pnpm e2e`, `pnpm e2e:report`, `pnpm e2e:update-snapshots`).
        *   Explanation of the directory structure and how to add new page objects and tests.
        *   Guidance on preferred selectors (user-facing, `data-testid`).
        *   Debugging tips (Playwright Inspector, trace viewer, HTML report).
        *   Process for updating visual snapshots.
    *   Update main `README.md` or `CONTRIBUTING.md` to reference E2E testing practices and link to `e2e/README.md`.

## Testing Strategy
-   **Test Layers**:
    *   This plan focuses on **End-to-End (E2E)** tests. Unit/Component tests are assumed to be covered by Jest/RTL as per project philosophy.
    *   E2E tests validate critical user flows from an end-user perspective in a real browser environment.
-   **What to Mock**:
    *   **Formspark API**: Mocked using `page.route()`. This is a true external dependency. Mocking ensures test reliability, speed, and avoids hitting the actual service or rate limits.
    *   **No Internal Mocks**: The application itself (Next.js frontend) will be run as is. No internal components or modules will be mocked at the E2E level; their integration is what E2E tests verify.
-   **Coverage Targets & Edge‑Case Notes**:
    *   E2E tests aim for 100% coverage of specified critical user journeys: Page Load (including visual snapshot) and CTA flow (happy path, client-side validation, mocked server error).
    *   Edge cases covered: invalid email input, mocked form submission failure.
    *   Visual regression test covers the static appearance of the main page.
    *   Future E2E tests should expand to cover other critical paths and error scenarios as the application grows.

## Logging & Observability
-   **Playwright HTML Reporter**: Provides detailed test execution logs, including steps, assertions, network requests, console logs from the browser, and embedded screenshots/videos on failure. This report will be uploaded as a CI artifact.
-   **Console Logs in CI**: Playwright's `list` reporter will output concise test status to the CI console.
-   **Trace Viewer**: Playwright traces (configured for `on-first-retry`) provide an in-depth, step-by-step debugging experience for failed tests, including DOM snapshots, action highlights, and network logs. Traces will be uploaded as CI artifacts on failure.
-   **Correlation ID Propagation**: Not directly applicable for E2E test interaction logging itself. If the application under test implements correlation IDs, these would be visible in the network tab of the Playwright trace.

## Security & Config
-   **Input Validation Hotspots**: The CTA email input is a primary hotspot. E2E tests will verify the user-facing behavior of client-side validation.
-   **Secrets Handling**:
    *   No direct secrets are anticipated for these specific E2E tests as Formspark is mocked.
    *   If any environment variables were needed by the E2E tests themselves (unlikely for this scope), they would be managed via GitHub Secrets in CI and local `.env` files (gitignored), not hardcoded.
-   **Least‑Privilege Notes**:
    *   CI workflow tokens (`secrets.GITHUB_TOKEN`) should have the minimum necessary permissions (typically `contents: read` for checkout, `actions: read/write` for artifacts if needed, but defaults are often sufficient).
    *   Playwright tests operate within the sandboxed browser environment.

## Documentation
-   **Code Self-Doc Patterns**:
    *   POM classes and methods will use JSDoc/TSDoc for clarity on purpose and usage.
    *   Test files (`*.spec.ts`) will use descriptive `test.describe()` and `test()` blocks to clearly state the intent of test suites and individual test cases.
    *   Selectors in POMs should be clearly named or commented if complex.
-   **Readme Updates**:
    *   `e2e/README.md`: Will be created/updated comprehensively as detailed in "Detailed Build Steps - Step 9".
    *   `CONTRIBUTING.md` or main `README.md`: Add a section on running/writing E2E tests, linking to `e2e/README.md`.

## Risk Matrix

| Risk                                                     | Severity | Mitigation                                                                                                                                                                                                |
| :------------------------------------------------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Flaky tests due to timing, animations, or network issues | High     | Use Playwright's auto-waiting mechanisms. Employ robust, user-facing selectors. Implement retries in CI. Mock external dependencies (Formspark). Consider disabling animations in test environment if problematic. |
| CI execution time increases significantly                | Medium   | Optimize test speed. Run tests in parallel (Playwright default). Start with Chromium only in CI. Evaluate if more browsers are critical for every run.                                                     |
| POM maintenance becomes burdensome                       | Medium   | Adhere to SRP for Page Objects. Keep POMs focused. Regular refactoring and code reviews for test code. Document POM best practices in `e2e/README.md`.                                                    |
| Visual regression tests frequently fail due to minor UI changes | Medium   | Set appropriate diff thresholds for `toHaveScreenshot`. Establish a clear process for reviewing and updating baseline snapshots (PRs). Limit snapshots to key, stable pages/components initially. |
| Difficulty debugging CI failures                         | Medium   | Configure Playwright to generate and upload HTML reports and trace files as CI artifacts. Ensure clear logging from `webServer`.                                                                        |
| Initial setup of POM and CI integration underestimated | Low      | Allocate sufficient time. This plan provides detailed steps. Start with the defined scope and iterate.                                                                                                |
| Dependency on AUTO-003 (CI Pipeline Setup)               | Medium   | Clearly define integration points. Coordinate with AUTO-003 task owner. Ensure `webServer` in Playwright config aligns with CI capabilities.                                                        |

## Open Questions
1.  **Formspark URL Constant**: Where is the exact Formspark submission URL defined in the codebase (e.g., `lib/constants.ts`)? This is needed for accurate `page.route()` mocking.
2.  **Browser Scope for CI**: Is Chromium-only sufficient for initial CI E2E runs, or are Firefox/WebKit runs mandatory from the start? (Plan assumes Chromium-only initially for speed, can be expanded).
3.  **Visual Snapshot Update Process**: What is the agreed-upon workflow for reviewing and accepting visual snapshot updates? (Plan assumes PR review for committed snapshot changes).
4.  **Specific Client-Side Validation Details**: Are there specific custom client-side validation messages or behaviors for the CTA form beyond standard browser HTML5 validation that need to be asserted?
```