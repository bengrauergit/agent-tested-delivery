# The pipeline

One backlog file is the only view of work. Every item sits in exactly one stage and moves one stage at a time.

| Stage | What it means | Leaves when |
|---|---|---|
| Inbox | Captured in one line, with who raised it and when | The product owner's assistant has read it |
| Needs framing | Outcome written: who it's for, what changes for them, the done-signal, and the signal that it worked | Outcome and measure exist |
| Ready | A user story with checkable acceptance criteria (empty, one, zero, offline, long name), sized S/M/L, and gated by the devil's advocate | Gate passed and a builder is free |
| Building | One pull request per item. A WIP limit (2 or 3) keeps cost and review load sane | PR open with an evidence block |
| Review | Code review always; security review for data paths; browser tester always | All pass and checks are green |
| Shipped | Merged, recorded with the PR number and the signal to watch | The signal is read at the next pass |

## Two gates by the devil's advocate

1. **Before code**, for features and non-trivial fixes: are the load-bearing assumptions true, is this the thinnest slice, is there a simpler native option? Skippable for small, reversible work (copy, a one-file bug fix with a red-first test).
2. **Before ship**, for everything, however small.

## What ships without asking the owner

Small, reversible changes (copy, bug fixes, UI within agreed rules) ship once they pass the gates.

Anything that changes a product rule, a privacy rule, the database schema, a cost or a dependency goes to the owner first, as one question with options and a recommendation. Not as prose buried in a status update.

## The evidence block

Every PR body carries a table: the claim, where it was verified (unit test, local production build, preview, production), and the receipt (a test count, a screenshot, a database query result). Each line is labelled MEASURED or INFERENCE. "It works" without a receipt doesn't count.

## Scheduled passes

Two a day, run by the main session:
- **Morning:** groom the top items into Ready, start builds up to the WIP limit.
- **Evening:** merge what passed, check production, write a short ship report.

## Cost control

- A WIP limit. Running six builders at once hit the plan's usage limit; two or three is the sweet spot.
- Cheaper models for simple reviews and small builds; the strongest model for architecture, security and anything risky.
- One agent per question. Don't send a panel when one lens will do.
