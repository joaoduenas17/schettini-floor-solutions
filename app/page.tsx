"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const services = [
  { number: "01", title: "Concrete Coatings", description: "Resinous and decorative coating systems engineered for demanding commercial, industrial, and residential spaces." },
  { number: "02", title: "Polished Concrete", description: "Durable, low-maintenance concrete finishes that balance long-term performance with a clean, modern appearance." },
  { number: "03", title: "Toppings & Overlays", description: "Specialized resurfacing and leveling systems that renew existing slabs without unnecessary replacement." },
  { number: "04", title: "Surface Preparation", description: "Concrete grinding, coating removal, and shot blasting that create the right foundation for every system." },
  { number: "05", title: "Moisture Mitigation", description: "Substrate assessment, moisture-control solutions, and self-leveling systems for reliable installations." },
];

const projects = [
  { id: 1, title: "Polished Aggregate Finish", category: "Polished Concrete", segment: "Commercial", image: "/images/project-polished.webp", alt: "Close-up of a polished aggregate concrete floor installed by Schettini Floor Solutions", summary: "A refined, durable finish designed to turn the existing slab into the finished floor." },
  { id: 2, title: "High-Build Floor System", category: "Coatings", segment: "Industrial", image: "/images/project-coating.webp", alt: "Glossy concrete coating project by Schettini Floor Solutions", summary: "A seamless coating system selected for dependable performance and easier maintenance." },
  { id: 3, title: "Commercial Concrete Finish", category: "Polished Concrete", segment: "Commercial", image: "/images/project-commercial.webp", alt: "Finished commercial concrete floor in a large interior space", summary: "A clean concrete finish built for a busy customer-facing environment." },
  { id: 4, title: "Decorative Floor System", category: "Coatings", segment: "Commercial", image: "/images/project-decorative.webp", alt: "Decorative concrete flooring project by Schettini Floor Solutions", summary: "A distinctive decorative system that balances visual character with everyday durability." },
];

const filters = ["All", "Coatings", "Polished Concrete"];

const reviews = [
  { quote: "From large-scale projects for big builders to smaller ones, always great quality.", author: "Andreea Maleady", detail: "Local Guide" },
  { quote: "They worked with my schedule to provide the best finished product.", author: "Ben Dunn", detail: "Google review" },
  { quote: "After eight years, my garage floor still looked brand new.", author: "Jennifer Sawyer", detail: "Residential client" },
];

