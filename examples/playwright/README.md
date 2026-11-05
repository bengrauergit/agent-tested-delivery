# Example Playwright specs

Templates for three checks, written as `@playwright/test` specs so they can run in CI as required status checks. Change the selectors, routes and sign-in steps to match your app.

- `tests/auth.setup.ts` signs in once per test role and saves the session for the other specs.
- `tests/layout.spec.ts` checks that every item sits inside its area, above any fixed bottom bar, and is not covered by an overlay, at each viewport in the config. It fails if the area is missing or there are no items.
- `tests/access.spec.ts` checks what each role sees on a protected page, judged by visible content and the final URL, and checks that the data API refuses the wrong role. The UI part is not the authorisation test; the API part and the security reviewer's database queries are.
- `tests/golden.spec.ts` plays a fixed scenario, reads what the app saved, normalises ids and timestamps, and compares it with a baseline from the old build.

`playwright.config.ts` defines a project per viewport, retries (once locally, twice in CI), and a trace on the first retry.

## Running them

1. `npm install` then `npx playwright install chromium`.
2. Copy `.env.example` to `.env` and fill it in. `.env` is ignored by git. Never put passwords on the command line, where they end up in shell history and CI logs.
3. Point `BASE_URL` at a preview deploy that uses test data, and run `npm test`.

For the golden, record a baseline with `BASE_URL` set to the old build (`npm run golden:baseline`), then run `npm run golden:compare` with it set to the new build. Baselines are written to `tests/__goldens__/`.

In CI, set the same variables as secrets, pass the preview URL as `BASE_URL`, and make the job a required check under branch protection. The specs need a test workspace with at least one test record for the layout check, and test accounts for both roles.
