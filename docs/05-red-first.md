# Red first

Every bug fix ships with a test that **failed before the fix and passes after**. Every feature's acceptance criteria become tests in the same pull request.

## Why

- A test you never saw fail might not be testing anything.
- The failing run is the proof the bug was real and is now gone.
- The test stays as the contract, so the bug can't come back silently.

## How the builder shows it

In the PR's evidence block: "red first: 9 of 11 failing on main, 11 of 11 passing on the branch", with the test file named. Reviewers treat a missing red-first test as an incomplete PR.

## When you can't

Some things have no unit seam (a layout, a real-device behaviour). Then the red-first check is a browser script that fails on the old build, for example "the first bench player is cut off: scrollLeft 80". Say so in the PR.
