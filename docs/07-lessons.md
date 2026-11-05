# Lessons from real runs

Each of these happened. Each made the process better.

1. **A check measured the wrong thing.** A redesigned screen passed "no page scroll" at every phone size. The devil's advocate worked the numbers: on short phones the bottom row of players slid under a drawer. Nothing scrolled, so the check stayed green. Fix: check that every item sits inside its area, at more screen heights.

2. **A fix created a new bug.** Notices were moved into an overlay so they stopped taking space. The second review found the overlay now blocked taps on the players beneath it. Fix: notices became tap-to-dismiss, the layer let taps through, and a test proves a covered player can still be tapped.

3. **A false green.** An access check said a family login got HTTP 200 on a coach-only page. The page had started streaming a loading screen before redirecting. The builder caught it and changed the check to look for the protected content and the final URL.

4. **"It merges cleanly"**, said a comment. The code reviewer test-merged it against the sibling PR and found a conflict. Fix: always test-merge when two PRs touch the same file.

5. **A bug that was never real.** A table was reported as cut off on phones. The builder measured it and couldn't reproduce it. What was real: nothing showed there were more columns. The PR shipped a scroll hint instead of a fix for a bug that didn't exist.

6. **Leftover test data blocked testing.** An approval prompt for a database delete timed out, so two empty test games stayed, and the app then refused to start a new game because "a game is running on another phone". Fix: clean up in the same run, and sweep test-only rows on a schedule.

7. **The robot found what people would have missed.** Tapping Accept while offline crashed the whole review screen. Nobody had tried that by hand. The tester tried it because the brief said "offline".
