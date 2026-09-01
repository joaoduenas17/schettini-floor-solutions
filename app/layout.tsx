import type { Metadata, Viewport } from "next";
import { Analytics } from "./analytics";
import { CookieConsent } from "./cookie-consent";
import {
  businessEmail,
  businessPhone,
  companyName,
  getSiteUrl,
  shortCompanyName,
  socialLinks,
} from "./site-config";
import "./globals.css";

const siteUrl = getSiteUrl();
const description =
  "Nationwide concrete coatings, polished concrete, toppings, overlays, surface preparation, and moisture mitigation for demanding commercial and industrial spaces.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: shortCompanyName,
  title: {
    default: "Schettini Floor Solutions | Concrete Flooring Specialists",
    template: "%s | Schettini Floor Solutions",
  },
  description,
  keywords: [
    "commercial concrete flooring",
    "industrial floor coatings",
    "polished concrete contractor",
    "epoxy floor coatings",
    "concrete surface preparation",
    "nationwide concrete flooring",
  ],
  authors: [{ name: shortCompanyName, url: siteUrl }],
  creator: shortCompanyName,
  publisher: companyName,
  category: "Construction",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    locale: "en_US",
    siteName: shortCompanyName,
    title: "Schettini Floor Solutions | Concrete Flooring Specialists",
    description:
      "High-performance concrete coatings, polished concrete, toppings, overlays, and surface preparation built for demanding spaces.",
    images: [
      {
        url: "/images/hero-floor.webp",
        width: 640,
        height: 639,
        alt: "Finished commercial concrete floor by Schettini Floor Solutions",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Schettini Floor Solutions",
    description: "High-performance concrete flooring systems built to last.",
    images: ["/images/hero-floor.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171918",
  colorScheme: "light dark",
};

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${siteUrl}/#business`,
  name: companyName,
  url: siteUrl,
  description,
  foundingDate: "2012",
  telephone: businessPhone,
  email: businessEmail,
  image: `${siteUrl}/images/hero-floor.webp`,
  logo: `${siteUrl}/images/schettini-logo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Charlotte",
    addressRegion: "NC",
    addressCountry: "US",
  },
  areaServed: { "@type": "Country", name: "United States" },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "estimates and customer service",
    telephone: businessPhone,
    email: businessEmail,
    areaServed: "US",
    availableLanguage: ["English", "Spanish"],
  },
  sameAs: [socialLinks.instagram, socialLinks.facebook],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Concrete flooring services",
    itemListElement: [
      "Concrete Coatings",
      "Polished Concrete",
      "Toppings & Overlays",
      "Surface Preparation",
      "Moisture Mitigation",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
