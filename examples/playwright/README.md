# Example check scripts

Plain Playwright scripts, run with Node against a preview URL, with test credentials in environment variables. For example:

```
BASE=https://your-preview.example.com TEST_EMAIL=manager@example.test TEST_PW=your-test-password node golden.cjs old.json
```

- `golden.cjs` plays a fixed scenario and writes every saved event, normalised, so the output from two builds can be diffed.
- `layout-check.cjs` checks that every item sits inside its area, above any fixed bottom bar, and is not covered by an overlay, at several viewport sizes. It fails on covered items, not only on page scroll.
- `access-check.cjs` checks that a protected page never shows its content to the wrong role, judged by the content and the final URL rather than the HTTP status.

They are templates. Change the selectors, routes and sign-in steps to match your app.