const processSteps = [
  { number: "01", title: "Assess", text: "We learn how the space is used, inspect the slab, and define the performance requirements." },
  { number: "02", title: "Prepare", text: "We mechanically prepare the concrete and address the conditions that can compromise the system." },
  { number: "03", title: "Install", text: "Our team installs the selected coating, polish, topping, or overlay with disciplined execution." },
  { number: "04", title: "Deliver", text: "We complete a final walkthrough and leave you with a floor ready for the demands of the space." },
];

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Schettini Floor Solutions LLC",
  description:
    "Commercial, industrial, and residential concrete coatings, polished concrete, toppings, overlays, surface preparation, and moisture mitigation.",
  foundingDate: "2012",
  telephone: "+1-704-962-5681",
  email: "accounting@schettinifloor.com",
  image: "/images/hero-floor.webp",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Charlotte",
    addressRegion: "NC",
    addressCountry: "US",
  },
  areaServed: { "@type": "Country", name: "United States" },
  sameAs: [
    "https://www.instagram.com/schettinifloorsolutions/",
    "https://www.facebook.com/Schettinifloorsolutions/",
  ],
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeProject, setActiveProject] = useState<(typeof projects)[number] | null>(null);
  const visibleProjects = activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter);

  useEffect(() => {
    if (!activeProject) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProject(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [activeProject]);

  const handleEstimate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const company = String(form.get("company") || "").trim();
    const contact = String(form.get("contact") || "").trim();
    const service = String(form.get("service") || "Not sure yet").trim();
    const location = String(form.get("location") || "").trim();
    const message = String(form.get("message") || "").trim();
    const lines = [
      "Hello Schettini Floor Solutions — I would like a free estimate.",
      `Name: ${name}`,
      company ? `Company: ${company}` : "",
      `Phone / email: ${contact}`,
      `Service: ${service}`,
      `Project location: ${location}`,
      message ? `Project details: ${message}` : "",
    ].filter(Boolean);
    window.open(`https://wa.me/17049625681?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <div className="utility-bar">
        <div className="shell utility-inner">
          <p>Based in Charlotte · Nationwide Service</p>
          <a href="tel:+17049625681">Call (704) 962-5681</a>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="Schettini Floor Solutions home">
            <img src="/images/schettini-logo.png" alt="Schettini Floor Solutions" />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#services">Services</a><a href="#projects">Projects</a><a href="#about">About</a><a href="#reviews">Reviews</a>
          </nav>
          <a className="button button-small" href="#contact">Get a Free Estimate</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-overlay" />
        <div className="shell hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Commercial & Industrial Flooring Specialists</p>
            <h1>High-performance concrete floors, built to last.</h1>
            <p className="hero-lead">Coatings, polished concrete, toppings, overlays, and surface preparation delivered with the experience demanding spaces require.</p>
            <div className="hero-actions">
              <a className="button" href="#contact">Request a Free Estimate <span>↗</span></a>
              <a className="text-link" href="#projects">Explore our work <span>↓</span></a>
            </div>
            <p className="residential-note">Residential projects are also available.</p>
          </div>
          <aside className="hero-proof" aria-label="Company highlights">
            <p className="proof-label">Built on experience</p><strong>Since 2012</strong><div className="proof-rule" />
            <div className="proof-rating"><span className="stars" aria-label="5 out of 5 stars">★★★★★</span><span>5.0 Google rating</span></div>
          </aside>
        </div>
      </section>

      <section className="trust-strip" aria-label="Company credentials">
        <div className="shell trust-grid">
          <div><strong>14+</strong><span>Years in business</span></div><div><strong>A+</strong><span>BBB Accredited</span></div><div><strong>13</strong><span>Five-star Google reviews</span></div><div><strong>USA</strong><span>Nationwide service</span></div>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="shell">
          <div className="section-heading">
            <div><p className="eyebrow dark"><span /> What we do</p><h2>Complete systems.<br />One accountable team.</h2></div>
            <p>Every durable floor starts below the finish. We assess the slab, prepare it correctly, and install the system that fits the environment.</p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.description}</p>
                <a href="#contact" aria-label={`Ask about ${service.title}`}>Discuss your project <span>↗</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="projects section" id="projects">
        <div className="shell">
          <div className="projects-heading">
            <div><p className="eyebrow light"><span /> Selected work</p><h2>Real floors.<br />Built for real demands.</h2></div>
            <p>Explore a selection of completed work from the Schettini team. Choose a category to focus the gallery.</p>
          </div>
          <div className="gallery-toolbar" aria-label="Filter projects by category">
            {filters.map((filter) => (
              <button className={activeFilter === filter ? "active" : ""} key={filter} onClick={() => setActiveFilter(filter)} type="button" aria-pressed={activeFilter === filter}>{filter}</button>
            ))}
          </div>
          <div className="project-grid">
            {visibleProjects.map((project) => (
              <button className="project-card" key={project.id} type="button" onClick={() => setActiveProject(project)} aria-label={`View ${project.title}`}>
                <img src={project.image} alt={project.alt} loading="lazy" /><span className="project-shade" />
                <span className="project-meta"><span className="project-kicker">{project.category} · {project.segment}</span><strong>{project.title}</strong><span className="project-view">View project <b>↗</b></span></span>
              </button>
            ))}
          </div>
          <p className="gallery-note">More project categories and full case studies will be added as the archive is prepared.</p>
        </div>
      </section>

      <section className="markets section" aria-labelledby="markets-title">
        <div className="shell markets-grid">
          <div className="markets-intro">
            <p className="eyebrow dark"><span /> Who we serve</p><h2 id="markets-title">Performance first, in every environment.</h2>
            <p>Commercial and industrial projects are our primary focus. We also bring the same preparation standards and attention to detail to select residential work.</p>
            <a className="arrow-link" href="#contact">Tell us about your space <span>↗</span></a>
          </div>
          <div className="market-list">
            <article><span>01</span><div><h3>Commercial</h3><p>Retail, hospitality, offices, and customer-facing facilities.</p></div></article>
            <article><span>02</span><div><h3>Industrial</h3><p>Warehouses, production spaces, and hard-working operational floors.</p></div></article>
            <article><span>03</span><div><h3>Residential</h3><p>Garages and select specialty concrete-floor projects by appointment.</p></div></article>
          </div>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="shell about-grid">
          <div className="about-image"><img src="/images/team.webp" alt="Schettini Floor Solutions team working together on site" loading="lazy" /><div className="about-badge"><strong>A+</strong><span>BBB Accredited</span></div></div>
          <div className="about-copy">
            <p className="eyebrow light"><span /> The Schettini standard</p><h2>Experienced hands. Straight answers.</h2>
            <p className="about-lead">Schettini Floor Solutions is a locally owned concrete-flooring company built on disciplined preparation, honest guidance, and quality execution.</p>
            <div className="about-points">
              <div><strong>Locally owned</strong><span>Based in Charlotte and serving clients nationwide since 2012.</span></div>
              <div><strong>Detail driven</strong><span>Every recommendation starts with the slab and the demands of the space.</span></div>
              <div><strong>Responsive</strong><span>Flexible scheduling and clear communication from estimate to walkthrough.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="process section" aria-labelledby="process-title">
        <div className="shell">
          <div className="process-heading">
            <div><p className="eyebrow dark"><span /> Our process</p><h2 id="process-title">The finish is only as good as the process.</h2></div>
            <p>A dependable floor is the result of careful evaluation, thorough preparation, and an installation plan matched to the space.</p>
          </div>
          <div className="process-grid">{processSteps.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
        </div>
      </section>

      <section className="reviews section" id="reviews">
        <div className="shell">
          <div className="reviews-top">
            <div><p className="eyebrow dark"><span /> Client feedback</p><h2>Work that earns trust.</h2></div>
            <div className="google-summary"><strong>5.0</strong><div><span className="stars" aria-label="5 out of 5 stars">★★★★★</span><p>Based on 13 Google reviews</p></div></div>
          </div>
          <div className="review-grid">
            {reviews.map((review) => <article className="review-card" key={review.author}><span className="stars" aria-hidden="true">★★★★★</span><blockquote>“{review.quote}”</blockquote><footer><strong>{review.author}</strong><span>{review.detail}</span></footer></article>)}
          </div>
          <div className="review-action"><a className="arrow-link" href="https://www.google.com/maps/search/?api=1&query=Schettini+Floor+Solutions+LLC+Charlotte+NC" target="_blank" rel="noreferrer">Read all reviews on Google <span>↗</span></a></div>
        </div>
      </section>

      <section className="coverage section" aria-labelledby="coverage-title">
        <div className="shell coverage-grid">
          <div><p className="eyebrow light"><span /> Service area</p><h2 id="coverage-title">Based in Charlotte.<br />Built to travel.</h2></div>
          <div className="coverage-copy">
            <p>Serving commercial, industrial, and select residential clients nationwide.</p>
            <div className="coverage-states"><div><strong>USA</strong><span>Nationwide service</span></div><div><strong>Charlotte</strong><span>Home base</span></div></div>
            <p className="coverage-note">No public showroom. On-site consultations are scheduled by appointment.</p>
          </div>
        </div>
      </section>

      <section className="faq section" aria-labelledby="faq-title">
        <div className="shell faq-grid">
          <div><p className="eyebrow dark"><span /> Common questions</p><h2 id="faq-title">Planning a flooring project?</h2></div>
          <div className="faq-list">
            <details><summary>Do you handle residential projects?<span>+</span></summary><p>Yes. Commercial and industrial work is our primary focus, but we also accept select residential projects, including garage floors.</p></details>
            <details><summary>What areas do you serve?<span>+</span></summary><p>We are based in Charlotte, North Carolina, and take on projects nationwide. Availability depends on project scope, schedule, and location.</p></details>
            <details><summary>Can you work around an operating schedule?<span>+</span></summary><p>Project schedules are coordinated directly with each client. Tell us about operational or access constraints during the estimate process.</p></details>
            <details><summary>How do I know which floor system I need?<span>+</span></summary><p>You do not need to decide before contacting us. We assess the space, substrate, traffic, maintenance needs, and desired finish before recommending a system.</p></details>
          </div>
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="shell contact-grid">
          <div className="contact-copy">
            <p className="eyebrow light"><span /> Start a conversation</p><h2>Tell us what the floor needs to do.</h2>
            <p>Share the project location, type of space, approximate size, and any timing constraints. We will follow up to discuss the right next step.</p>
            <div className="contact-direct">
              <a href="tel:+17049625681"><span>Call or WhatsApp</span><strong>(704) 962-5681</strong></a>
              <a href="mailto:accounting@schettinifloor.com"><span>Email</span><strong>accounting@schettinifloor.com</strong></a>
              <div><span>Availability</span><strong>By appointment</strong></div>
            </div>
          </div>
          <form className="estimate-form" onSubmit={handleEstimate}>
            <div className="form-row"><label>Name <span>*</span><input name="name" autoComplete="name" required placeholder="Your name" /></label><label>Company<input name="company" autoComplete="organization" placeholder="Company or organization" /></label></div>
            <label>Phone or email <span>*</span><input name="contact" required placeholder="How should we reach you?" /></label>
            <div className="form-row"><label>Service<select name="service" defaultValue="Not sure yet"><option>Not sure yet</option>{services.map((service) => <option key={service.title}>{service.title}</option>)}</select></label><label>Project location <span>*</span><input name="location" required placeholder="City, State" /></label></div>
            <label>Project details<textarea name="message" rows={4} placeholder="Type of space, approximate square footage, timeline, and current floor condition" /></label>
            <button className="button form-button" type="submit">Continue in WhatsApp <span>↗</span></button>
            <p className="form-note">Submitting opens WhatsApp with your project details. No message is sent until you approve it.</p>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-main">
          <a className="footer-brand" href="#top" aria-label="Back to top"><img src="/images/schettini-logo-alt.png" alt="Schettini Floor Solutions" loading="lazy" /></a>
          <p>Concrete flooring solutions for demanding commercial, industrial, and residential spaces.</p>
          <div className="footer-links"><a href="https://www.instagram.com/schettinifloorsolutions/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.facebook.com/Schettinifloorsolutions/" target="_blank" rel="noreferrer">Facebook ↗</a><a href="tel:+17049625681">(704) 962-5681</a></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Schettini Floor Solutions LLC</span><span>Charlotte, North Carolina · Nationwide service · By appointment</span></div>
      </footer>

      <a className="whatsapp-float" href="https://wa.me/17049625681?text=Hello%20Schettini%20Floor%20Solutions%20%E2%80%94%20I%20would%20like%20to%20discuss%20a%20flooring%20project." target="_blank" rel="noreferrer" aria-label="Contact Schettini Floor Solutions on WhatsApp"><span>WhatsApp</span><b>↗</b></a>

      {activeProject && (
        <div className="project-modal" role="dialog" aria-modal="true" aria-label={activeProject.title} onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProject(null); }}>
          <div className="modal-card">
            <button className="modal-close" type="button" onClick={() => setActiveProject(null)} aria-label="Close project" autoFocus>×</button>
            <div className="modal-image"><img src={activeProject.image} alt={activeProject.alt} /></div>
            <div className="modal-copy"><span>{activeProject.category} · {activeProject.segment}</span><h2>{activeProject.title}</h2><p>{activeProject.summary}</p><a className="arrow-link" href="#contact" onClick={() => setActiveProject(null)}>Discuss a similar project <span>↗</span></a></div>
          </div>
        </div>
      )}
    </main>
  );
}
