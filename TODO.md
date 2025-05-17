# Todo

## E2E Testing Setup (TEST-002)
- [x] **T001 · Chore · P1: install playwright and browser binaries**
    - **Context:** Detailed Build Steps - Step 1
    - **Action:**
        1. Add Playwright as a development dependency: `pnpm add -D @playwright/test`.
        2. Run `pnpm playwright install --with-deps` to install necessary browser binaries and OS dependencies.
    - **Done‑when:**
        1. `@playwright/test` is listed in `devDependencies` in `package.json`.
        2. Playwright browser binaries are installed and accessible.
    - **Verification:**
        1. Run `pnpm exec playwright --version` and confirm it outputs the Playwright version.
    - **Depends‑on:** none

- [x] **T002 · Chore · P1: configure playwright (`playwright.config.ts`)**
    - **Context:** Detailed Build Steps - Step 2
    - **Action:**
        1. Create/update `playwright.config.ts` at the project root.
        2. Configure `testDir: './e2e/tests'`, `baseURL` (e.g., `'http://localhost:3000'`), `webServer` to start the Next.js dev server, browser projects (starting with `chromium`), reporters (`list`, `html`), `trace: 'on-first-retry'`, `retries: process.env.CI ? 2 : 0`, and `screenshot: 'only-on-failure'`.
    - **Done‑when:**
        1. `playwright.config.ts` exists with all specified configurations.
        2. Running Playwright tests (once available) correctly uses these settings (e.g., starts the web server, generates reports).
    - **Verification:**
        1. Once a basic test exists (e.g., T006), run `pnpm e2e` (from T010) and verify the `webServer` starts, tests run against the correct `baseURL`, and reports are generated in `playwright-report/`.
    - **Depends‑on:** [T001]

- [x] **T003 · Chore · P1: establish e2e directory structure**
    - **Context:** Detailed Build Steps - Step 3; Architecture Blueprint - Modules / Packages
    - **Action:**
        1. Create `e2e/` directory at the project root.
        2. Create `e2e/page-objects/` directory.
        3. Create `e2e/tests/` directory.
    - **Done‑when:**
        1. The directories `e2e/`, `e2e/page-objects/`, and `e2e/tests/` exist.
    - **Verification:**
        1. Confirm the directory structure `e2e/page-objects/` and `e2e/tests/` is present in the project.
    - **Depends‑on:** none

- [x] **T004 · Feature · P1: implement `SplashPage.pom.ts`**
    - **Context:** Detailed Build Steps - Step 4; Architecture Blueprint - Public Interfaces / Contracts (`SplashPage.pom.ts`)
    - **Action:**
        1. Create `e2e/page-objects/SplashPage.pom.ts`.
        2. Define selectors for main headline, CTA section wrapper, and footer using user-facing selectors (roles, text, `data-testid`).
        3. Implement `constructor(page: Page)`, `async navigate()`, `async getHeadline()`, `async isCtaSectionVisible()`, `async isFooterVisible()` methods with TSDoc.
    - **Done‑when:**
        1. `SplashPage.pom.ts` is implemented as specified, adheres to project coding standards, and type-checks.
        2. Methods are usable in test specifications.
    - **Depends‑on:** [T003]

- [ ] **T005 · Feature · P1: implement `CtaForm.pom.ts`**
    - **Context:** Detailed Build Steps - Step 4; Architecture Blueprint - Public Interfaces / Contracts (`CtaForm.pom.ts`)
    - **Action:**
        1. Create `e2e/page-objects/CtaForm.pom.ts`.
        2. Define selectors for email input, submit button, and status message areas (success/error).
        3. Implement `constructor(page: Page)`, `async fillEmail(email: string)`, `async submit()`, `async getSuccessMessage()`, `async getClientSideErrorMessage()` methods with TSDoc.
    - **Done‑when:**
        1. `CtaForm.pom.ts` is implemented as specified, adheres to project coding standards, and type-checks.
        2. Methods are usable in test specifications.
    - **Depends‑on:** [T003]

- [ ] **T006 · Test · P1: implement splash page load and visual regression test**
    - **Context:** Detailed Build Steps - Step 5 (`e2e/tests/splash-page-load.spec.ts`)
    - **Action:**
        1. Create `e2e/tests/splash-page-load.spec.ts` and import `SplashPage` POM.
        2. Implement tests to: navigate to base URL, assert main headline is visible and contains expected text, assert CTA form section and footer are visible.
        3. Add a basic visual regression test: `await expect(page).toHaveScreenshot('splash-page-stable.png');`.
    - **Done‑when:**
        1. Tests in `splash-page-load.spec.ts` pass, verifying page elements, content, and visual consistency.
        2. A baseline visual snapshot (`splash-page-stable.png`) is generated and committed.
    - **Verification:**
        1. Run `pnpm e2e:update-snapshots` (from T010) for `splash-page-load.spec.ts` to generate the baseline snapshot.
        2. Run `pnpm e2e` for `splash-page-load.spec.ts`; verify tests pass against the baseline.
        3. Intentionally change a UI element and verify the visual test fails.
    - **Depends‑on:** [T002, T004]

- [ ] **T007 · Test · P1: implement cta flow happy path test**
    - **Context:** Detailed Build Steps - Step 6 (`e2e/tests/cta-flow.spec.ts` - Happy Path)
    - **Action:**
        1. Create/update `e2e/tests/cta-flow.spec.ts`; import `SplashPage` and `CtaForm` POMs.
        2. Use `page.route()` to mock the Formspark API for a successful response (e.g., `status: 200, body: JSON.stringify({ success: true })`).
        3. Implement a test to: navigate, fill in a valid email, submit, and assert that a success message is displayed.
    - **Done‑when:**
        1. The happy path test for CTA flow passes, correctly mocking the API and verifying the success UI.
    - **Verification:**
        1. Run the specific test and verify it passes.
        2. Check Playwright trace to confirm Formspark API was mocked and returned a success.
    - **Depends‑on:** [T002, T004, T005]

