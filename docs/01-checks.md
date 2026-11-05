# The checks

Each check catches a kind of mistake the others tend to miss. A layout fault can pass unit tests, the build and code review, and only show up when a browser measures where things land. A bad access rule can look correct in the diff and only fail when someone queries as the wrong role. That is the case for running all of them on every change rather than picking the cheapest.

## 1. Unit tests

A unit test asks one question of one piece of code, for example: "with one failed order and nothing else pending, does the summary show a retry button?"

Write the test first and run it against the old code to watch it fail, then change the code until it passes. A test that has never failed may not be testing anything (see [05-red-first.md](05-red-first.md)). Cover the dull cases on purpose: zero items, one item, a very long name, offline, missing fields. Keeping logic in small pure functions makes it testable without a browser, which keeps the suite fast enough to run on every change.

## 2. Type check and build

Run the type checker and your framework's production build before anyone reviews the change. This catches parts that no longer fit together, and anything that only breaks in the production bundle.

## 3. Preview deploy

Each pull request gets its own private deployment and URL, using your hosting provider's preview deploys. It runs on the same kind of server as production and talks to a real backend, so the browser tester exercises something close to what users will get, rather than a build on the builder's machine. Point it at a database or schema that holds test data only, or limit the test accounts to a test workspace.

## 4. Browser tester

A separate agent session drives a headless browser (Playwright) against the preview. It signs in as each test role, sets phone and desktop viewport sizes, works through the real flow, takes screenshots, and then queries the database to confirm the right rows were written and nothing else. It removes what it created. See [03-browser-tester.md](03-browser-tester.md).

## 5. Reviewers

The reviewers are separate agents from the builder, so no one approves their own work.

The code reviewer reads every diff for correctness and fit with the codebase, and checks each "unchanged" claim in the pull request. The security reviewer runs on any change touching auth, access rules or data paths, and tests the real policies by querying as each role. The devil's advocate looks for the assumption the change depends on and tries to disprove it: before code starts on significant work, and again before anything ships.

## After merge

The main session checks production errors for the changed area after each merge. Once a day it reads the failure counts for the flows that matter most to you (failed payments, failed uploads, abandoned checkouts). If real use shows a fault, it goes back to the owner with a fix plan.
