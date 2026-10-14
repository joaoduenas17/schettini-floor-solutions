import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = new URL("../out/", import.meta.url).pathname;
const file = (name) => readFileSync(join(root, name), "utf8");
const htmlRoutes = ["index.html", "privacy/index.html", "terms/index.html", "accessibility/index.html", "404.html"];

test("the folder contains every public route with real HTML and the new canonical domain", () => {
  for (const route of htmlRoutes) {
    const html = file(route);
    assert.match(html, /<html lang="en"/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, route);
    assert.match(html, /<meta name="description"/);
    assert.match(html, /admin@schettinifloor.com/);
    assert.doesNotMatch(html, /data-netlify|form-detection\.html|project-decorative\.webp|facebook.com\/plugins\/video/);
    for (const tag of html.match(/<img\b[^>]*>/gi) || []) assert.match(tag, /\balt="[^"]+"/i);
  }
  assert.match(file("index.html"), /rel="canonical" href="https:\/\/schettinifs.com\//);
  assert.match(file("index.html"), /content="https:\/\/schettinifs.com\/images\/social-preview.jpg"/);
  assert.match(file("index.html"), /Prepare email request/);
  assert.match(file("index.html"), /Website by/);
  assert.match(file("404.html"), /This floor does not exist/);
});

test("static links, responsive photos, and CSS assets resolve inside the upload folder", () => {
  for (const route of htmlRoutes) {
    const html = file(route);
    const tags = html.match(/<(?:a|img|source|script|link)\b[^>]*>/gi) || [];
    for (const tag of tags) {
      for (const match of tag.matchAll(/\b(?:src|href)="([^"#]+)"/gi)) {
        const path = match[1].split("?")[0];
        if (!path.startsWith("/") || path.startsWith("//")) continue;
        assert.ok(existsSync(join(root, path)), `missing ${path} in ${route}`);
      }
      const srcset = tag.match(/\bsrcSet="([^"]+)"/i);
      if (srcset) for (const entry of srcset[1].split(",")) assert.ok(existsSync(join(root, entry.trim().split(" ")[0])), entry);
    }
    const ids = new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), (m) => m[1]));
    for (const fragment of html.matchAll(/\bhref="#([^"]+)"/g)) assert.ok(ids.has(fragment[1]), `missing #${fragment[1]}`);
  }
  const photos = JSON.parse(readFileSync(new URL("../app/project-photos.json", import.meta.url), "utf8"));
  assert.equal(Object.keys(photos).length, 15);
  for (const photo of Object.values(photos)) {
    assert.ok(photo.width > 0 && photo.height > 0 && photo.alt.length > 10);
    assert.ok(existsSync(join(root, photo.src)));
  }
  assert.ok(existsSync(join(root, "images/team.webp")), "restored team photo must be included");
  const home = file("index.html");
  assert.match(home, /class="about-team-image"/);
  assert.doesNotMatch(home.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] || "", /Residential projects are also available/);
  assert.match(home, /<details><summary>Do you handle residential projects\?[\s\S]*?Residential projects are also available/);
  assert.ok(!existsSync(join(root, "images/project-decorative.webp")));
  assert.ok(!existsSync(join(root, "form-detection.html")));
});

test("indexing and routing target the custom domain and preserve the custom 404", () => {
  assert.match(file("robots.txt"), /Sitemap: https:\/\/schettinifs.com\/sitemap.xml/);
  const sitemap = file("sitemap.xml");
  for (const path of ["", "/privacy", "/terms", "/accessibility"]) assert.match(sitemap, new RegExp(`https://schettinifs.com${path}`));
  assert.doesNotMatch(sitemap, /netlify|chatgpt.site/);
  assert.deepEqual(JSON.parse(file("_routes.json")).include, ["/api/*"]);
  assert.match(file("_headers"), /Strict-Transport-Security/);
});

test("the folder fits dashboard upload limits with no source or credentials", () => {
  let count = 0;
  function inspect(path) {
    for (const name of readdirSync(path)) {
      const child = join(path, name);
      if (statSync(child).isDirectory()) inspect(child);
      else { count++; assert.ok(statSync(child).size < 25 * 1024 * 1024); assert.doesNotMatch(name, /^\.env|\.map$/); }
    }
  }
  inspect(root);
  assert.ok(count < 1000);
  assert.ok(!existsSync(join(root, "package.json")));
  assert.ok(!existsSync(join(root, "node_modules")));
});
