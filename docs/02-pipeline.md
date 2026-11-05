# The pipeline

A single backlog file is the only list of work. Each item sits in one stage and moves forward one stage at a time:

- Inbox: captured in one line, with who raised it.
- Needs framing: who it is for, what changes for them, how you will know it is done, and what signal will show it worked.
- Ready: a user story with acceptance criteria someone can check (including zero, one and many items, offline, and a long name), a size of S, M or L, and the devil's advocate's review of the plan.
- Building: one pull request per item, under a work-in-progress limit.
- Review: code review always, security review for data paths, and the browser tester always.
- Shipped: merged, recorded with the pull request and the signal to watch.

Moving the item in the same pull request that ships it keeps the file honest.

## Devil's advocate gates

The devil's advocate reviews at two points. Before code starts, for features and non-trivial fixes, it asks whether the assumptions holding up the plan are true, whether this is the thinnest useful slice, and whether the platform already offers a simpler option. Small, reversible work can skip this: copy changes, or a one-file bug fix with a red-first test. Before ship, it reviews every item, however small. Run it as its own agent; a builder reviewing its own plan does not count.

## What ships without the owner

Small, reversible changes (copy, bug fixes, UI work within agreed rules) ship once they pass the checks. Anything that changes a product rule, a privacy rule, the schema, a running cost or a dependency goes to the owner first, as one question with options and a recommendation, not as a line in a status update.

## The evidence block

Each pull request description lists its claims, where each was verified (unit test, local production build, preview, production) and the receipt: a test result, a screenshot name, a query result. Each line is marked MEASURED or INFERENCE. A claim with no receipt is treated as unverified.

## Regular passes

The main session works through the backlog at fixed times, typically twice a day. In the morning it grooms the top items into Ready and starts builds up to the limit. In the evening it merges what passed, checks production and writes a short note of what shipped.

## Cost

Keep the work-in-progress limit low; two or three parallel builds is usually enough, and more tends to hit usage limits and swamp review. Use cheaper models for simple reviews and small builds and the strongest model for architecture, security and risky changes. Ask one agent per question rather than a panel.
