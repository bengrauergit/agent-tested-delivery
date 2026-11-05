# Red first

Each bug fix ships with a test that failed before the fix and passes after it. Each feature's acceptance criteria become tests in the same pull request.

A test you never saw fail may not be testing anything. The failing run shows the bug was real, the passing run shows it is gone, and the test stays behind so the bug cannot return unnoticed.

In the evidence block, the builder names the test file and gives both results, for example "failing on main, passing on the branch", with the counts from each run. Reviewers treat a fix without a red-first test as incomplete.

Some faults have no unit-level seam, such as a layout problem or something that only happens in a real browser. In that case the red-first check is a browser script that fails against the old build, for example "the first list item is cut off: its left edge is outside the container". Say so in the pull request.
