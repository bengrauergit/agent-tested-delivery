// Access check: the wrong role must never see a protected page's content.
// Judge by the content and the final URL, not the HTTP status: a page that starts streaming a
// loading screen and then redirects can still return 200.
// Usage: BASE=... COACH_EMAIL=... COACH_PW=... PARENT_EMAIL=... PARENT_PW=... node access-check.cjs
const { chromium } = require("playwright");

const BASE = process.env.BASE;
const PAGE = "/team/sent";
const MARKER = "Sent to families"; // text only the right role should see

async function as(browser, email, pw) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  if (email) {
    await page.goto(`${BASE}/sign-in`);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(pw);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForLoadState("networkidle");
  }
  await page.goto(`${BASE}${PAGE}`);
  await page.waitForLoadState("networkidle");
  const sees = (await page.content()).includes(MARKER);
  const url = new URL(page.url()).pathname;
  await ctx.close();
  return { sees, url };
}

(async () => {
  const browser = await chromium.launch();
  const coach = await as(browser, process.env.COACH_EMAIL, process.env.COACH_PW);
  const parent = await as(browser, process.env.PARENT_EMAIL, process.env.PARENT_PW);
  const anon = await as(browser, null, null);
  await browser.close();
  const checks = [
    ["coach sees the page", coach.sees && coach.url === PAGE],
    ["parent never sees it", !parent.sees && parent.url !== PAGE],
    ["signed out lands on sign-in", !anon.sees && anon.url.startsWith("/sign-in")],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  process.exit(checks.every(([, ok]) => ok) ? 0 : 1);
})();