- [ ] **T008 · Test · P1: implement cta flow client-side invalid email test**
    - **Context:** Detailed Build Steps - Step 6 (`e2e/tests/cta-flow.spec.ts` - Client-Side Invalid Email)
    - **Action:**
        1. Update `e2e/tests/cta-flow.spec.ts`.
        2. Implement a test to: navigate, fill in an invalid email (e.g., "test@invalid"), click submit.
        3. Assert that an appropriate client-side validation message is displayed or that form submission is prevented by browser validation.
    - **Done‑when:**
        1. The client-side invalid email test passes, verifying the validation UI or behavior.
    - **Verification:**
        1. Run the specific test and verify it passes.
        2. Manually attempt to submit an invalid email in the browser to confirm behavior.
    - **Depends‑on:** [T002, T004, T005]

- [ ] **T009 · Test · P1: implement cta flow mocked server error test**
    - **Context:** Detailed Build Steps - Step 6 (`e2e/tests/cta-flow.spec.ts` - Mocked Server Error)
    - **Action:**
        1. Update `e2e/tests/cta-flow.spec.ts`.
        2. Use `page.route()` to mock the Formspark API for a server error response (e.g., `status: 400, body: JSON.stringify({ error: "Submission failed" })`).
        3. Implement a test to: navigate, fill valid email, submit, and assert that an error message reflecting the server issue is displayed.
    - **Done‑when:**
        1. The mocked server error test passes, correctly mocking the API and verifying the error UI.
    - **Verification:**
        1. Run the specific test and verify it passes.
        2. Check Playwright trace to confirm Formspark API was mocked and returned an error.
    - **Depends‑on:** [T002, T004, T005]

- [ ] **T010 · Chore · P1: add e2e scripts to `package.json`**
    - **Context:** Detailed Build Steps - Step 7
    - **Action:**
        1. Add/ensure `pnpm e2e` script: `"e2e": "playwright test"`.
        2. Add `pnpm e2e:report` script: `"e2e:report": "playwright show-report playwright-report"`.
        3. Add `pnpm e2e:update-snapshots` script: `"e2e:update-snapshots": "playwright test --update-snapshots"`.
    - **Done‑when:**
        1. All three scripts are present in `package.json` and execute the correct Playwright commands.
    - **Verification:**
        1. Run `pnpm e2e`, `pnpm e2e:report`, and `pnpm e2e:update-snapshots` locally and confirm they trigger the expected Playwright actions.
    - **Depends‑on:** [T002]

- [ ] **T011 · Feature · P1: integrate e2e tests into ci workflow**
    - **Context:** Detailed Build Steps - Step 8
    - **Action:**
        1. Modify the existing CI workflow (e.g., `.github/workflows/test-coverage.yml` or a dedicated E2E workflow).
        2. Add job/steps for E2E tests: checkout code, set up Node.js and pnpm, install dependencies (`pnpm install`), install Playwright browsers (`pnpm playwright install --with-deps`), run E2E tests (`pnpm e2e`).
        3. Ensure the workflow step fails if `pnpm e2e` exits with a non-zero code.
        4. Upload Playwright HTML report and failure artifacts (traces, screenshots, diffs) as specified in the plan.
    - **Done‑when:**
        1. CI workflow executes E2E tests on relevant triggers (e.g., PRs).
        2. Test failures in CI cause the build/check to fail.
        3. HTML reports and failure artifacts are correctly uploaded to CI.
    - **Verification:**
        1. Trigger a CI run (e.g., by opening a PR with these changes).
        2. Observe E2E tests execute in the CI logs.
        3. If tests pass, confirm no failure artifacts are uploaded (other than the report).
        4. If tests fail (or a test is made to fail temporarily), confirm failure artifacts and the report are uploaded and accessible.
    - **Depends‑on:** [T002, T010, AUTO-003]

- [ ] **T012 · Chore · P2: create/update `e2e/README.md` with comprehensive documentation**
    - **Context:** Detailed Build Steps - Step 1 (contributor docs), Step 9
    - **Action:**
        1. Create/Update `e2e/README.md`.
        2. Include: overview of E2E setup and POM pattern; instructions on `pnpm playwright install --with-deps` for contributors; instructions on running tests locally (`pnpm e2e`, `pnpm e2e:report`, `pnpm e2e:update-snapshots`); explanation of directory structure and adding new tests/POMs; guidance on preferred selectors; debugging tips (Inspector, trace viewer, HTML report); process for updating visual snapshots.
    - **Done‑when:**
        1. `e2e/README.md` is comprehensive and provides clear guidance for developers working with E2E tests.
    - **Verification:**
        1. Have a team member (ideally less familiar with this E2E setup) attempt to follow the `e2e/README.md` to understand the setup and run a test locally.
    - **Depends‑on:** [T001, T003, T004, T005, T006, T010]

- [ ] **T013 · Chore · P2: update main project documentation to reference e2e testing**
    - **Context:** Detailed Build Steps - Step 9
    - **Action:**
        1. Update the main `README.md` or `CONTRIBUTING.md`.
        2. Add a section on E2E testing practices and link to the detailed `e2e/README.md`.
    - **Done‑when:**
        1. The main project documentation includes a reference to the E2E testing setup and practices.
    - **Verification:**
        1. Check the main `README.md` or `CONTRIBUTING.md` for the new section and ensure the link to `e2e/README.md` is correct.
    - **Depends‑on:** [T012]

### Clarifications & Assumptions
- [ ] **Issue:** Exact Formspark submission