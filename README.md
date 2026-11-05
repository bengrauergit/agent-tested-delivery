# Agent-tested delivery

A working method for shipping a web app where Claude Code agents build each change and other agents test and review it before it merges. The human owner sets priorities and makes the decisions that are hard to reverse; nobody taps through the app by hand to test it. This repo holds the process notes, agent definitions, templates and example check scripts. It suits a small team or a solo owner running a production web app who wants agents to do most of the building, and who is willing to keep test accounts, preview deploys and an automated browser in place to make that safe.

Nothing here depends on a particular framework, host or database. Where the notes mention a tool, treat it as one option.

## The checks

A change merges only when all of these pass:

1. Unit tests, with every bug fix shipping a test that failed before the fix.
2. A type check and a production build.
3. A preview deploy of the pull request, so later checks run against a real server.
4. A browser tester: a separate agent session that drives a headless browser through the preview as each test role, then checks what was written to the database.
5. Independent review: a code reviewer on every change, a security reviewer on anything touching auth or data access, and a devil's advocate who tries to show the plan or change is wrong.

After a merge, the main session reads production errors for the changed area. [docs/01-checks.md](docs/01-checks.md) explains what each check catches that the others miss.

## Repo map

- `docs/01-checks.md`: each check and why it is there.
- `docs/02-pipeline.md`: backlog stages, review gates, and what ships without the owner.
- `docs/03-browser-tester.md`: running the browser tester session.
- `docs/04-event-golden.md`: proving a redesign changed nothing underneath.
- `docs/05-red-first.md`: why each fix carries a test that failed first.
- `docs/06-limits.md`: what automated checks miss, and how to watch for it in production.
- `docs/07-lessons.md`: recurring failure patterns in the checks themselves.
- `agents/`: agent definitions for `.claude/agents/`.
- `templates/CLAUDE.md` and `templates/BACKLOG.md`: starting points for your project.
- `examples/playwright/`: an event golden, a layout check and an access check.

## Setting it up

1. Copy `agents/*.md` into your project's `.claude/agents/`.
2. Copy `templates/CLAUDE.md` to your project root and fill in the bracketed parts.
3. Copy `templates/BACKLOG.md` to `BACKLOG.md`.
4. In your app, create one test account per role and a test workspace that holds only fake data. Keep their passwords in your environment's secret store, not in the repo.
5. Turn on your hosting provider's preview deploys for pull requests.
6. Give the browser tester somewhere to run Playwright with Chromium installed, and read access to the database (writes limited to test data).
7. Start a second Claude Code session as the browser tester (see `docs/03-browser-tester.md`). The main session sends it briefs and reads its reports.
8. Ask the main session to take the top backlog item through the pipeline, and adjust the rules where they do not fit your project.

## Roles

- Main session: orders the backlog, briefs the other agents, merges, checks production. Makes small fixes only.
- Builder: builds one slice per pull request and attaches an evidence block.
- Business analyst: turns an idea into stories with checkable acceptance criteria.
- Devil's advocate: challenges the plan before code starts and the change before it ships.
- Code reviewer: reviews the diff it did not write.
- Security reviewer: tests the data paths as each role.
- Browser tester: uses the preview as each role and checks the database afterwards.

Only the builder and the main session write code.

## What stays with the owner

Priorities, and any change to a product rule, a privacy rule, the database schema, running costs or dependencies. These reach the owner as one question with options and a recommendation. Small, reversible changes ship once they pass the checks. The owner should also read the production failure counts now and then, because some faults only show up on real devices (see `docs/06-limits.md`).

## Licence

MIT. See `LICENSE`.
