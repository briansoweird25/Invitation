import { defineConfig } from "@playwright/test";

/**
 * Browser tests run against a production build that points at a mocked Supabase API
 * (see tests/e2e/helpers/mockSupabase.ts), so they never need real credentials or network access.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 3,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:4173", viewport: { width: 1440, height: 900 } },
  webServer: {
    command: "node scripts/e2eServer.mjs",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
