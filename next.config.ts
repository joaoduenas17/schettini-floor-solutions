import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Netlify runs the standard Next.js compiler. Keep its type-checking scope
  // focused on the web app and away from the optional Cloudflare/Vinext
  // scaffolding used by the Sites deployment.
  ...(process.env.NETLIFY === "true"
    ? { typescript: { tsconfigPath: "tsconfig.netlify.json" } }
    : {}),
};

export default nextConfig;
