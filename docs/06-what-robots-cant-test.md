# What the robots can't test

Be honest about the gaps, then watch production for them.

## The usual gap: a real phone

A headless Chromium on Linux isn't iOS Safari. Things that can differ:

- Layout units in the home-screen app (100dvh, container query units)
- Which audio format the recorder produces (iOS 18.4+ records webm; older iOS records mp4)
- Screen lock, Low Power Mode, a backgrounded tab being paused
- Storage being cleared after a period without visits (Safari tabs; the home-screen app is treated differently)
- Permission prompts that come back every time

## Options, cheapest first

| Option | Covers | Doesn't cover | Cost |
|---|---|---|---|
| Playwright WebKit | Most layout and CSS, IndexedDB logic | Real iOS recorder formats, standalone mode, lock and suspend | Free |
| A real-device cloud (BrowserStack, LambdaTest, Sauce Labs) | Real iOS Safari, real recorder format, real viewport | Screen lock, Low Power Mode, home-screen install | Roughly US$100 to $200 a month for one parallel session (check current pricing) |
| iOS Simulator on a Mac (or a macOS CI runner) | Real WebKit layout | Real mic, lock and suspend | A Mac, or per-minute runner cost |
| Production telemetry | Everything real users hit | Nothing before release | Free |

No option automates screen lock, Low Power Mode or true background suspension. For those, count the failures in production every day: failed recordings, failed uploads, recovered notes, by device.

## The rule

If an iOS-only fault can reach users first, someone must look at production numbers after every merge and once a day. Make that part of the scheduled passes, not a good intention.
