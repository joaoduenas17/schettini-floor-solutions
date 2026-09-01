"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

export const analyticsConsentKey = "schettini-analytics-consent";
export const analyticsConsentEvent = "schettini:analytics-consent";
export type AnalyticsConsent = "granted" | "denied";
export type AnalyticsConsentSnapshot = AnalyticsConsent | "unset" | "loading";
let volatileConsent: AnalyticsConsent | null = null;

export function getAnalyticsConsentSnapshot(): AnalyticsConsentSnapshot {
  if (typeof window === "undefined") return "loading";
  try {
    const storedConsent = window.localStorage.getItem(analyticsConsentKey);
    if (storedConsent === "granted" || storedConsent === "denied") {
      return storedConsent;
    }
  } catch {
    // Continue with an in-memory preference when browser storage is unavailable.
  }
  return volatileConsent || "unset";
}

export function getAnalyticsConsentServerSnapshot(): AnalyticsConsentSnapshot {
  return "loading";
}

export function subscribeToAnalyticsConsent(onStoreChange: () => void) {
  const handleConsent = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === analyticsConsentKey) onStoreChange();
  };

  window.addEventListener(analyticsConsentEvent, handleConsent);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(analyticsConsentEvent, handleConsent);
    window.removeEventListener("storage", handleStorage);
  };
}

export function saveAnalyticsConsent(value: AnalyticsConsent) {
  volatileConsent = value;
  try {
    window.localStorage.setItem(analyticsConsentKey, value);
  } catch {
    // The in-memory preference still applies for the current page session.
  }
  window.dispatchEvent(new CustomEvent(analyticsConsentEvent, { detail: value }));
}

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
  const consent = useSyncExternalStore(
    subscribeToAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    getAnalyticsConsentServerSnapshot,
  );

  if (!analyticsId || consent !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="schettini-google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${analyticsId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
