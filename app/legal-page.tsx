/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ReactNode } from "react";
import { companyName } from "./site-config";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
};

const lastUpdated = "September 1, 2026";

export function LegalPage({ eyebrow, title, summary, children }: LegalPageProps) {
  return (
    <>
      <header className="legal-header">
        <div className="shell legal-header-inner">
          <Link className="legal-brand" href="/" aria-label="Schettini Floor Solutions home">
            <img src="/images/schettini-logo.png" alt="Schettini Floor Solutions" width="900" height="718" />
          </Link>
          <Link className="legal-back" href="/">Back to main site <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <main id="main-content" className="legal-page">
        <div className="shell legal-grid">
          <aside className="legal-sidebar">
            <p>{eyebrow}</p>
            <span>Last updated {lastUpdated}</span>
            <nav aria-label="Legal pages">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Use</Link>
              <Link href="/accessibility">Accessibility</Link>
            </nav>
          </aside>

          <article className="legal-content">
            <header>
              <h1>{title}</h1>
              <p>{summary}</p>
            </header>
            {children}
          </article>
        </div>
      </main>

      <footer className="legal-footer">
        <div className="shell">
          <span>© 2026 {companyName}</span>
          <span>Website by <strong>Duetech</strong></span>
        </div>
      </footer>
    </>
  );
}
