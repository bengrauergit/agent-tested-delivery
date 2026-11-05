import { test as setup } from "@playwright/test";
import { AUTH, env } from "./roles";

// Sign in once per test role and save the session, so specs start signed in.
// Credentials come from .env or CI secrets, never from the command line.
const roles = [
  { name: "manager", file: AUTH.manager, email: "MANAGER_EMAIL", password: "MANAGER_PASSWORD" },
  { name: "member", file: AUTH.member, email: "MEMBER_EMAIL", password: "MEMBER_PASSWORD" },
];

for (const role of roles) {
  setup(`sign in as ${role.name}`, async ({ page }) => {
    // Replace with your sign-in flow.
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(env(role.email));
    await page.getByLabel("Password").fill(env(role.password));
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL((url) => !url.pathname.startsWith("/sign-in"));
    await page.context().storageState({ path: role.file });
  });
}
