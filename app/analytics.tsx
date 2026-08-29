"use client";

import Script from "next/script";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const rawAnalyticsId = process.env.NEXT_PUBLIC_GA_ID?.trim() || "";
const analyticsId = /^G-[A-Z0-9]+$/i.test(rawAnalyticsId)
  ? rawAnalyticsId
  : "";

export function trackEvent(
  name: string,
  parameters: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, parameters);
}

export function Analytics() {
  if (!analyticsId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="schettini-google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${analyticsId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
