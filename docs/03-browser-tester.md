# The browser tester

The browser tester is a separate Claude Code session whose only job is to use the app the way a person would, against the preview deploy, and report PASS or FAIL for each step with evidence. Keeping it separate means it does not inherit the builder's assumptions, it can run while builds continue, and the main session can send it a brief and read a report without mixing the two contexts.

## What it needs

- Playwright with headless Chromium (add WebKit if you can; see [06-limits.md](06-limits.md)).
- One test account per role, for example a manager and a member, in a test workspace that holds only fake data. Give fake records an obvious marker, such as a `test-` prefix, so they are easy to find and safe to delete.
- Passwords in the environment's secret store, read from environment variables. Never in the repo or the conversation.
- Viewport sizes covering the devices you support. For phones, test at least 375x667 and 390x844, and add a short height such as 375x548 if anything is fixed to the bottom of the screen.
- Fakes for what the browser cannot provide, such as an installed-app display mode or a fake camera or microphone, if your app uses them.
- Database access: reads to confirm what was written, writes limited to test data.

## Writing a brief

A useful brief says what changed in a paragraph, then gives numbered steps, each with what a pass looks like. It names the degenerate cases to try: an empty list, a single item, a long name, a second role, an admin view. It says which rows to check in the database afterwards and what counts to expect, asks the tester to clean up and confirm the counts, and states that it must not edit code, push or comment.

## The report

PASS or FAIL per step, the numbers measured, screenshot names, and anything it could not check with the reason (for example, "WebKit not installed, so Safari is untested").

## Points to hold to

Measure the thing that matters rather than a proxy for it. "The page does not scroll" is not the same as "every item in the list is visible"; compare each element's position with the area it must sit in.

An HTTP 200 does not prove access was allowed or denied. A page that starts streaming before it redirects can return 200 and still send the user away. To show someone is blocked, check that the protected content is absent and that the final URL is where it should be.

Leftover test data can break the next run, for instance when the app refuses to start a new record because an old one still looks open. Clean up in the same session, and add a scheduled sweep of rows carrying the test marker.
