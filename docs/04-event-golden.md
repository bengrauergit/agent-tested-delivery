# The event golden

An event golden shows that a redesign changed how a screen looks and nothing about what it does. A redesign mostly touches markup and styles, but faults tend to come from the wiring: a handler attached to the wrong button, a guard lost while restructuring a component. Reading the diff line by line catches some of these; recording behaviour before and after catches them reliably.

## Method

1. Write a script that plays a fixed scenario through the UI. In an orders app that might be: create an order, add two items, change a quantity, remove an item, undo, apply a discount, check out.
2. Run it against the old build and record everything the app saved: event or row types and their payloads.
3. Run it against the new build and record the same.
4. Normalise anything that varies between runs: generated ids become indexes, timestamps become order.
5. Diff the two recordings. They should be identical.

## Notes

Run it at every viewport size you support, because a new layout may hide a control at one size only. Include undo and linked records (a line item that refers to an order, a refund that refers to a payment), since references are where changes break quietly. Block the network call that syncs to production while it runs, so no test data lands there. Commit the script so later pull requests can rerun it and a reviewer can read it.

See [examples/playwright/golden.cjs](../examples/playwright/golden.cjs).
