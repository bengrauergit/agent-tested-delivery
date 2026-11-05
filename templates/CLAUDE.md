# [Project name]

[One paragraph: what the app does and for whom.]

[`SPEC.md` or `PRD.md`] is the source of truth for scope and rules. Read the relevant section before starting a feature. If code would contradict a rule, stop and ask.

## Stack

- [Framework, hosting, region]
- [Database, auth, storage]
- Schema changes go in migrations, never ad-hoc SQL against production.

## Privacy rules (non-negotiable)

[List your data rules here. Examples: minimal personal data; access rules on every table, with tests; no content in logs or analytics; deletion must stay easy.]

## How work flows

- `BACKLOG.md` is the one view of work. Read its header before adding, moving or shipping an item, and move the item in the same PR that ships it.
- **WIP limit: [2].** One pull request per item.
- **Two gates by the devil's advocate agent** (spawn it; an inline self-review doesn't count):
  1. Before a significant recommendation reaches the owner, and before code starts on a feature or non-trivial fix. Skippable for small, reversible work (copy, a one-file bug fix with a red-first test).
  2. Before every ship, however small.
- **Review:** the code reviewer always; the security reviewer when auth, access rules or data paths change; the browser tester always.
- **Ships without asking the owner:** small, reversible items (copy, bug fixes, UI within agreed rules) once they pass review. **Anything that changes a product rule, a privacy rule, the schema, a cost or a dependency goes to the owner first, as one question with options and a recommendation.**

## Testing (the owner runs no manual tests)

- **Red first.** A bug fix ships with a test that failed before the fix. Feature acceptance criteria become tests in the same PR.
- A change merges after the browser tester (headless browser, signed in as the test accounts, against the preview deploy), an independent code review, the security review where it applies, and green checks.
- Never ask the owner to test.
- **Test data only.** Agents may write to test accounts and the test team (fake names start with `T-`). Anything touching real users' data, and every schema change, goes to the owner as a numbered SQL file.
- **After every merge:** check production errors and the events for the changed area. Once a day: check the failure counters that matter for [your riskiest flows].

## Native first

Use what the platform and framework already provide before writing your own. A new dependency needs the owner's OK. Custom code only where neither exists; name it in the PR and say why.

## Evidence

Every PR body has an evidence block: claim, where it was verified, the receipt, MEASURED or INFERENCE. Never state a conclusion from a search alone; read the code path.

## Asking the owner

When work waits on the owner, ask with a dialog: concrete options and a recommendation, and say in one line what is blocked until they answer. Before asking them to do anything outside the code, try every route that removes the step.
