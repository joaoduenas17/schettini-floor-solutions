import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Schettini Floor Solutions | Concrete Flooring Specialists",
    template: "%s | Schettini Floor Solutions",
  },
  description:
    "Nationwide commercial and industrial concrete coatings, polished concrete, toppings, overlays, surface preparation, and moisture mitigation.",
  keywords: [
    "commercial concrete flooring",
    "industrial floor coatings",
    "polished concrete Charlotte",
    "epoxy floor coatings",
    "concrete surface preparation",
    "nationwide concrete flooring",
    "concrete flooring contractor USA",
  ],
  openGraph: {
    type: "website",
    siteName: "Schettini Floor Solutions",
    title: "Schettini Floor Solutions | Concrete Flooring Specialists",
    description:
      "High-performance concrete coatings, polished concrete, toppings, overlays, and surface preparation built for demanding spaces.",
    images: [{ url: "/images/hero-floor.webp", alt: "Commercial concrete floor by Schettini Floor Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Schettini Floor Solutions",
    description: "High-performance concrete flooring systems built to last.",
    images: ["/images/hero-floor.webp"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
