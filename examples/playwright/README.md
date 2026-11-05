# Example check scripts

Plain Playwright scripts. Run with Node, against a preview URL, with test credentials in environment variables.

```
BASE=https://your-preview.example.app TEST_EMAIL=coach@example.test TEST_PW=... node golden.cjs old.json
```

| Script | What it proves |
|---|---|
| `golden.cjs` | Plays a fixed scenario and dumps every saved event, normalised, so two builds can be diffed |
| `layout-check.cjs` | Every item sits inside its area and above a fixed bottom bar, at several screen sizes; fails on covered items, not just page scroll |
| `access-check.cjs` | A protected page never shows its content to the wrong role, judged by content and final URL, not HTTP status |

They are templates: change the selectors, routes and sign-in steps to match your app.
