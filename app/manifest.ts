import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Schettini Floor Solutions",
    short_name: "Schettini Floors",
    description: "Nationwide high-performance concrete flooring solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f1ed",
    theme_color: "#171918",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
