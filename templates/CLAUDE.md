# [Project name]

[One paragraph: what the app does and who uses it.]

[`SPEC.md` or `PRD.md`] is the source of truth for scope and rules. Read the relevant section before starting a feature. If code would contradict a rule, stop and ask.

## Stack

- [Framework and hosting]
- [Database, auth and storage]
- Schema changes go in migrations, never in ad-hoc SQL against production.

## Data rules

[List your data rules. For example: collect the minimum personal data; access rules on every table, with tests; no user content in logs or analytics; deleting an account removes everything it owns.]

## How work flows

- `BACKLOG.md` is the one list of work. Read its header before adding, moving or shipping an item, and move the item in the same pull request that ships it.
- Work-in-progress limit: [2]. One pull request per item.
- The devil's advocate agent reviews at two points, as its own spawned agent (a self-review does not count):
  1. Before a significant recommendation reaches the owner, and before code starts on a feature or non-trivial fix. Small, reversible work can skip this (copy, a one-file bug fix with a red-first test).
  2. Before every ship, however small.
- Review: the code reviewer always; the security reviewer when auth, access rules or data paths change; the browser tester always.
- Small, reversible items (copy, bug fixes, UI within agreed rules) ship once they pass review. Anything that changes a product rule, a privacy rule, the schema, a running cost or a dependency goes to the owner first, as one question with options and a recommendation.

## Testing

The owner does not run manual tests, so never ask them to.

- Red first: a bug fix ships with a test that failed before the fix. Feature acceptance criteria become tests in the same pull request.
- A change merges after the browser tester (headless browser, signed in as the test accounts, against the preview deploy), an independent code review, the security review where it applies, and passing checks.
- Agents may write only to the test accounts and the test workspace (test records carry the prefix [`test-`]). Anything touching real users' data, and every schema change, goes to the owner as a numbered SQL file.
- After each merge, check production errors and events for the changed area. Once a day, check the failure counts for [your riskiest flows].

## Platform first

Use what the platform and framework already provide before writing your own. A new dependency needs the owner's approval. Write custom code only where neither offers a workable option, and say in the pull request why.

## Evidence

Each pull request description has an evidence block: the claim, where it was verified, the receipt, and MEASURED or INFERENCE. Do not state a conclusion from a search alone; read the code path.

## Asking the owner

When work is waiting on the owner, ask with concrete options and a recommendation, and say in one line what is blocked until they answer. Before asking them to do something outside the code, check whether an agent can do it instead.
