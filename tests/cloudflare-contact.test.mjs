import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import worker from "../cloudflare/pages-worker.js";
import { prepareEstimateEmail } from "../app/estimate-email.ts";

const env = {
  CONTACT_MAILER: { fetch: async () => Response.json({ ok: true }) },
  TURNSTILE_SITE_KEY: "public-test-key", TURNSTILE_SECRET_KEY: "secret-test-key",
};
const valid = { name: "Test Customer", email: "test@example.com", service: "Polished Concrete", location: "Test City, NC", message: "A test estimate", turnstileToken: "test-token" };
function request(data = valid, origin = "https://schettinifs.com") {
  return new Request("https://schettinifs.com/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(data) });
}

test("an upload without email configuration exposes honest email-draft mode", async () => {
  const response = await worker.fetch(new Request("https://schettinifs.com/api/contact"), {});
  assert.deepEqual(await response.json(), { mode: "email", turnstileSiteKey: "" });
  const post = await worker.fetch(request(), {});
  assert.equal(post.status, 503);
  assert.equal((await post.json()).ok, false);
});

test("public configuration never returns the secret or mailer binding", async () => {
  const response = await worker.fetch(new Request("https://schettinifs.com/api/contact"), env);
  assert.deepEqual(await response.json(), { mode: "server", turnstileSiteKey: "public-test-key" });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("invalid and cross-origin inquiries never reach verification or delivery", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => { calls++; throw new Error("should not send"); });
  for (const data of [{ ...valid, name: "" }, { ...valid, email: "a@example.com\r\nBcc: b@example.com" }, { ...valid, service: "Injected" }, { ...valid, message: "x".repeat(1501) }, { ...valid, location: 123 }, { ...valid, turnstileToken: "" }]) {
    assert.equal((await worker.fetch(request(data), env)).status, 400);
  }
  assert.equal((await worker.fetch(request(valid, "https://unrelated.example"), env)).status, 403);
  assert.equal((await worker.fetch(request({ ...valid, website: "spam" }), env)).status, 200);
  assert.equal(calls, 0);
});

test("a valid inquiry is reported successful only after verified delivery", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ success: true, hostname: "schettinifs.com", action: "estimate-request" }));
  let delivered;
  const response = await worker.fetch(request(), { ...env, CONTACT_MAILER: { fetch: async (_url, init) => { delivered = JSON.parse(init.body); return Response.json({ ok: true }); } } });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(delivered.email, "test@example.com");
  assert.ok(!("turnstileToken" in delivered));
});

test("verification mismatches and delivery failures do not become success states", async (t) => {
  const mock = t.mock.method(globalThis, "fetch", async () => Response.json({ success: true, hostname: "wrong.example", action: "estimate-request" }));
  assert.equal((await worker.fetch(request(), env)).status, 403);
  mock.mock.mockImplementation(async () => Response.json({ success: true, hostname: "schettinifs.com", action: "wrong-action" }));
  assert.equal((await worker.fetch(request(), env)).status, 403);
  mock.mock.mockImplementation(async () => Response.json({ success: true, hostname: "schettinifs.com", action: "estimate-request" }));
  assert.equal((await worker.fetch(request(), { ...env, CONTACT_MAILER: { fetch: async () => Response.json({ ok: false }) } })).status, 502);
  assert.equal((await worker.fetch(request(), { ...env, CONTACT_MAILER: { fetch: async () => { throw new Error("delivery unavailable"); } } })).status, 502);
});

test("email drafts preserve symbols and project details without sending anything", () => {
  const form = new FormData();
  Object.entries({ ...valid, name: "João & Co", message: "Area: 1,000 ft²\nColor: A+B & C" }).forEach(([key, value]) => form.set(key, value));
  const draft = prepareEstimateEmail(form, "admin@schettinifloor.com");
  const url = new URL(draft.href);
  assert.equal(url.pathname, "admin@schettinifloor.com");
  assert.equal(url.searchParams.get("body"), draft.body);
  assert.match(draft.body, /1,000 ft²\nColor: A\+B & C/);
  assert.match(draft.body, /João & Co/);
});

test("the optional mailer is fixed to the owner mailbox, with no public route", async () => {
  const source = await readFile(new URL("../cloudflare/contact-mailer.js", import.meta.url), "utf8");
  const config = JSON.parse(await readFile(new URL("../cloudflare/wrangler.mailer.jsonc", import.meta.url), "utf8"));
  assert.match(source, /const recipient = "admin@schettinifloor.com"/);
  assert.equal(config.workers_dev, false);
  assert.equal(config.preview_urls, false);
  assert.equal(config.send_email[0].destination_address, "admin@schettinifloor.com");
});
