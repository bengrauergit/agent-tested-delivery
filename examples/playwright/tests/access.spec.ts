import { test, expect, type Page } from "@playwright/test";
import { AUTH } from "./roles";

// Access check. The UI tests below show what each role SEES. They are not the authorisation test:
// hiding a page does not stop someone fetching its data. The API test as the wrong role, and the
// security reviewer's queries against the database's access rules, are what show what a role can GET.
//
// Judge the UI by visible content and where the browser ends up, not by HTTP status. In some
// server-rendering frameworks a page that starts streaming and then redirects still returns 200.

const PAGE_PATH = process.env.PROTECTED_PATH ?? "/admin/orders";
const MARKER = process.env.PROTECTED_MARKER ?? "All orders"; // text shown only inside the protected content
const DENIED_TEXT = process.env.DENIED_TEXT ?? "You don't have access"; // if the app denies in place
const API_PATH = process.env.PROTECTED_API_PATH ?? "/api/admin/orders";

async function expectDenied(page: Page) {
  // Wait until the app has settled on a denial (it left the page, or shows a denial message)
  // before asserting the content is absent. Asserting absence too early passes by timing.
  await expect(async () => {
    const left = new URL(page.url()).pathname !== PAGE_PATH;
    const denied = await page.getByText(DENIED_TEXT).isVisible();
    expect(left || denied).toBe(true);
  }).toPass({ timeout: 10_000 });
  await expect(page.getByText(MARKER)).toHaveCount(0);
}

async function expectApiRefuses(page: Page) {
  // page.request carries this context's cookies. If your API uses bearer tokens, send the role's token.
  const res = await page.request.get(API_PATH);
  if (res.ok()) {
    // Some APIs return 200 with rows filtered by access rules. Then this role must get nothing.
    expect(await res.json()).toEqual([]);
  } else {
    expect([401, 403, 404]).toContain(res.status());
  }
}

test.describe("manager", () => {
  test.use({ storageState: AUTH.manager });

  test("sees the protected page", async ({ page }) => {
    await page.goto(PAGE_PATH);
    await page.waitForURL((url) => url.pathname === PAGE_PATH);
    await expect(page.getByText(MARKER).first()).toBeVisible();
  });
});

test.describe("member", () => {
  test.use({ storageState: AUTH.member });

  test("is kept off the protected page", async ({ page }) => {
    await page.goto(PAGE_PATH);
    await expectDenied(page);
  });

  test("cannot read the protected data through the API", async ({ page }) => {
    await expectApiRefuses(page);
  });
});

test.describe("signed-out visitor", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("is sent to sign-in", async ({ page }) => {
    await page.goto(PAGE_PATH);
    await page.waitForURL((url) => url.pathname.startsWith("/sign-in"));
    await expect(page.getByText(MARKER)).toHaveCount(0);
  });

  test("cannot read the protected data through the API", async ({ page }) => {
    await expectApiRefuses(page);
  });
});
