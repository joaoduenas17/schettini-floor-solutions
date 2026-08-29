import { spawnSync } from "node:child_process";

const nextBinary = process.platform === "win32" ? "next.cmd" : "next";
const result = spawnSync(nextBinary, ["build"], {
  stdio: "inherit",
  env: { ...process.env, NETLIFY: "true" },
  shell: process.platform === "win32",
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
