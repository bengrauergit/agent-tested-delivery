# The event golden

An event golden shows that, for a scripted path, a redesigned screen saves the same data as the old one. A redesign mostly touches markup and styles, but faults tend to come from the wiring: a handler attached to the wrong button, a guard lost while restructuring a component. Recording what the app saves before and after the change shows whether the scripted path behaves the same. It says nothing about paths the script does not take.

## Method

1. Write a spec that plays a fixed scenario through the UI. In an orders app that might be: create an order, add two items, remove one, undo, check out.
2. Run it against the old build and record what the app saved: event or row types and their payloads.
3. Run it against the new build and record the same.
4. Normalise anything that varies between runs, including inside payloads: generated ids become stable indexes, timestamps become placeholders, and rows are sorted stably.
5. Compare the two recordings. They should match.

Playwright's snapshot assertions do the recording and comparison: run once against the old build with `--update-snapshots`, then against the new build without it.

## Notes

Run it at every viewport size you support, because a new layout may hide a control at one size only. Include undo and linked records (a line item that refers to an order, a refund that refers to a payment), since references are where changes break quietly.

Wait for the app to finish saving before you read what it saved, or the recording will vary between runs.

Blocking the call that syncs to the server keeps test data out of the backend, but it also changes behaviour: retry and offline-queue code runs that would not run normally, and anything the server adds is missing. If the scenario must reach the server, let it through to a test workspace and delete the test rows afterwards instead.

Clean up what the run created, and commit the spec so later pull requests can rerun it.

See [examples/playwright/tests/golden.spec.ts](../examples/playwright/tests/golden.spec.ts).
