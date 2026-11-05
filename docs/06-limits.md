# Limits of automated checks

Headless Chromium on a Linux server is not a real phone, and some faults will reach users before any check sees them. Be clear about which ones, and watch production for them.

## Where a real device differs

Mobile Safari is the usual gap. Things that can behave differently there include viewport units inside an installed home-screen app, the media formats produced by the camera or microphone APIs, screen lock and power-saving modes, a backgrounded tab being paused, browser storage being cleared after a period without visits, and permission prompts that reappear. Android browsers have their own versions of several of these.

## Ways to close part of the gap

Playwright's WebKit build is free and covers most layout and CSS differences and storage logic, but not real device media formats, installed-app mode, or lock and suspend behaviour. A real-device cloud service gives you real mobile browsers, real media formats and real viewports, at a monthly cost per parallel session; it still does not cover screen lock, power-saving modes or home-screen installs. A simulator on a Mac, or a macOS CI runner, gives real WebKit layout without a real microphone or lock behaviour. Production telemetry covers everything real users hit, but only after release.

None of these automate screen lock, power-saving modes or true background suspension. For those, count failures in production by device: failed uploads, failed saves, recovered drafts, whatever applies to your riskiest flows.

## Making it routine

If a device-only fault can reach users first, someone has to read the production numbers after each merge and once a day. Put that into the regular passes described in [02-pipeline.md](02-pipeline.md) so it does not depend on someone remembering.
