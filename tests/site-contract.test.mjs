import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("the contact experience is email-first and contains no WhatsApp flow", async () => {
  const [page, css] = await Promise.all([
    source("app/page.tsx"),
    source("app/globals.css"),
  ]);

  assert.doesNotMatch(`${page}\n${css}`, /whatsapp|wa\.me/i);
  assert.match(page, /mailto:/);
  assert.match(page, /name="estimate-request"/);
  assert.match(page, /type="email" name="email"/);
  assert.match(page, /formStatus === "submitting"/);
  assert.match(page, /formStatus === "success"/);
  assert.match(page, /formStatus === "error"/);
  assert.match(page, /id="estimate-email"/);
  assert.match(page, /handleEmailCta/);
});

test("scroll reveals and the decorative project video are wired to the intended elements", async () => {
  const [page, css] = await Promise.all([
    source("app/page.tsx"),
    source("app/globals.css"),
  ]);

  assert.match(page, /IntersectionObserver/);
  assert.match(page, /data-reveal/);
  assert.match(css, /\.motion-ready \[data-reveal\]/);
  assert.match(page, /title: "Decorative Floor System"[\s\S]*?video: true/);
  assert.match(page, /project\.video \? `Play/);
  assert.doesNotMatch(page, /about-video-trigger/);
  assert.match(page, /className="about-team-image"/);
  assert.match(css, /aspect-ratio: 9 \/ 16/);
});

test("Netlify form blueprint matches every submitted field", async () => {
  const [page, blueprint] = await Promise.all([
    source("app/page.tsx"),
    source("public/form-detection.html"),
  ]);
  const expectedFields = [
    "form-name",
    "website",
    "name",
    "company",
    "email",
    "phone",
    "service",
    "location",
    "message",
  ];

  for (const field of expectedFields) {
    const fieldPattern = new RegExp(`name=["']${field}["']`);
    assert.match(page, fieldPattern, `interactive form is missing ${field}`);
    assert.match(blueprint, fieldPattern, `static form is missing ${field}`);
  }

  assert.match(blueprint, /data-netlify="true"/);
  assert.match(blueprint, /data-netlify-honeypot="website"/);
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
  assert.match(robots, /sitemap:/);
  assert.match(analytics, /NEXT_PUBLIC_GA_ID/);
  assert.match(notFound, /This floor does not exist\./);
  await access(new URL("public/favicon.svg", root));
});

test("images, external links, video, and responsive breakpoints meet the accessibility contract", async () => {
  const [page, css] = await Promise.all([
    source("app/page.tsx"),
    source("app/globals.css"),
  ]);
  const imageTags = [...page.matchAll(/<img\b[\s\S]*?\/>/g)].map((match) => match[0]);
  const externalLinks = [...page.matchAll(/<a\b[\s\S]*?target="_blank"[\s\S]*?>/g)].map((match) => match[0]);

  assert.ok(imageTags.length >= 4);
  for (const tag of imageTags) assert.match(tag, /\balt=/, `image is missing alt: ${tag}`);
  for (const tag of externalLinks) assert.match(tag, /rel="noopener noreferrer"/);
  assert.match(page, /<iframe[\s\S]*?title="Schettini Floor Solutions epoxy floor project video"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(css, /@media \(max-width: 1024px\)/);
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
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
