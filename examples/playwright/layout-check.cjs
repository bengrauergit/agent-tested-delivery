// Layout check: every item must sit fully inside its area and above a fixed bottom bar.
// "No page scroll" is not enough: items can slide under a drawer while nothing scrolls.
// Usage: BASE=... TEST_EMAIL=... TEST_PW=... node layout-check.cjs
const { chromium } = require("playwright");

const BASE = process.env.BASE;
const SIZES = [[375, 520], [375, 548], [375, 667], [390, 844]];
const AREA = ".pitch";        // the container items must stay inside
const ITEM = ".pitch .token"; // the things that must stay visible and tappable
const BAR = ".drawer";        // anything fixed at the bottom

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const [w, h] of SIZES) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(`${BASE}/screen-under-test`); // sign in first in a real script
    const r = await page.evaluate(({ AREA, ITEM, BAR }) => {
      const box = (el) => el.getBoundingClientRect();
      const area = box(document.querySelector(AREA));
      const bar = document.querySelector(BAR);
      const barTop = bar ? box(bar).top : innerHeight;
      const bad = [...document.querySelectorAll(ITEM)].filter((el) => {
        const b = box(el);
        const inside = b.top >= area.top && b.bottom <= area.bottom && b.left >= area.left && b.right <= area.right;
        const above = b.bottom <= barTop;
        // Tappable: the element at its centre must be the element itself (not an overlay).
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
