// Event golden: play a fixed scenario, dump what the app saved, diff old build vs new.
// Usage: BASE=... TEST_EMAIL=... TEST_PW=... node golden.cjs out.json
// Then: diff <(jq -S . old.json) <(jq -S . new.json)
const { chromium } = require("playwright");
const fs = require("fs");

const BASE = process.env.BASE;
const OUT = process.argv[2] || "events.json";
const SIZES = [[375, 667], [390, 844]];

async function signIn(page) {
  // Replace with your sign-in flow. Read secrets from the environment only.
  await page.goto(`${BASE}/sign-in`);
  await page.getByLabel("Email").fill(process.env.TEST_EMAIL);
  await page.getByLabel("Password").fill(process.env.TEST_PW);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((u) => !u.pathname.startsWith("/sign-in"));
}

async function scenario(page) {
  // A fixed script of user actions. Keep it deterministic: same taps, same order.
  await page.getByRole("button", { name: "Start" }).click();
  await page.getByRole("button", { name: "T-Ava" }).click();
  await page.getByRole("button", { name: "T-Ben" }).click(); // swap
  await page.getByRole("button", { name: "Undo" }).click();
  await page.getByRole("button", { name: "Finish" }).click();
}

async function dumpEvents(page) {
  // Read what the app stored locally (IndexedDB here) or query your API for the rows written.
  return page.evaluate(async () => {
    const db = await new Promise((res, rej) => {
      const r = indexedDB.open("app-events");
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
    const rows = await new Promise((res) => {
      const out = [];
      const cur = db.transaction("events").objectStore("events").openCursor();
      cur.onsuccess = (e) => { const c = e.target.result; if (c) { out.push(c.value); c.continue(); } else res(out); };
    });
    return rows;
  });
}

function normalise(rows) {
  // Random ids become indexes and timestamps become order, so two runs can match exactly.
  const ids = new Map();
  const id = (v) => (v == null ? v : (ids.has(v) || ids.set(v, `#${ids.size}`), ids.get(v)));
  return rows
    .sort((a, b) => a.at - b.at)
    .map((r) => ({ type: r.type, player: id(r.playerId), ref: id(r.refId), payload: r.payload ?? null }));
}

(async () => {
  const browser = await chromium.launch();
  const result = {};
  for (const [w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    // Block the call that syncs to production so the run writes no real data.
    await ctx.route("**/api/sync**", (r) => r.abort());
    const page = await ctx.newPage();
    await signIn(page);
    await scenario(page);
    result[`${w}x${h}`] = normalise(await dumpEvents(page));
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  console.log(`wrote ${OUT}`);
})();
