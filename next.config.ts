import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify runs the standard Next.js compiler. Keep its type-checking scope
  // focused on the web app and away from the optional Cloudflare/Vinext
  // scaffolding used by the Sites deployment.
  ...(process.env.NETLIFY === "true"
    ? { typescript: { tsconfigPath: "tsconfig.netlify.json" } }
    : {}),
};

export default nextConfig;
