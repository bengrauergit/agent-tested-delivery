import { test, expect, type Page } from "@playwright/test";

// Event golden: play a fixed scenario, read what the app saved, normalise it, and compare it with
// a baseline recorded from the old build. It shows that this scripted path behaves the same;
// it says nothing about paths the script does not take.
//
//   npm run golden:baseline   (BASE_URL pointing at the old build: records the baseline)
//   npm run golden:compare    (BASE_URL pointing at the new build: fails on any difference)

const DB_NAME = process.env.EVENT_DB ?? "app-events";
const STORE = process.env.EVENT_STORE ?? "events";

type Row = Record<string, unknown>;

test.beforeEach(async ({ context }) => {
  // Keep test data out of the backend by blocking the sync call. This changes behaviour: the app's
  // retry or offline-queue code runs, and anything the server would add is missing. If the scenario
  // must reach the server, let it through to the test workspace and delete its rows in afterEach.
  await context.route("**/api/sync**", (route) => route.abort());
});

test.afterEach(async ({ page }) => {
  // Clean up the local store this run created. If the scenario reached the server, also delete the
  // rows it created here, for example every order whose name starts with "test-".
  await page
    .evaluate(
      (name) =>
        new Promise<void>((resolve) => {
          const req = indexedDB.deleteDatabase(name);
          req.onsuccess = req.onerror = req.onblocked = () => resolve();
        }),
      DB_NAME,
    )
    .catch(() => undefined);
});

async function scenario(page: Page) {
  // A fixed sequence of user actions on test records. Same actions, same order, every run.
  await page.goto("/orders/new");
  await page.getByRole("button", { name: "Add test-item-1" }).click();
  await page.getByRole("button", { name: "Add test-item-2" }).click();
  await page.getByRole("button", { name: "Remove test-item-2" }).click();
  await page.getByRole("button", { name: "Undo" }).click();
  await page.getByRole("button", { name: "Check out" }).click();
  // Wait for the app's own signal that it has finished.
  await expect(page.getByText("Order placed")).toBeVisible();
}

async function readEvents(page: Page): Promise<Row[]> {
  // Read the app's IndexedDB store without creating it if it is missing.
  return page.evaluate(
    async ({ dbName, storeName }) => {
      const db = await new Promise<IDBDatabase | null>((resolve, reject) => {
        const req = indexedDB.open(dbName);
        // Opening a database that does not exist would create an empty one. Abort that instead.
        req.onupgradeneeded = () => req.transaction?.abort();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => (req.error?.name === "AbortError" ? resolve(null) : reject(req.error));
        req.onblocked = () => reject(new Error("event database is blocked"));
      });
      if (!db) return [];
      try {
        if (!db.objectStoreNames.contains(storeName)) return [];
        return await new Promise<Record<string, unknown>[]>((resolve, reject) => {
          const req = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
      } finally {
        db.close();
      }
    },
    { dbName: DB_NAME, storeName: STORE },
  );
}

async function waitForSavedState(page: Page) {
  // Wait until there are events and the count has stopped changing between two reads.
  let last = -1;
  await expect(async () => {
    const count = (await readEvents(page)).length;
    const stable = count === last;
    last = count;
    expect(count).toBeGreaterThan(0);
    expect(stable).toBe(true);
  }).toPass({ intervals: [250, 500, 1000], timeout: 15_000 });
}

const ID_KEY = /(^id$|Id$|_id$)/;
const TIME_KEY = /(^at$|At$|_at$|time|date)/i;
const ISO_TIME = /^\d{4}-\d{2}-\d{2}T/;

function normalise(rows: Row[]): unknown[] {
  // Generated ids become stable indexes and timestamps become placeholders, at any depth,
  // so two runs of the same scenario produce identical output.
  const ids = new Map<string, string>();
  const stableId = (value: unknown) => {
    const key = String(value);
    if (!ids.has(key)) ids.set(key, `#${ids.size}`);
    return ids.get(key);
  };
  const walk = (value: unknown, key = ""): unknown => {
    if (Array.isArray(value)) return value.map((v) => walk(v));
    if (value !== null && typeof value === "object") {
      const obj = value as Row;
      return Object.fromEntries(Object.keys(obj).sort().map((k) => [k, walk(obj[k], k)]));
    }
    if (value === null || value === undefined) return null;
    if (ID_KEY.test(key)) return stableId(value);
    if (TIME_KEY.test(key) || (typeof value === "string" && ISO_TIME.test(value))) return "<time>";
    return value;
  };
  // Sort by the app's timestamp, then by position in the store, so ties keep a stable order.
  const time = (row: Row) => {
    const t = row.at ?? row.createdAt;
    return typeof t === "number" ? t : Date.parse(String(t)) || 0;
  };
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => time(a.row) - time(b.row) || a.index - b.index)
    .map(({ row }) => walk(row));
}

test("the scripted order flow saves the same events as the baseline", async ({ page }) => {
  await scenario(page);
  await waitForSavedState(page);
  const events = normalise(await readEvents(page));
  expect(JSON.stringify(events, null, 2)).toMatchSnapshot("events.json");
});
