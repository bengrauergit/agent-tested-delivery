import { test, expect } from "@playwright/test";

// Layout check: every item must sit inside its area, above any fixed bottom bar, and be the
// element under its own centre point (so no overlay covers it). "No page scroll" alone is not
// enough: items can slide under a fixed bar while nothing scrolls.
//
// Use it on a screen meant to fit without scrolling. For a list that scrolls, check only the
// items expected to be visible, or scroll each into view first.
// Needs at least one test record in the test workspace, so the list is not empty.

const LIST_PATH = process.env.LIST_PATH ?? "/orders";
const AREA = "list"; // data-testid of the container items must stay inside
const ITEM = "list-item"; // data-testid of the things that must stay visible and tappable
const BAR = "bottom-bar"; // data-testid of anything fixed at the bottom, if present

test("every list item is inside the list, above the bottom bar, and not covered", async ({ page }) => {
  await page.goto(LIST_PATH);

  // Fail on a missing area or zero items: a check over nothing passes trivially.
  await expect(page.getByTestId(AREA)).toBeVisible();
  await expect(page.getByTestId(ITEM).first()).toBeVisible();
  expect(await page.getByTestId(ITEM).count()).toBeGreaterThan(0);

  const result = await page.evaluate(
    ({ area, item, bar }) => {
      const byTestId = (id: string) => `[data-testid="${id}"]`;
      const areaBox = document.querySelector(byTestId(area))!.getBoundingClientRect();
      const barEl = document.querySelector(byTestId(bar));
      const barTop = barEl ? barEl.getBoundingClientRect().top : window.innerHeight;
      const bad: number[] = [];
      document.querySelectorAll(byTestId(item)).forEach((el, index) => {
        const b = el.getBoundingClientRect();
        const inside =
          b.top >= areaBox.top && b.bottom <= areaBox.bottom && b.left >= areaBox.left && b.right <= areaBox.right;
        const aboveBar = b.bottom <= barTop;
        const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        const uncovered = hit !== null && el.contains(hit);
        if (!inside || !aboveBar || !uncovered) bad.push(index);
      });
      const pageScroll = document.documentElement.scrollHeight > window.innerHeight;
      return { bad, pageScroll };
    },
    { area: AREA, item: ITEM, bar: BAR },
  );

  expect(result.bad, `items outside the list, under the bar, or covered (by index): ${result.bad.join(", ")}`).toEqual([]);
  expect(result.pageScroll, "the page scrolls").toBe(false);
});
