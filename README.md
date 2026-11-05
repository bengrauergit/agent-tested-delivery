# Agent-tested delivery

A working method for shipping a web app where Claude Code agents build each change and other agents test and review it before it merges. The human owner sets priorities and makes the decisions that are hard to reverse; agents are not to ask the owner to test, and must say what is untested instead. This repo holds process notes, agent definitions, templates and example Playwright specs. It suits a small team or a solo owner running a production web app who wants agents to do most of the building, and who will keep test accounts, preview deploys and CI checks in place to back it up.

Nothing here depends on a particular framework, host or database. Where the notes mention a tool, treat it as one option.

## The checks

1. Unit tests, with every bug fix shipping a test that failed before the fix.
2. A type check and a production build.
3. A preview deploy of the pull request, so later checks run against a real server.
4. A browser tester: a separate agent session that drives a headless browser through the preview as each test role, then checks what was written to the database.
5. Independent review: a code reviewer on every change, a security reviewer on anything touching auth or data access, and a devil's advocate scaled to the risk of the change.

After a merge, the main session reads production errors for the changed area. [docs/01-checks.md](docs/01-checks.md) explains what each check catches that the others miss.

## Enforcement and risks

Only some of this is mechanical. Branch protection with required CI status checks (unit tests, type check, build, and Playwright specs committed to the repo and run against the preview) is what actually stops a merge. A database role that can write only test data is what actually keeps agents off real data. Everything else is advisory: an agent's APPROVE or PASS is a claim in a comment, not a status check, and an agent told "test data only" can still be wrong unless the credentials it holds enforce it.

The main risks: the reviewers run on the same model with similar prompts, so their mistakes correlate and they can wave through what the builder got wrong; agents with shell access read pull request text, code comments and fetched pages, any of which can carry prompt injection; secrets in environment variables can be echoed into logs or comments; browser runs are flaky; and every extra review costs tokens and time. [docs/06-limits.md](docs/06-limits.md) covers these in more detail.

## Repo map

- `docs/01-checks.md` to `docs/05-red-first.md`: the checks, the pipeline, the browser tester, event goldens, red-first tests.
- `docs/06-limits.md`: what the checks miss and the risks of the setup itself.
- `docs/07-lessons.md`: general rules for keeping checks honest.
- `agents/`: agent definitions for `.claude/agents/`.
- `templates/`: starting `CLAUDE.md` and `BACKLOG.md` files.
- `examples/playwright/`: Playwright specs for an event golden, a layout check and an access check.

## Setting it up

1. Copy `agents/*.md` into your project's `.claude/agents/`, and `templates/CLAUDE.md` and `templates/BACKLOG.md` to your project root. Fill in the bracketed parts.
2. In your app, create one test account per role and a test workspace that holds only fake data.
3. Create a database role or API key that can read what the tester needs and write only test data. Give agents that credential, not an admin one.
4. Store test passwords and that credential in your CI secret store and a local env file that is never committed.
5. Turn on your hosting provider's preview deploys for pull requests.
6. Adapt `examples/playwright/` to your app, commit the specs, and run them in CI against the preview URL.
7. Turn on branch protection that requires those CI checks to pass before merge.
8. Start a second Claude Code session as the browser tester (see `docs/03-browser-tester.md`), then ask the main session to take the top backlog item through the pipeline.

## Roles

- Main session: orders the backlog, briefs the other agents, merges, checks production.
- Builder: builds one slice per pull request, with evidence of what was verified.
- Business analyst: turns an idea into stories with checkable acceptance criteria.
- Devil's advocate: challenges significant plans before code, and changes before ship in proportion to risk.
- Code reviewer, security reviewer and browser tester: check work they did not write, without editing it.

## What stays with the owner

Priorities, and any change to a product rule, a privacy rule, the database schema, running costs or dependencies. These reach the owner as one question with options and a recommendation. Small, reversible changes ship once the required checks pass. The owner should also read production failure counts now and then, because some faults only show up on real devices.

## Licence

MIT. See `LICENSE`.
