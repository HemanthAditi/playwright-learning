# Playwright Learning Log

## 27/10/2026 (Week 1, Day 1): Setup, first API test, CI

### Project setup
- `npm init playwright@latest` adds Playwright to an existing `package.json` (chose TypeScript, `tests` folder, GitHub Actions, browsers).
- `package.json` lists dependencies and scripts; `@playwright/test` is a devDependency.
- `package-lock.json` pins exact versions. Commit it, never edit it by hand.
- `node_modules/` holds installed packages. Never commit it (it's in `.gitignore`).
- Test files live in `tests/` and are named `*.spec.ts` so Playwright finds them.

### Useful commands
- `npx playwright test`: run all tests (on every browser project).
- `npx playwright test tests/api --project=chromium`: run one folder on one project.
- `npx playwright test --ui`: UI mode, watch tests step by step.
- `npx playwright show-report`: open the HTML report (`Ctrl+C` to stop it).
- Failure details are saved in `test-results/<test-name>/error-context.md`.

### playwright.config.ts
- `testDir`: where tests are found.
- `fullyParallel` / `workers`: how many tests run at once.
- `retries: process.env.CI ? 2 : 0`: retries only on CI.
- `forbidOnly`: CI fails if a `test.only` is left in the code.
- `reporter: 'html'`: produces the HTML report.
- `trace: 'on-first-retry'`: records a trace when a test is retried.
- `projects`: one entry per browser (chromium, firefox, webkit). 2 tests x 3 browsers = 6 runs.

### GitHub Actions (`.github/workflows/playwright.yml`)
- `on:` runs on push and pull requests to `main`/`master`.
- `runs-on: ubuntu-latest`: a fresh Linux machine every run; deleted afterwards.
- Steps: checkout code -> setup Node -> `npm ci` -> install browsers -> run tests -> upload report.
- `uses:` = a ready-made reusable step; `run:` = a terminal command.
- `npm ci` installs exactly what's in `package-lock.json` (stricter than `npm install`).
- `if: ${{ !cancelled() }}` uploads the report even when tests fail.
- The report is an artifact: Actions -> run -> Artifacts -> download.
- GitHub sets `CI=true`, which switches on the retries and `forbidOnly` settings.
- YAML depends on indentation: spaces only, never tabs.

### Anatomy of an API test
- `import { test, expect } from '@playwright/test'`: always `@playwright/test`, not `playwright/test`.
- `test('title', async ({ request }) => { ... })`: registers a test; the body runs between `{ }`.
- `async` allows `await` inside the function.
- `({ request })` is destructuring: pick the `request` fixture from what Playwright provides.
- Fixture = something Playwright prepares before the test and cleans up after it.
- `request` = `APIRequestContext`, an HTTP client. Each test gets its own fresh one.
- `const response = await request.get(url)`: sends a GET; `await` waits for the response.
- `request.get` does NOT throw on 404/500. Checking the status is my job.
- `response.status()`: the status code (no `await`, already available).
- `await response.json()`: parses the JSON body into an object (needs `await`).
- `body` is typed `any`, so typos like `body.titel` aren't caught (zod fixes this in week 2).

### Assertions
- `expect(value).toBe(x)`: strict equality (`Object.is`, like `===`); `200` is not `"200"`.
- `toBeTruthy()`: passes unless `undefined`, `null`, `""`, `0`, `false`, `NaN`.
- `toContain('text')`: a string includes some text (less brittle than an exact match).
- `toBeGreaterThan(0)`: numeric comparison.
- `expect(response).toBeOK()`: passes for any 2xx and prints the body when it fails.
- When an assertion fails, the test stops; the lines after it never run.
- Check the status first so failures are clear.
- Strict checks (exact title) catch more bugs but break more often than loose checks (title exists).

### HTTP status codes
- 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error.

### Errors I hit and what they mean
- Removed `await` from `request.get`:
  - `TypeError: response.status is not a function`: `response` was a Promise, not a response.
  - `Request context disposed`: the request was still in flight when the test ended and Playwright closed the client.
  - Rule: network/browser calls return Promises and need `await`. "Disposed", "Target closed" and "Page closed" errors usually mean a missing `await`.
  - When there are several errors, fix the earliest one first.
- `/products/99999` gave `Expected: 200, Received: 404`: the product doesn't exist. The server was right; my expectation was wrong.
  - Turned it into a negative test: expect 404 and check `body.message` contains "not found".

### Still to practise / questions
- Exercises 3 (`price > 0`) and 4 (`toBeOK()` on a 404).
- 
