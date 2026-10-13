import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("the contact experience is email-first and contains no WhatsApp flow", async () => {
  const [page, css, siteConfig] = await Promise.all([
    source("app/page.tsx"),
    source("app/globals.css"),
    source("app/site-config.ts"),
  ]);

  assert.doesNotMatch(`${page}\n${css}`, /whatsapp|wa\.me/i);
  assert.match(siteConfig, /admin@schettinifloor\.com/);
  assert.doesNotMatch(siteConfig, /accounting@schettinifloor\.com/);
  assert.match(page, /mailto:/);
  assert.match(page, /name="estimate-request"/);
  assert.match(page, /type="email" name="email"/);
  assert.match(page, /formStatus === "submitting"/);
  assert.match(page, /formStatus === "success"/);
  assert.match(page, /formStatus === "error"/);
  assert.match(page, /id="estimate-email"/);
  assert.match(page, /handleEmailCta/);
});

test("scroll reveals and real multi-photo galleries replace the video screenshot", async () => {
  const [page, css, projects] = await Promise.all([source("app/page.tsx"), source("app/globals.css"), source("app/projects.ts")]);
  assert.match(page, /IntersectionObserver/);
  assert.match(page, /data-reveal/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(projects, /Surface Preparation/);
  assert.match(page, /photo-thumbnails/);
  assert.match(page, /Previous photo/);
  assert.match(page, /Next photo/);
  assert.doesNotMatch(page, /team\.webp|<iframe|project\.video/);
});

test("all static in-page links resolve to an existing section", async () => {
  const page = await source("app/page.tsx");
  const ids = new Set([...page.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  const fragments = [...page.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);

  assert.ok(fragments.length > 0);
  for (const fragment of fragments) {
    assert.ok(ids.has(fragment), `missing target for #${fragment}`);
  }
});

test("SEO, sharing, indexing, favicon, analytics, and 404 routes are present", async () => {
  const [layout, sitemap, robots, analytics, notFound] = await Promise.all([
    source("app/layout.tsx"),
    source("app/sitemap.ts"),
    source("app/robots.ts"),
    source("app/analytics.tsx"),
    source("app/not-found.tsx"),
  ]);

  assert.match(layout, /description/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /alternates: \{ canonical: "\/" \}/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(sitemap, /MetadataRoute\.Sitemap/);
  assert.match(sitemap, /"privacy", "terms", "accessibility"/);
  assert.match(robots, /sitemap:/);
  assert.match(analytics, /NEXT_PUBLIC_GA_ID/);
  assert.match(notFound, /This floor does not exist\./);
  await access(new URL("public/favicon.svg", root));
});

test("legal disclosures, analytics consent, and the Duetech credit are integrated", async () => {
  const [page, privacy, terms, accessibility, consent, analytics] = await Promise.all([
    source("app/page.tsx"),
    source("app/privacy/page.tsx"),
    source("app/terms/page.tsx"),
    source("app/accessibility/page.tsx"),
    source("app/cookie-consent.tsx"),
    source("app/analytics.tsx"),
  ]);

  assert.match(page, /href="\/privacy"/);
  assert.match(page, /href="\/terms"/);
  assert.match(page, /href="\/accessibility"/);
  assert.match(page, /Website by <strong>Duetech<\/strong>/);
  assert.match(privacy, /Information we collect/);
  assert.match(privacy, /Google Analytics only after you accept analytics cookies/);
  assert.match(terms, /Submitting an estimate request does not create/);
  assert.match(terms, /laws of the State of North Carolina/);
  assert.match(accessibility, /WCAG\) 2\.2 Level AA/);
  assert.match(accessibility, /Need assistance or found a barrier\?/);
  assert.match(consent, /Only necessary/);
  assert.match(consent, /Accept analytics/);
  assert.match(consent, /saveAnalyticsConsent/);
  assert.match(analytics, /consent !== "granted"/);
});

test("images, external links, and responsive breakpoints meet the accessibility contract", async () => {
  const [page, css] = await Promise.all([
    source("app/page.tsx"),
    source("app/globals.css"),
  ]);
  const imageTags = [...page.matchAll(/<img\b[\s\S]*?\/>/g)].map((match) => match[0]);
  const externalLinks = [...page.matchAll(/<a\b[\s\S]*?target="_blank"[\s\S]*?>/g)].map((match) => match[0]);

  assert.ok(imageTags.length >= 2);
  for (const tag of imageTags) assert.match(tag, /\balt=/, `image is missing alt: ${tag}`);
  for (const tag of externalLinks) assert.match(tag, /rel="noopener noreferrer"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(css, /@media \(max-width: 1024px\)/);
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(page, /schettini-logo-alt\.png/);
  assert.match(css, /\.footer-brand \{[^}]*background: transparent/);
});

test("Netlify and Next.js apply the HTTPS security header set", async () => {
  const [netlify, nextConfig] = await Promise.all([
    source("netlify.toml"),
    source("next.config.ts"),
  ]);

  for (const header of [
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
  ]) {
    assert.match(netlify, new RegExp(header));
    assert.match(nextConfig, new RegExp(header));
  }
});
