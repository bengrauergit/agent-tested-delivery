# The browser tester

The browser tester is a separate Claude Code session whose only job is to use the app the way a person would, against the preview deploy, and report PASS or FAIL for each step with evidence. Keeping it separate means it does not inherit the builder's working assumptions, it can run while builds continue, and the main session can send it a brief and read a report without mixing the two contexts.

Its work sits next to the committed Playwright specs in CI, not in place of them. The specs are the repeatable, required check; the session explores the changed flow and the cases the specs do not cover yet. When it finds a fault worth guarding against, turn that into a spec.

## What it needs

- Playwright with headless Chromium (add WebKit if you can; see [06-limits.md](06-limits.md)).
- One test account per role, for example a manager and a member, in a test workspace that holds only fake data. Give fake records an obvious marker, such as a `test-` prefix, so they are easy to find and clean up.
- Passwords in a local env file that is never committed, or in the CI secret store. Never on the command line, in the repo or in the conversation.
- A database credential that can read what it needs and write only test data. An instruction to stay within test data is not enough on its own.
- Viewport sizes covering the devices you support. For phones, test at least 375x667 and 390x844, and add a short height such as 375x548 if anything is fixed to the bottom of the screen.

## Degenerate cases

This is the reference list the other docs, the business analyst and the templates point to. Pick the ones that apply to the change:

- an empty list, a single item, and many items;
- a very long name or value;
- offline, and a slow network;
- double taps and repeated submits;
- a reload part way through a flow;
- arriving by direct link and by in-app navigation;
- a second role, and an admin view;
- the narrowest and shortest supported screen.

## Writing a brief

A useful brief says what changed in a paragraph, then gives numbered steps, each with what a pass looks like. It names the degenerate cases to try, says which rows to check in the database afterwards and what counts to expect, asks the tester to clean up and confirm the counts, and states that it must not edit code, push or comment.

## The report

PASS or FAIL per step, the numbers measured, screenshot names, and anything it could not check with the reason (for example, "WebKit not installed, so Safari is untested"). Expect some flakiness in browser runs: retry a failure once with a trace before reporting it, and report a test that passes only on retry as flaky rather than as a pass.

## Points to hold to

Measure the thing that matters rather than a proxy for it. "The page does not scroll" is not the same as "every item in the list is visible"; compare each element's position with the area it must sit in.

In some server-rendering frameworks, a page that starts streaming before it redirects returns HTTP 200 even though the user is sent away. Whatever your framework, judge access by whether the protected content appears and where the browser ends up, and treat that as a UI check only. The authorisation test is a request to the data layer as the wrong role.

Leftover test data can break the next run. Clean up in the same session, and add a scheduled sweep of rows carrying the test marker.
