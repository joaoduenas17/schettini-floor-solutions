import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { usStates, otherCity, formatProjectLocation, projectLocationFromForm, loadStateCities } from "../app/project-location-data.ts";
import { prepareEstimateEmail } from "../app/estimate-email.ts";

test("the catalog covers every state and DC, with city lists scoped to their state", async () => {
  assert.equal(usStates.length, 51);
  assert.equal(new Set(usStates.map((state) => state.code)).size, 51);
  let count = 0;
  for (const state of usStates) {
    const data = JSON.parse(await readFile(new URL(`../public/locations/2026/${state.code.toLowerCase()}.json`, import.meta.url), "utf8"));
    assert.equal(data.state, state.code);
    assert.ok(data.cities.length);
    assert.equal(new Set(data.cities).size, data.cities.length);
    assert.ok(data.cities.every((city) => typeof city === "string" && city.trim() && city.length <= 100));
    count += data.cities.length;
    if (state.code === "NC") assert.ok(data.cities.includes("Charlotte"));
    if (state.code === "SC") assert.ok(data.cities.includes("Charleston"));
    if (state.code === "DC") assert.ok(data.cities.includes("Washington"));
  }
  assert.ok(count > 25000);
});

test("state and city remain together in the email request", () => {
  const fields = new FormData();
  fields.set("projectState", "NC"); fields.set("projectCity", "Charlotte");
  fields.set("location", projectLocationFromForm(fields));
  const draft = prepareEstimateEmail(fields, "admin@schettinifloor.com");
  assert.ok(draft.body.includes("Project location: Charlotte, NC"));
  assert.ok(decodeURIComponent(draft.href).includes("Charlotte, NC"));
  assert.equal(formatProjectLocation("", "Charlotte"), "");
  assert.equal(formatProjectLocation("XX", "Charlotte"), "");
  assert.equal(formatProjectLocation("NC", "  "), "");
});

test("unlisted towns and failed list loading preserve a manually entered location", () => {
  const fields = new FormData();
  fields.set("projectState", "VA"); fields.set("projectCity", otherCity);
  assert.equal(projectLocationFromForm(fields), "");
  fields.set("projectCityOther", "  Unlisted town  ");
  assert.equal(projectLocationFromForm(fields), "Unlisted town, VA");
  fields.set("projectCity", "Entered town");
  assert.equal(projectLocationFromForm(fields), "Entered town, VA");
  assert.equal(formatProjectLocation("VA", "x".repeat(101)), "");
});

test("city requests use the website's static files and honor cancellation", async (t) => {
  const controller = new AbortController();
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "/locations/2026/nc.json");
    assert.equal(options.signal, controller.signal);
    return Response.json({ state: "NC", cities: ["Charlotte", "Raleigh"] });
  });
  assert.deepEqual(await loadStateCities("NC", controller.signal), ["Charlotte", "Raleigh"]);
  await assert.rejects(loadStateCities("XX", controller.signal), /Unknown state/);
});

test("unavailable or mismatched city files fail safely", async (t) => {
  const signal = new AbortController().signal;
  t.mock.method(globalThis, "fetch", async () => new Response("Not found", { status: 404 }));
  await assert.rejects(loadStateCities("NC", signal), /unavailable/);
  globalThis.fetch = async () => Response.json({ state: "SC", cities: ["Charleston"] });
  await assert.rejects(loadStateCities("NC", signal), /Invalid city list/);
  globalThis.fetch = async () => Response.json({ state: "NC", cities: [null] });
  await assert.rejects(loadStateCities("NC", signal), /Invalid city list/);
});
