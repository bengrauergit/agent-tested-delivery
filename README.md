# Agent-tested delivery

A playbook for shipping a real web app where **AI agents build, test and review every change, and the product owner never taps through the app to test it.**

It came out of running a live mobile web app (Next.js, Supabase, Vercel) with Claude Code agents. On one day in November 2026 this setup shipped 7 pull requests, ran 1,066 automated tests per change, and caught a layout bug that every other check had passed. The owner made decisions; the agents did the building and the testing.

Everything here is generic. Swap in your own stack.

## The idea in one picture

Think of a toy factory. One robot builds the toy. Five different checkers look at it before it goes on the shelf.

| # | Checker | What it is | What it catches |
|---|---|---|---|
| 1 | Unit tests | Small scripts that poke one piece of code each, written red first | "This function gives the wrong answer" |
| 2 | Type check and build | The compiler reads everything, then builds it like production | "These parts don't fit together" |
| 3 | Preview deploy | A full private copy of the app for every pull request | "It works on a real server, not just on the builder's machine" |
| 4 | Browser tester | A separate agent session that drives headless Chrome as pretend users | "When you actually tap through it, this breaks" |
| 5 | Reviewers | A code reviewer, a security reviewer, and a devil's advocate | "This is wrong, risky, or leaks private data" |

Nothing merges unless all five say yes. After it merges, the main session checks production errors.

## What's in this repo

| Path | What it gives you |
|---|---|
| [docs/01-the-five-checkers.md](docs/01-the-five-checkers.md) | Each checker in detail, and why each one exists |
| [docs/02-pipeline.md](docs/02-pipeline.md) | The backlog stages, the review gates, and what ships without asking the owner |
| [docs/03-browser-tester.md](docs/03-browser-tester.md) | How the browser tester session works: test accounts, phone sizes, fakes, cleanup |
| [docs/04-event-golden.md](docs/04-event-golden.md) | Proving a redesign changed nothing underneath: record events on old and new, diff them |
| [docs/05-red-first.md](docs/05-red-first.md) | Why every fix ships with a test that failed first |
| [docs/06-what-robots-cant-test.md](docs/06-what-robots-cant-test.md) | The honest gaps, and how to watch for them after release |
| [docs/07-lessons.md](docs/07-lessons.md) | Real misses and how the setup caught them |
| [agents/](agents/) | Agent definitions you can drop into `.claude/agents/` |
| [templates/CLAUDE.md](templates/CLAUDE.md) | The always-loaded rules that make agents follow the process |
| [templates/BACKLOG.md](templates/BACKLOG.md) | A backlog file with the pipeline header |
| [examples/playwright/](examples/playwright/) | Check scripts: an event golden, a layout check, an access check |

## Quick start

1. Copy `agents/*.md` into your project's `.claude/agents/`.
2. Copy `templates/CLAUDE.md` into your project root and fill in the bracketed parts.
3. Copy `templates/BACKLOG.md` to `BACKLOG.md`.
4. Create **test accounts** in your app (one per role) and a **test team or workspace** that holds only fake data. Put their passwords in your environment's secrets, never in the repo.
5. Turn on preview deploys for pull requests (Vercel, Netlify, Render or similar).
6. Start a second Claude Code session as the **browser tester** (see docs/03). The main session sends it test briefs and it reports back.
7. Ask the main session to build something. Watch it go through the gates.

## Roles

| Role | Job | Writes code? |
|---|---|---|
| Main session (product owner's assistant) | Orders the backlog, briefs agents, merges, checks production | Small fixes only |
| Builder | Builds one slice per pull request, with an evidence block | Yes |
| Business analyst | Turns an idea into user stories with checkable acceptance criteria | No |
| Devil's advocate | Tries to prove the plan or the change wrong, before code and before ship | No |
| Code reviewer | Independent review of the diff: correctness, quality, conventions | No |
| Security reviewer | Tries the data paths as each kind of user | No |
| Browser tester | Drives the preview as real roles, checks the database after | No |

## What the owner still does

Decides. Anything that changes a product rule, a privacy rule, the schema, a cost or a dependency comes to the owner as a short question with options and a recommendation. Everything small and reversible ships on its own once it passes the gates.

## Licence

MIT. Use it, change it, share it.
