# The event golden

How to prove a redesign changed how things look and nothing about what they do.

## The idea

Two students do the same exam. If their answer sheets match exactly, they agree.

1. Write a script that plays a fixed scenario through the UI: in a game-time app, for example, kick off, swap two players, move a player to a line, mark one out and back, score with a scorer, undo, half-time, second half, full time.
2. Run it on the old build and record everything the app saved: event types and payloads.
3. Run it on the new build and record the same.
4. Normalise anything random (ids become names or indexes, timestamps become order).
5. Diff the two. They must be byte-identical.

## Why it works

A redesign touches markup and styles. Bugs hide in the wiring: a handler hooked to the wrong button, a gate dropped in a restructure. The golden catches every one of those without anyone reading the diff line by line.

## Tips

- Run it at every screen size you support. The new layout may hide a control at one size only.
- Cover undo and linked events (a scorer linked to a goal), because those carry references that break quietly.
- Block the network call that syncs to production while you run it, so no test data lands there.
- Commit the script, so the next PR can rerun it. A proof that lives in a scratch folder can't be checked by a reviewer.

See [examples/playwright/golden.cjs](../examples/playwright/golden.cjs).
