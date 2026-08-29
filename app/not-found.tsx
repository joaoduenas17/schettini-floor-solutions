import type { Metadata } from "next";
import Link from "next/link";
import {
  businessEmail,
  businessPhone,
  businessPhoneDisplay,
} from "./site-config";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const emailHref = `mailto:${businessEmail}?subject=${encodeURIComponent("Website inquiry")}`;

  return (
    <main className="not-found-page" id="main-content">
      <div className="not-found-grid" aria-hidden="true" />
      <div className="not-found-content">
        <Link className="not-found-brand" href="/" aria-label="Schettini Floor Solutions home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/schettini-logo.png" alt="Schettini Floor Solutions" width="900" height="718" />
        </Link>
        <p className="not-found-code">404 · Wrong turn</p>
        <h1>This floor does not exist.</h1>
        <p>The page may have moved, but the right flooring solution is still one click away.</p>
        <div className="not-found-actions">
          <Link className="button" href="/">Return home <span aria-hidden="true">↗</span></Link>
          <a className="text-link" href={emailHref}>Email our team</a>
        </div>
        <div className="not-found-contact"><a href={`tel:${businessPhone}`}>{businessPhoneDisplay}</a><span>·</span><a href={emailHref}>{businessEmail}</a></div>
      </div>
    </main>
  );
}
