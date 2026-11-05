import path from "node:path";

// Saved sessions written by auth.setup.ts. Ignored by git: they hold live session cookies.
export const AUTH = {
  manager: path.join(__dirname, "..", "playwright", ".auth", "manager.json"),
  member: path.join(__dirname, "..", "playwright", ".auth", "member.json"),
};

export function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} in .env or in the CI secrets.`);
  return value;
}
