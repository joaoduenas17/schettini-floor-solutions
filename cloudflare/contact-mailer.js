import { EmailMessage } from "cloudflare:email";

const recipient = "admin@schettinifloor.com";
const sender = "estimates@schettinifs.com";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
    try {
      const data = await request.json();
      if (!data || typeof data !== "object" || !/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(data.email || "")) return Response.json({ ok: false }, { status: 400 });
      const body = [
        "A new flooring estimate request was submitted at schettinifs.com.", "",
        `Name: ${data.name}`, `Company: ${data.company || "Not provided"}`,
        `Email: ${data.email}`, `Phone: ${data.phone || "Not provided"}`,
        `Service: ${data.service}`, `Project location: ${data.location}`, "",
        "Project details:", data.message || "To be discussed.",
      ].join("\n");
      const bytes = new TextEncoder().encode(body);
      const encodedBody = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
      const mime = [
        `From: Schettini Floor Solutions <${sender}>`, `To: ${recipient}`,
        `Reply-To: ${data.email}`, "Subject: New flooring estimate request",
        "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8",
        "Content-Transfer-Encoding: base64", "", encodedBody,
      ].join("\r\n");
      await env.EMAIL.send(new EmailMessage(sender, recipient, mime));
      return Response.json({ ok: true });
    } catch { return Response.json({ ok: false }, { status: 502 }); }
  },
};
