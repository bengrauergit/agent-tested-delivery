// Access check: the wrong role must never see a protected page's content.
// Judge by the content and the final URL, not the HTTP status: a page that starts streaming a
// loading state and then redirects can still return 200.
// Usage: BASE=... MANAGER_EMAIL=... MANAGER_PW=... MEMBER_EMAIL=... MEMBER_PW=... node access-check.cjs
const { chromium } = require("playwright");

const BASE = process.env.BASE;
const PAGE = process.env.PROTECTED_PATH || "/admin/orders"; // a page only managers may open
const MARKER = process.env.PROTECTED_MARKER || "All orders"; // text only the right role should see

async function visitAs(browser, email, pw) {
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
  const manager = await visitAs(browser, process.env.MANAGER_EMAIL, process.env.MANAGER_PW);
  const member = await visitAs(browser, process.env.MEMBER_EMAIL, process.env.MEMBER_PW);
  const anon = await visitAs(browser, null, null);
  await browser.close();
  const checks = [
    ["manager sees the page", manager.sees && manager.url === PAGE],
    ["member never sees it", !member.sees && member.url !== PAGE],
    ["signed-out visitor lands on sign-in", !anon.sees && anon.url.startsWith("/sign-in")],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  process.exit(checks.every(([, ok]) => ok) ? 0 : 1);
})();
