import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const binary = process.platform === "win32" ? "next.cmd" : "next";
const result = spawnSync(binary, ["build"], {
  cwd: root, stdio: "inherit", shell: process.platform === "win32",
  env: { ...process.env, CLOUDFLARE_EXPORT: "true", NEXT_PUBLIC_SITE_URL: "https://schettinifs.com", NEXT_PUBLIC_CONTACT_EMAIL: "admin@schettinifloor.com", NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || "" },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
const output = join(root, "out");
// Keep retired team photos, video screenshots, and the Netlify form blueprint
// out of the published folder, even when rebuilding from an older checkout.
for (const name of ["team.webp", "project-decorative.webp", "project-coating.webp", "project-commercial.webp", "project-polished.webp", "hero-floor.webp"]) {
  rmSync(join(output, "images", name), { force: true });
}
rmSync(join(output, "form-detection.html"), { force: true });
copyFileSync(join(root, "cloudflare/pages-worker.js"), join(output, "_worker.js"));
copyFileSync(join(root, "cloudflare/headers.txt"), join(output, "_headers"));
writeFileSync(join(output, "_routes.json"), JSON.stringify({ version: 1, include: ["/api/*"], exclude: [] }, null, 2));
writeFileSync(join(output, "_redirects"), "https://www.schettinifs.com/* https://schettinifs.com/:splat 301\nhttp://schettinifs.com/* https://schettinifs.com/:splat 301\nhttp://www.schettinifs.com/* https://schettinifs.com/:splat 301\n");
// Next.js emits a standalone 404.html for static hosting.
if (!existsSync(join(output, "404.html"))) throw new Error("Custom 404 page is missing.");
let files = 0;
let size = 0;
function inspect(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name), stat = statSync(path);
    if (stat.isDirectory()) inspect(path);
    else {
      files++; size += stat.size;
      if (stat.size > 25 * 1024 * 1024) throw new Error(`${name} exceeds the Pages Direct Upload file limit.`);
    }
  }
}
inspect(output);
if (files > 1000) throw new Error("More than 1,000 files: use Wrangler instead of dashboard upload.");
console.log(`Cloudflare folder ready: ${files} files, ${(size / 1024 / 1024).toFixed(2)} MiB. Upload the out folder.`);
