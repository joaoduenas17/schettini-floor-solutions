import type { Metadata } from "next";
import { LegalPage } from "../legal-page";
import {
  businessEmail,
  businessPhone,
  businessPhoneDisplay,
  companyName,
} from "../site-config";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: `${companyName} website accessibility statement and contact information for assistance.`,
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityStatement() {
  return (
    <LegalPage
      eyebrow="Accessibility"
      title="Accessibility Statement"
      summary={`${companyName} is committed to providing a website that is usable by the widest possible audience, including people with disabilities.`}
    >
      <section>
        <h2>Our approach</h2>
        <p>
          We aim to align this website with generally recognized accessibility
          practices, including relevant portions of the Web Content Accessibility
          Guidelines (WCAG) 2.2 Level AA. Accessibility is an ongoing process, and we
          review the website as content and technology change.
        </p>
      </section>

      <section>
        <h2>Measures included</h2>
        <ul>
          <li>Semantic page structure and descriptive headings.</li>
          <li>Keyboard-accessible navigation, controls, forms, and dialogs.</li>
          <li>Visible focus indicators and sufficient color contrast.</li>
          <li>Alternative text for meaningful images.</li>
          <li>Responsive layouts for desktop, tablet, and mobile devices.</li>
          <li>Reduced-motion support for visitors who request it.</li>
          <li>Form labels, validation messages, and status announcements for assistive technology.</li>
        </ul>
      </section>

      <section>
        <h2>Third-party content</h2>
        <p>
          Some embedded videos, review platforms, social networks, maps, or other
          third-party services may have accessibility features that we do not control.
          We welcome notice of a barrier involving third-party content so we can look
          for a reasonable alternative.
        </p>
      </section>

      <section>
        <h2>Need assistance or found a barrier?</h2>
        <p>
          Please contact us if you have difficulty accessing information or using a
          feature. Tell us what page or feature caused the issue and, if you are
          comfortable doing so, the browser or assistive technology you used. We will
          make a reasonable effort to provide the information or service another way.
        </p>
        <p>
          Email: <a href={`mailto:${businessEmail}`}>{businessEmail}</a><br />
          Phone: <a href={`tel:${businessPhone}`}>{businessPhoneDisplay}</a>
        </p>
      </section>

      <section>
        <h2>Ongoing improvements</h2>
        <p>
          We may update this statement as accessibility work is completed or the website
          changes. Feedback helps us identify and prioritize improvements.
        </p>
      </section>
    </LegalPage>
  );
}
