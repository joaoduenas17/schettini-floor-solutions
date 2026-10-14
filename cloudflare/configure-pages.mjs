import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { spawnSync } from "node:child_process";

const folder = dirname(fileURLToPath(import.meta.url));
const git = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: folder, encoding: "utf8", stdio: "pipe" });
if (git.status === 0 && git.stdout.trim() === "true") {
  throw new Error("Extrae el paquete en Downloads, fuera de un repositorio Git, para publicar en produccion.");
}
if (!existsSync(join(folder, "site", "_worker.js"))) {
  throw new Error("No aparece site/_worker.js. Extrae todo el ZIP antes de ejecutar este archivo.");
}

const cliKeyIndex = process.argv.indexOf("--site-key");
let siteKey = cliKeyIndex >= 0 ? process.argv[cliKeyIndex + 1] : undefined;
if (siteKey === undefined) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    siteKey = await prompt.question("Pega la SITE KEY / clave publica de Turnstile (la Secret Key se introduce en el siguiente comando): ");
  } finally {
    prompt.close();
  }
}
siteKey = siteKey.trim();
if (!/^[A-Za-z0-9_-]{20,32}$/.test(siteKey) || /^(?:1x|2x|3x)0{10}/.test(siteKey)) {
  throw new Error("Verifica que copiaste la Site Key publica real del widget, no una clave de prueba ni la Secret Key.");
}
const config = JSON.parse(readFileSync(join(folder, "wrangler.pages.jsonc"), "utf8"));
config.vars.TURNSTILE_SITE_KEY = siteKey;
writeFileSync(join(folder, "wrangler.jsonc"), JSON.stringify(config, null, 2) + "\n");
console.log("Configuracion publica lista para el proyecto schettinifs.");
console.log("Ahora ejecuta: npx wrangler@4.92.0 pages secret put TURNSTILE_SECRET_KEY --project-name schettinifs");
console.log("Cuando termine: npx wrangler@4.92.0 pages deploy site --project-name schettinifs");
