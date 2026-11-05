# The browser tester

A separate Claude Code session whose only job is to use the app like a real person, against the preview deploy, and report PASS or FAIL per step with evidence.

## Why a separate session

- It doesn't share the builder's assumptions or context.
- It can run while builders keep working.
- The main session sends it a brief and gets a report back.

## What it needs

| Need | How |
|---|---|
| A browser | Headless Chromium through Playwright |
| Pretend users | One test account per role (for example a coach and a parent), on a test team or workspace that holds only fake data. Fake names start with a marker like `T-` so they're easy to find and safe to delete |
| Passwords | Stored in the environment's secrets, read from an environment variable. Never in the repo or the chat |
| Phone sizes | 375x667 and 390x844 at least. Add short heights (375x548) if you have anything fixed to the bottom of the screen |
| Fakes | Fake "opened from the home screen" (display-mode standalone) and a fake microphone, where your app needs them |
| Database access | Read queries to confirm what was written; writes only to test data |

## A good brief

- What changed, in one paragraph.
- Numbered steps, each with what "pass" looks like.
- The degenerate cases: zero items, one item, a long name, a second role, an admin view.
- "Check the database after": which rows, what counts.
- "Clean up what you create, and confirm the counts."
- "No code edits, pushes or comments."

## A good report

PASS or FAIL per step, the numbers measured, screenshot names, and anything it couldn't check with the reason ("WebKit isn't installed, so iOS Safari is untested").

## Rules that saved us

- **Measure the thing that matters, not a proxy.** "The page doesn't scroll" is not the same as "every player is visible". Check bounding boxes against the area they must sit in.
- **A redirect can come back as HTTP 200** if the page started streaming first. To prove someone is blocked, check that the protected content is absent and that the browser ended up on the right URL.
- **Test data left behind can block the next run.** Clean up in the same session, and prefer a scheduled sweep of test-only rows over manual deletes.
