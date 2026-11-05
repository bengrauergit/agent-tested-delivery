// Layout check: every item must sit fully inside its area, above any fixed bottom bar,
// and be the element under its own centre point (so no overlay covers it).
// Use it on a screen that is meant to fit without scrolling. "No page scroll" alone is not
// enough: items can slide under a fixed bar while nothing scrolls.
// Usage: BASE=... PAGE_PATH=/orders node layout-check.cjs
const { chromium } = require("playwright");

const BASE = process.env.BASE;
const PAGE_PATH = process.env.PAGE_PATH || "/orders";
const SIZES = [[375, 548], [375, 667], [390, 844], [1280, 800]];
const AREA = "[data-testid=list]";      // the container items must stay inside
const ITEM = "[data-testid=list-item]"; // the things that must stay visible and tappable
const BAR = "[data-testid=bottom-bar]"; // anything fixed at the bottom, if present

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const [w, h] of SIZES) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(`${BASE}${PAGE_PATH}`); // sign in first in a real script
    const r = await page.evaluate(({ AREA, ITEM, BAR }) => {
      const box = (el) => el.getBoundingClientRect();
      const area = box(document.querySelector(AREA));
      const bar = document.querySelector(BAR);
      const barTop = bar ? box(bar).top : innerHeight;
      const bad = [...document.querySelectorAll(ITEM)].filter((el) => {
        const b = box(el);
        const inside = b.top >= area.top && b.bottom <= area.bottom && b.left >= area.left && b.right <= area.right;
        const above = b.bottom <= barTop;
        // Tappable: the element at its centre must be the item itself, not an overlay.
        const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        return !inside || !above || !el.contains(hit);
      }).length;
      const pageScroll = document.documentElement.scrollHeight > innerHeight;
      return { bad, pageScroll };
    }, { AREA, ITEM, BAR });
    const ok = r.bad === 0 && !r.pageScroll;
    if (!ok) failed++;
    console.log(`${w}x${h}: ${ok ? "PASS" : "FAIL"} covered=${r.bad} pageScroll=${r.pageScroll}`);
    await page.close();
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
