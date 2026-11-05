# The checks

Each check catches a kind of mistake the others tend to miss. A layout fault can pass unit tests, the build and code review, and only show up when a browser measures where things land. A bad access rule can look correct in the diff and only fail when someone queries as the wrong role. That is the case for running several kinds of check rather than picking the cheapest.

Checks 1 to 3, and the committed Playwright specs from check 4, should be required CI status checks under branch protection. The agent verdicts are advisory: they inform the merge but do not block it mechanically (see [06-limits.md](06-limits.md)).

## 1. Unit tests

A unit test asks one question of one piece of code, for example: "with one failed order and nothing else pending, does the summary show a retry button?"

Write the test first and run it against the old code to watch it fail, then change the code until it passes (see [05-red-first.md](05-red-first.md)). Cover the degenerate cases listed in [03-browser-tester.md](03-browser-tester.md) where they apply. Keeping logic in small pure functions makes it testable without a browser, which keeps the suite fast enough to run on every change.

## 2. Type check and build

Run the type checker and your framework's production build before anyone reviews the change. This catches parts that no longer fit together, and anything that only breaks in the production bundle.

## 3. Preview deploy

Each pull request gets its own private deployment and URL, using your hosting provider's preview deploys. It runs on the same kind of server as production, so the browser tester exercises something close to what users will get. Point it at a database or schema that holds test data only, or limit the test accounts to a test workspace.

## 4. Browser tester

Two parts. Playwright specs committed to the repo run in CI against the preview on every pull request; these are the mechanical part. A separate agent session also drives a headless browser through the changed flow as each test role, tries the cases the specs do not cover yet, and queries the database to confirm what was written. When it finds something worth keeping, it becomes a spec. See [03-browser-tester.md](03-browser-tester.md).

## 5. Reviewers

The reviewers are separate agents from the builder, so no one approves their own work, though they share the builder's model and its blind spots.

The code reviewer reads every diff for correctness and fit with the codebase. The security reviewer runs on any change touching auth, access rules or data paths, and tests the real policies by querying as each role. The devil's advocate tries to disprove the assumptions a change depends on; how much of it a change gets depends on its risk (see [02-pipeline.md](02-pipeline.md)).

## After merge

The main session checks production errors for the changed area after each merge, and on a regular cadence reads the failure counts for the flows that matter most to you (failed payments, failed uploads, abandoned checkouts). If real use shows a fault, it goes back to the owner with a fix plan.
