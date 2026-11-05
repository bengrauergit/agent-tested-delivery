# Keeping checks honest

General rules for checks that can pass while the thing they guard is broken.

1. Measure the outcome, not a proxy. "No page scroll" can stay green while content sits under a fixed bar. Check that each item is inside its area and is the element under its own centre point, at several screen heights, as `examples/playwright/tests/layout.spec.ts` does.

2. A check over an empty set passes. A layout or access check that finds no items, or no container, has checked nothing. Assert that what you are measuring exists before measuring it.

3. When a fix changes layering or layout, check what sits underneath. Anything placed over other content can intercept taps or clicks meant for it.

4. Judge access by content and destination, then test the data layer. A status code or a hidden button is not authorisation. The UI check shows what the user sees; a request to the API or database as the wrong role shows what they can get.

5. Wait for the state you are about to read. Reading saved data, or asserting that something is absent, before the app has settled gives results that pass or fail by timing.

6. "Merges cleanly" is a claim, not a result. When two open pull requests touch the same files, test-merge them together in a scratch worktree before merging either.

7. Reproduce before fixing. A reported fault may be real, absent, or a different problem than described. Measure first and fix what the measurement shows.

8. Clean up in the same run. Leftover test records can change what the app allows next time and make later runs fail for unrelated reasons. Add a scheduled sweep of marked test rows as a backstop.

9. Write the degenerate cases into the brief. Offline, repeated submits and a reload part way through a flow find faults that ordinary use rarely reaches, but only when someone asks for them.
