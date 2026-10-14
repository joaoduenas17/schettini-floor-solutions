const allowedServices = new Set(["Not sure yet", "Concrete Coatings", "Polished Concrete", "Toppings & Overlays", "Surface Preparation", "Moisture Mitigation"]);
const limits = { name: 100, company: 160, email: 254, phone: 40, service: 80, location: 120, message: 1500, website: 200, turnstileToken: 2048 };
const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;

function json(value, status = 200) {
  return Response.json(value, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/contact" && url.pathname !== "/api/contact/") return env.ASSETS.fetch(request);
    const configured = Boolean(env.CONTACT_MAILER && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
    if (request.method === "GET") return json({ mode: configured ? "server" : "email", turnstileSiteKey: configured ? env.TURNSTILE_SITE_KEY : "" });
    if (request.method !== "POST") return json({ ok: false }, 405);
    if (!configured) return json({ ok: false, error: "Email delivery is not configured." }, 503);
    // No cross-origin form submissions, and no personal data in URLs or logs.
    if (request.headers.get("Origin") !== url.origin) return json({ ok: false }, 403);
    if (!request.headers.get("Content-Type")?.startsWith("application/json")) return json({ ok: false }, 415);
    const declaredSize = Number(request.headers.get("Content-Length") || 0);
    if (declaredSize > 16000) return json({ ok: false }, 413);
    let data;
    try {
      const raw = await request.text();
      if (new TextEncoder().encode(raw).byteLength > 16000) return json({ ok: false }, 413);
      data = JSON.parse(raw);
    } catch { return json({ ok: false }, 400); }
    if (!data || typeof data !== "object" || Array.isArray(data)) return json({ ok: false }, 400);
    const fields = {};
    for (const [name, limit] of Object.entries(limits)) {
      if (data[name] !== undefined && typeof data[name] !== "string") return json({ ok: false }, 400);
      fields[name] = (data[name] || "").trim();
      if (fields[name].length > limit) return json({ ok: false }, 400);
    }
    if (fields.website) return json({ ok: true });
    if (!fields.name || !fields.location || !emailPattern.test(fields.email) || !allowedServices.has(fields.service) || !fields.turnstileToken) return json({ ok: false }, 400);
    try {
      const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: fields.turnstileToken }),
        signal: AbortSignal.timeout(8000),
      });
      const result = await verification.json();
      if (!verification.ok || !result.success || result.hostname !== url.hostname || result.action !== "estimate-request") return json({ ok: false }, 403);
      const { turnstileToken: unusedToken, website: unusedWebsite, ...estimate } = fields;
      const sent = await env.CONTACT_MAILER.fetch("https://contact-mailer.internal/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estimate),
        signal: AbortSignal.timeout(10000),
      });
      if (!sent.ok) return json({ ok: false }, 502);
      const accepted = await sent.json();
      return accepted.ok === true ? json({ ok: true }) : json({ ok: false }, 502);
    } catch { return json({ ok: false }, 502); }
  },
};
