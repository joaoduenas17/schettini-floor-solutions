"use client";

import { useState, useSyncExternalStore } from "react";
import {
  getAnalyticsConsentServerSnapshot,
  getAnalyticsConsentSnapshot,
  saveAnalyticsConsent,
  subscribeToAnalyticsConsent,
  type AnalyticsConsent,
} from "./analytics";

const rawAnalyticsId = process.env.NEXT_PUBLIC_GA_ID?.trim() || "";
const analyticsConfigured = /^G-[A-Z0-9]+$/i.test(rawAnalyticsId);

export function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribeToAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    getAnalyticsConsentServerSnapshot,
  );
  const [isEditing, setIsEditing] = useState(false);

  if (!analyticsConfigured || consent === "loading") return null;

  const savePreference = (value: AnalyticsConsent) => {
    saveAnalyticsConsent(value);
    setIsEditing(false);
  };

  if (consent !== "unset" && !isEditing) {
    return (
      <button className="cookie-settings-toggle" type="button" onClick={() => setIsEditing(true)}>
        Cookie settings
      </button>
    );
  }

  return (
    <section className="cookie-banner" aria-label="Cookie preferences">
      <div className="shell cookie-banner-inner">
        <div>
          <strong>Your privacy choices</strong>
          <p>
            We use optional analytics cookies only with your permission. Necessary
            technologies keep the website and estimate form working. Read our{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
        <div className="cookie-actions">
          <button type="button" className="cookie-secondary" onClick={() => savePreference("denied")}>
            Only necessary
          </button>
          <button type="button" className="cookie-primary" onClick={() => savePreference("granted")}>
            Accept analytics
          </button>
        </div>
      </div>
    </section>
  );
}
