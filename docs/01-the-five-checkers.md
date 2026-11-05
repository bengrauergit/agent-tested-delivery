# The five checkers

Each checker catches a different kind of mistake. None of them is enough alone. On one day, a layout bug passed checkers 1 to 4 and was caught by checker 5. A different bug passed the reviewers and was caught by the browser tester. That's why there are five.

## 1. Unit tests: small quizzes

A unit test asks one question about one piece of code. For example: "if a draft failed and nothing else is waiting, does the home screen show 'Fix draft'?"

Rules:
- **Red first.** Write the test, run it on the old code, and watch it fail. Then fix the code until it passes. A test that never failed proves nothing. See [05-red-first.md](05-red-first.md).
- Cover the boring edge cases on purpose: zero items, one item, a very long name, offline, missing data.
- Keep logic in small pure functions so it can be tested without a browser.

Tool: Vitest (any fast runner works). A full run of about 1,000 tests takes about a minute.

## 2. Type check and build: the parts must fit

`tsc --noEmit` checks that every piece of code fits together. `next build` (or your framework's build) builds the app exactly as production will. Both run before anyone looks at the change.

## 3. Preview deploy: a real copy

Every pull request gets its own private deployment with its own URL. It talks to the real backend, so it behaves like production, but no real user ever sees it. The browser tester runs against this, not against a laptop.

## 4. Browser tester: a robot with fingers

A separate agent session drives a headless browser (Playwright) against the preview. It signs in as pretend users, sets phone screen sizes, taps through the real flow, takes screenshots, then checks the database to confirm exactly the right rows were written. It cleans up after itself. Details in [03-browser-tester.md](03-browser-tester.md).

## 5. Reviewers: three different lenses

| Reviewer | Question | When |
|---|---|---|
| Code reviewer | Is the diff correct, tidy and consistent with the codebase? | Every PR |
| Security reviewer | Can the wrong person see or change data? Tries it as each role, against the real policies. | Any PR touching auth, access rules or data paths |
| Devil's advocate | What would make this wrong? Tests the load-bearing assumptions with evidence. | Before code starts (for significant work) and before every ship |

The reviewers are separate agents from the builder, so nobody marks their own homework.

## After merge

The main session checks the production error log for the changed area, and once a day checks the failure counters that matter (failed uploads, failed recordings, recovered data). If real use shows a fault, it goes back to the owner with a fix plan.
