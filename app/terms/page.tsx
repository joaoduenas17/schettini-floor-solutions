import type { Metadata } from "next";
import { LegalPage } from "../legal-page";
import { businessEmail, companyName } from "../site-config";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms governing use of the ${companyName} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsOfUse() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Use"
      summary="These terms govern access to and use of this website. Flooring services are governed by separate written estimates or agreements."
    >
      <section>
        <h2>1. Acceptance of these terms</h2>
        <p>
          By accessing this website, you agree to these Terms of Use. If you do not
          agree, please do not use the website. This website is operated by {companyName}.
        </p>
      </section>

      <section>
        <h2>2. Website information</h2>
        <p>
          Website content is provided for general informational and marketing purposes.
          Project photographs, descriptions, service information, coverage, timelines,
          and availability may change. Content is not professional engineering,
          architectural, environmental, or legal advice.
        </p>
      </section>

      <section>
        <h2>3. Estimates and flooring services</h2>
        <p>
          Submitting an estimate request does not create a customer relationship,
          guarantee availability, reserve a project date, or form a contract. Any scope,
          price, schedule, warranty, payment terms, and project-specific obligations must
          be stated in a separate written estimate or agreement. If these terms conflict
          with a signed customer agreement, the signed agreement controls for that project.
        </p>
      </section>

      <section>
        <h2>4. Permitted use</h2>
        <p>
          You may use the website only for lawful purposes. You may not interfere with
          its operation or security, attempt unauthorized access, submit malicious code,
          scrape the website at an unreasonable rate, impersonate another person, or use
          the website to violate another party’s rights.
        </p>
      </section>

      <section>
        <h2>5. Intellectual property</h2>
        <p>
          The website design, text, branding, graphics, project presentation, and other
          original content are owned by or licensed to {companyName} and are protected by
          applicable intellectual-property laws. You may not reproduce or use this
          content commercially without prior written permission.
        </p>
      </section>

      <section>
        <h2>6. Reviews, social media, and third-party links</h2>
        <p>
          Reviews and third-party content reflect the views of their respective authors.
          Links to external websites are provided for convenience and do not mean we
          control or endorse all content, policies, or practices on those websites.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer</h2>
        <p>
          To the fullest extent permitted by law, the website is provided “as is” and
          “as available.” We do not warrant that the website will always be uninterrupted,
          error-free, secure, or suitable for every purpose. Nothing in this section
          limits warranties that cannot legally be excluded.
        </p>
      </section>

      <section>
        <h2>8. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {companyName} will not be liable for
          indirect, incidental, special, consequential, or punitive damages arising from
          use of, or inability to use, this website. Project-related liability is governed
          by the applicable written customer agreement and law.
        </p>
      </section>

      <section>
        <h2>9. Governing law and changes</h2>
        <p>
          These website terms are governed by the laws of the State of North Carolina,
          without regard to conflict-of-law principles. We may update these terms by
          posting a revised version and changing the “Last updated” date.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          Questions about these terms may be sent to{" "}
          <a href={`mailto:${businessEmail}`}>{businessEmail}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
