# The pipeline

A single backlog file is the only list of work. Each item sits in one stage and moves forward one stage at a time:

- Inbox: captured in one line, with who raised it.
- Needs framing: who it is for, what changes for them, how you will know it is done, and what signal will show it worked.
- Ready: a user story with acceptance criteria someone can check, including the relevant degenerate cases from [03-browser-tester.md](03-browser-tester.md), and a size of S, M or L.
- Building: one pull request per item, under a work-in-progress limit.
- Review: required CI checks, then the reviews the change's risk calls for.
- Shipped: merged, recorded with the pull request and the signal to watch.

Moving the item in the same pull request that ships it keeps the file honest.

## Review in proportion to risk

Every review costs tokens and time, so match it to what could go wrong.

- Copy changes and cosmetic UI: required CI checks and the code reviewer. The devil's advocate can be skipped or kept to a short pass.
- Bug fixes and ordinary features: add the browser tester on the changed flow, and a devil's advocate pass before ship.
- Anything touching data, access rules, auth, payments or the schema: all of the above, plus the security reviewer, plus a devil's advocate review of the plan before code starts. Not skippable.

When the devil's advocate runs, run it as its own agent; a builder reviewing its own plan does not count. Ask one agent per question rather than convening a panel.

## What ships without the owner

Small, reversible changes (copy, bug fixes, UI work within agreed rules) ship once the required checks pass and the reviews above agree. Anything that changes a product rule, a privacy rule, the schema, a running cost or a dependency goes to the owner first, as one question with options and a recommendation, not as a line in a status update.

## Evidence in the pull request

Each pull request description lists its claims, where each was checked (unit test, local production build, preview, production) and the evidence: a test result, a screenshot name, a query result. Each claim is marked verified or assumed. Anything not tested is listed as untested.

## Cadence

The main session works through the backlog on a regular cadence: groom the top items into Ready and start builds up to the limit, then later merge what passed, check production and note what shipped. How often depends on how much work is in flight.

## Cost and models

Keep the work-in-progress limit low; two or three parallel builds is usually enough, and more tends to hit usage limits and swamp review. Choose models by stakes: the strongest model for architecture, security review and the devil's advocate on risky changes; a mid-tier model for building ordinary slices, code review and browser testing; a small model for well-scoped chores. The agent files in `agents/` carry a `model:` hint you can change. Using a different model, or a different vendor's model, for at least one reviewer reduces correlated mistakes.
