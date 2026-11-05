I haven't tapped through my own app to test it in weeks. Yesterday it shipped 7 changes.

I'm building a mobile web app for junior football coaches. The rule I set: I make decisions, AI agents do the building and the testing. I run no manual tests, not even on my phone.

Here's what makes that safe. Every change passes five checkers before it reaches users:

1. Unit tests, written "red first": each one has to fail on the old code before the fix, so we know it can catch the bug. About 1,066 of them run on every change.
2. A type check and a production build.
3. A private preview copy of the app for every change.
4. A robot tester: a separate AI session drives a real browser at iPhone sizes, signs in as pretend coaches and parents, taps through the flow, then checks the database to see exactly what was saved.
5. Three reviewers who didn't write the code: one for quality, one for security, and a devil's advocate whose only job is to prove the change wrong.

The devil's advocate earns its keep. Yesterday a redesigned game screen passed every check, including "the page doesn't scroll". It worked the numbers and found that on short phones, the bottom row of players slid under a drawer. Nothing scrolled. The kids were just hidden.

My favourite trick is the "event golden": the robot plays the same scripted game on the old screen and the new one, and compares every saved event like two answer sheets. 24 out of 24 matched. A redesign that changes nothing underneath, proven.

What it can't do yet: be a real iPhone. So after every release, someone looks at the production error numbers. That someone is also an agent.

I've written the whole setup up as a free playbook: agent definitions, the pipeline, the gate rules and example test scripts.

[link to github.com/bengrauergit/agent-tested-delivery]

#AI #SoftwareEngineering #ClaudeCode #Testing
