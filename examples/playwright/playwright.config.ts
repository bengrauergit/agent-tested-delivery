import { defineConfig } from "@playwright/test";
import { AUTH } from "./tests/roles";

// Load .env if present (Node 20.12 or later). In CI, set the same names as secrets.
try {
  process.loadEnvFile(".env");
} catch {
  // No .env file: rely on the environment.
}

const viewports = [
  { name: "phone-short", width: 375, height: 548, touch: true },
  { name: "phone", width: 375, height: 667, touch: true },
  { name: "phone-large", width: 390, height: 844, touch: true },
  { name: "desktop", width: 1280, height: 800, touch: false },
];

export default defineConfig({
  testDir: "./tests",
  forbidOnly: !!process.env.CI,
  // Retry once locally and twice in CI. A test that passes only on retry is reported as flaky: fix it.
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  // One golden file per viewport, without a platform suffix, so baselines compare across machines.
  snapshotPathTemplate: "{testDir}/__goldens__/{projectName}/{arg}{ext}",
  use: {
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // Signs in once per role and saves the session for the other projects.
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    // Layout and golden run at every viewport, signed in as the manager.
    ...viewports.map(({ name, width, height, touch }) => ({
      name,
      dependencies: ["setup"],
      testMatch: /(layout|golden)\.spec\.ts/,
      use: { viewport: { width, height }, hasTouch: touch, storageState: AUTH.manager },
    })),
    // Access runs once; each describe block picks its own role.
    { name: "access", dependencies: ["setup"], testMatch: /access\.spec\.ts/ },
  ],
});
