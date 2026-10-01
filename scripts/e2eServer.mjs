// Builds the app against a fake Supabase URL and serves it for the browser tests.
import { spawn, spawnSync } from "node:child_process";

export const FAKE_SUPABASE_URL = "https://test.supabase.co";
const env = { ...process.env, VITE_SUPABASE_URL: FAKE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_e2e" };

const build = spawnSync("npx", ["vite", "build", "--outDir", "dist-e2e", "--emptyOutDir"], { env, stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

const preview = spawn("npx", ["vite", "preview", "--outDir", "dist-e2e", "--port", "4173", "--strictPort"], { env, stdio: "inherit" });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => preview.kill(signal));
preview.on("exit", (code) => process.exit(code ?? 0));
