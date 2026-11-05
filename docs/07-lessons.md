# Lessons

These are patterns in how the checks themselves go wrong. Each one has a counter that is now part of the process.

1. A check can pass while measuring the wrong thing. "No page scroll" stays green when items slide under a fixed bottom bar on short screens, because nothing scrolls. Check that each item sits inside its area and is the element under its own centre point, at several screen heights, as `examples/playwright/layout-check.cjs` does.

2. A fix can create a new fault nearby. Moving notices into an overlay so they take no space can leave the overlay intercepting taps on the content beneath it. When a fix changes layering or layout, add a check that the content underneath can still be used.

3. An HTTP status can give a false green. A protected page that starts streaming a loading state before redirecting returns 200 to the wrong role. Judge access by whether the protected content appears and by the final URL, as `examples/playwright/access-check.cjs` does.

4. "Merges cleanly" is a claim, not a result. When two open pull requests touch the same file, test-merge them together before merging either.

5. A reported bug may not be the real problem. Measure before fixing. A table reported as cut off on phones may lay out correctly but give no sign that there are more columns; the right change is then a scroll hint, not a layout fix.

6. Leftover test data can block the next test. If a cleanup step needs an approval that times out, the stale records can make the app refuse the next run. Clean up in the same run, and sweep marked test rows on a schedule.

7. A brief that lists degenerate cases finds faults no one would try by hand. Asking the tester to repeat a flow offline, with double taps and with a reload part way through regularly turns up crashes that normal use would not.
