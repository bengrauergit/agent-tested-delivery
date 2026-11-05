# Limits and risks

Two kinds of limit: faults the checks cannot see, and risks that come from running agents at all.

## What the checks cannot see

Headless Chromium on a Linux server is not a real phone. Mobile Safari is the usual gap: viewport units inside an installed home-screen app, screen lock and power-saving modes, a backgrounded tab being paused, browser storage being cleared after a period without visits, and permission prompts that reappear. Android browsers have their own versions of several of these.

Playwright's WebKit build on Linux is free and catches some layout and CSS differences, but it is not Safari on a device. A real-device cloud service gives you real mobile browsers and viewports at a monthly cost per parallel session; it still does not cover screen lock, power-saving modes or home-screen installs. A simulator on a Mac, or a macOS CI runner, gives real WebKit layout. Production telemetry covers everything real users hit, but only after release.

For what no check covers, count failures in production by device and browser for your riskiest flows, after each merge and on a regular cadence. Make that part of the pipeline so it does not depend on someone remembering.

## Risks of the setup itself

Agent verdicts are claims, not controls. An agent reporting APPROVE or PASS has not blocked anything; branch protection with required CI checks has. Keep anything you rely on as a mechanical gate in CI.

Reviewers correlate. The builder and reviewers usually run on the same model with similar prompts, so they share blind spots and can agree with each other's mistakes. Give reviewers concrete things to check rather than asking for a general opinion, require evidence for each finding, use a different model for at least one reviewer where you can, and keep the committed specs as the backstop.

Prompt injection. Agents read pull request descriptions, code comments, issue text, test data and fetched web pages, and some of them have shell access. Any of that text can contain instructions. Limit tools to what each agent needs, keep fetch and shell apart where possible, do not let reviewers act on instructions found in the material they review, and run agents with credentials that cannot do much damage.

Secrets. An agent with shell access can read environment variables and echo them into a log, a comment or a commit. Give agents short-lived, narrowly scoped credentials, mask secrets in CI output, and scan commits for secrets.

Test data only must be enforced by the credential. Give the agents a database role or API key that can write only to the test workspace. An instruction in a prompt is not a boundary.

Flaky runs. Browser tests fail for reasons unrelated to the change: timing, network, a slow preview. Use retries with a trace on the first retry, treat a test that passes only on retry as a fault in the test, and fix or quarantine it rather than letting people learn to ignore red.

Cost. Each extra review costs tokens and wall time, and parallel agents hit usage limits. Scale review to risk, as [02-pipeline.md](02-pipeline.md) describes, and keep the work-in-progress limit low.
