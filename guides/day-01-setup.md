# Day 1 — Set up Playwright and run your first tests

Goal for today (about 60 minutes): a working Playwright project in this folder, your first passing
API test, and everything pushed to GitHub.

Type every command yourself rather than copy-pasting. Muscle memory is part of the learning.

---

## Step 1 — Open the folder in Terminal and check your tools (5 min)

```bash
cd ~/Documents/LearningRepo
node -v      # needs v20 or newer (v22/v24 LTS is ideal)
npm -v
git --version
```

If `node -v` shows something older than v20, install the LTS version from nodejs.org first.

**What you just learned:** Node.js runs JavaScript/TypeScript outside the browser. npm installs
packages. `npx` runs a package's command without installing it globally.

---

## Step 2 — Install Playwright (10 min)

```bash
npm init playwright@latest
```

Answer the questions like this:

| Question | Answer | Why |
| --- | --- | --- |
| TypeScript or JavaScript? | **TypeScript** | What most senior roles ask for |
| Where to put your end-to-end tests? | **tests** | The default; keep it |
| Add a GitHub Actions workflow? | **Yes** | You will use CI from week 4 |
| Install Playwright browsers? | **Yes** | API tests don't need them, but you will from week 5 |

It found your existing `package.json`, so it adds Playwright to it instead of starting over.

---

## Step 3 — Look at what was created (10 min)

```bash
ls -la
```

| File / folder | What it is |
| --- | --- |
| `package.json` | Your project's name, scripts and dependencies. Open it: `@playwright/test` is now under `devDependencies` |
| `package-lock.json` | Exact versions installed. Commit it; never edit it by hand |
| `node_modules/` | The installed packages. Never commit it (it's in `.gitignore`) |
| `playwright.config.ts` | How tests run: which folder, browsers, retries, reporters |
| `tests/example.spec.ts` | A sample UI test |
| `.github/workflows/playwright.yml` | Runs your tests on GitHub on every push |
| `.gitignore` | Files Git should ignore |

---

## Step 4 — Run the sample tests and open the report (10 min)

```bash
npx playwright test
npx playwright show-report
```

The first command runs every test in `tests/` on Chromium, Firefox and WebKit. That's why you see
6 tests: 2 tests × 3 browsers. The second command opens an HTML report in your browser. Click a
test to see its steps. Press `Ctrl+C` in Terminal to close the report server.

Try these too:

```bash
npx playwright test --project=chromium   # one browser only
npx playwright test --ui                 # UI mode: watch tests run step by step
```

---

## Step 5 — Read `playwright.config.ts` line by line (10 min)

Open it in VS Code (`code .`) and find each of these:

| Setting | What it controls |
| --- | --- |
| `testDir: './tests'` | Where Playwright looks for `*.spec.ts` files |
| `fullyParallel: true` | Tests in the same file can run at the same time |
| `forbidOnly: !!process.env.CI` | Fails CI if you accidentally leave `test.only` in the code |
| `retries: process.env.CI ? 2 : 0` | Retries failures twice on CI, never locally |
| `workers` | How many tests run in parallel |
| `reporter: 'html'` | Produces the report you just opened |
| `use: { trace: 'on-first-retry' }` | Records a trace when a test is retried, for debugging |
| `projects: [...]` | One entry per browser; also used later for an `api` project |

Write down anything you don't understand. That's tomorrow's question list.

---

## Step 6 — Write your first API test (10 min)

Create a new file `tests/api/first-api.spec.ts` and type this in:

```ts
import { test, expect } from '@playwright/test';

test('GET a single product from DummyJSON', async ({ request }) => {
  const response = await request.get('https://dummyjson.com/products/1');

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.id).toBe(1);
  expect(body.title).toBeTruthy();
});
```

Run only this file, on one project:

```bash
npx playwright test tests/api --project=chromium
```

**What each line does:**

- `{ request }` is a Playwright **fixture**: a ready-made HTTP client injected into your test.
- `request.get(url)` sends the HTTP request. `await` waits for the response.
- `response.status()` is the HTTP status code. 200 means OK.
- `response.json()` parses the body into a JavaScript object.
- `expect(...).toBe(...)` is an assertion. If it's false, the test fails.

Now break it on purpose: change `toBe(1)` to `toBe(2)`, run it again and read the error message.
Then fix it. Reading failures well is a core skill.

---

## Step 7 — Add a test script to `package.json` (2 min)

In `package.json`, replace the `"test"` line under `"scripts"` with:

```json
"test": "playwright test",
"test:api": "playwright test tests/api --project=chromium",
"report": "playwright show-report"
```

Now `npm test`, `npm run test:api` and `npm run report` work.

---

## Step 8 — Push to GitHub (10 min)

1. On github.com, click **New repository**. Name it `playwright-learning`, leave it **empty**
   (no README or .gitignore), and create it.
2. In Terminal:

```bash
git init
git status                      # node_modules should NOT be listed
git add .
git commit -m "Day 1: Playwright setup and first API test"
git branch -M main
git remote add origin https://github.com/<your-username>/playwright-learning.git
git push -u origin main
```

3. On GitHub, open the **Actions** tab. The workflow you added in Step 2 runs your tests in the
   cloud. Watch it go green.

---

## Step 9 — Start your learning log (3 min)

Create `LEARNINGS.md` in this folder and add today's line:

```md
# Learnings

- 27 Oct: Set up Playwright. Learned what fixtures are ({ request }), how projects map to browsers,
  and that retries only run on CI. Confused about: ...
```

Commit and push it.

---

## Done when

- [ ] `npx playwright test` passes locally
- [ ] Your API test passes, and you've seen it fail on purpose
- [ ] The repo is on GitHub and the Actions run is green
- [ ] `LEARNINGS.md` has today's entry

**Tomorrow (Wed 28 Oct):** TypeScript for testers — types, interfaces, `async/await`, Promises.
