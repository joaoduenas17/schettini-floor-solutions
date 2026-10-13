"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent as ReactMouseEvent } from "react";
import { ProjectPicture } from "./project-picture";
import { filters, heroPhoto, projects, type Project } from "./projects";
import { Turnstile } from "./turnstile";
import { prepareEstimateEmail } from "./estimate-email";
import { trackEvent } from "./analytics";
import {
  businessEmail,
  businessPhone,
  businessPhoneDisplay,
  socialLinks,
} from "./site-config";

const services = [
  { number: "01", title: "Concrete Coatings", description: "Resinous and decorative coating systems engineered for demanding commercial, industrial, and residential spaces." },
  { number: "02", title: "Polished Concrete", description: "Durable, low-maintenance concrete finishes that balance long-term performance with a clean, modern appearance." },
  { number: "03", title: "Toppings & Overlays", description: "Specialized resurfacing and leveling systems that renew existing slabs without unnecessary replacement." },
  { number: "04", title: "Surface Preparation", description: "Concrete grinding, coating removal, and shot blasting that create the right foundation for every system." },
  { number: "05", title: "Moisture Mitigation", description: "Substrate assessment, moisture-control solutions, and self-leveling systems for reliable installations." },
];

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

const directEmailHref = `mailto:${businessEmail}?subject=${encodeURIComponent("Flooring project estimate request")}`;

type FormStatus = "idle" | "submitting" | "success" | "error" | "draft";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [deliveryMode, setDeliveryMode] = useState<"email" | "server">("email");
  const [turnstileSiteKey, setTurnstileSiteKey] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [emailDraft, setEmailDraft] = useState<{ href: string; body: string } | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const projectTriggerRef = useRef<HTMLButtonElement | null>(null);
  const projectDialogRef = useRef<HTMLDivElement | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const visibleProjects = activeFilter === "All" ? projects : projects.filter((project) => project.tags.includes(activeFilter));
  const activePhoto = activeProject?.photos[activePhotoIndex];

  const closeProject = () => {
    setActiveProject(null);
    requestAnimationFrame(() => projectTriggerRef.current?.focus());
  };

  const navigatePhoto = (direction: number) => {
    if (!activeProject || activeProject.photos.length < 2) return;
    setPhotoLoading(true);
    setPhotoError(false);
    setActivePhotoIndex((index) => (index + direction + activeProject.photos.length) % activeProject.photos.length);
  };

  const closeMobileMenu = (restoreFocus = false) => {
    setIsMobileMenuOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuTriggerRef.current?.focus());
  };

  const handleEmailCta = (event: ReactMouseEvent<HTMLAnchorElement>, placement: string) => {
    event.preventDefault();
    closeMobileMenu();
    const contactSection = document.getElementById("contact");
    const emailInput = document.getElementById("estimate-email") as HTMLInputElement | null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.history.replaceState(null, "", "#contact");
    contactSection?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => emailInput?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
    trackEvent("email_click", { placement, destination: "estimate_form" });
  };

  useEffect(() => {
    const hasOverlay = Boolean(activeProject || isMobileMenuOpen);
    if (!hasOverlay) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeProject) closeProject();
        else closeMobileMenu(true);
      }
      if (!activeProject) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        navigatePhoto(event.key === "ArrowRight" ? 1 : -1);
      }
      if (event.key === "Tab") {
        const elements = projectDialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
        if (!elements?.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [activeProject, isMobileMenuOpen]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/contact", { signal: controller.signal })
      .then(async (response) => response.ok ? response.json() : null)
      .then((config) => {
        if (config?.mode === "server" && typeof config.turnstileSiteKey === "string") {
          setDeliveryMode("server");
          setTurnstileSiteKey(config.turnstileSiteKey);
        }
      }).catch(() => { /* Direct email stays available on a static host. */ });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    revealElements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  const handleEstimate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    if (formStatus === "submitting") return;
    const draft = prepareEstimateEmail(formData, businessEmail);
    setEmailDraft(draft);
    setCopyStatus("");
    if (deliveryMode === "email") {
      setFormStatus("draft");
      window.location.href = draft.href;
      trackEvent("estimate_email_prepared", { method: "email_draft" });
      return;
    }

    setFormStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(formData), turnstileToken }),
        signal: AbortSignal.timeout(20000),
      });

      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("The request was not accepted.");
      formElement.reset();
      setFormStatus("success");
      trackEvent("estimate_request_submitted", { method: "website_form" });
    } catch {
      setFormStatus("error");
      trackEvent("estimate_request_error", { method: "website_form" });
    }
  };

  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <p>Based in Charlotte · Nationwide Service</p>
          <a href="#contact" onClick={(event) => handleEmailCta(event, "utility_bar")}>Email us</a>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="Schettini Floor Solutions home">
            <img src="/images/schettini-logo.png" alt="Schettini Floor Solutions" width="900" height="718" />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#services">Services</a><a href="#projects">Projects</a><a href="#about">About</a><a href="#reviews">Reviews</a>
          </nav>
          <div className="header-actions">
            <a className="button button-small header-cta" href="#contact">Get a Free Estimate</a>
            <button
              ref={menuTriggerRef}
              className="menu-toggle"
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
        <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" hidden={!isMobileMenuOpen}>
          <div className="shell">
            <a href="#services" onClick={() => closeMobileMenu()}>Services</a>
            <a href="#projects" onClick={() => closeMobileMenu()}>Projects</a>
            <a href="#about" onClick={() => closeMobileMenu()}>About</a>
            <a href="#reviews" onClick={() => closeMobileMenu()}>Reviews</a>
            <a href="#contact" onClick={() => closeMobileMenu()}>Contact</a>
            <a href="#contact" onClick={(event) => handleEmailCta(event, "mobile_menu")}>Email us ↗</a>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <ProjectPicture photo={heroPhoto} className="hero-image" sizes="100vw" eager />
          <div className="hero-overlay" />
          <div className="shell hero-inner">
            <div className="hero-copy hero-enter">
              <p className="eyebrow"><span aria-hidden="true" /> Commercial & Industrial Flooring Specialists</p>
              <h1 id="hero-title">High-performance concrete floors, built to last.</h1>
              <p className="hero-lead">Coatings, polished concrete, toppings, overlays, and surface preparation delivered with the experience demanding spaces require.</p>
              <div className="hero-actions">
                <a className="button" href="#contact">Request a Free Estimate <span aria-hidden="true">↗</span></a>
                <a className="text-link" href="#projects">Explore our work <span aria-hidden="true">↓</span></a>
              </div>
              <p className="residential-note">Residential projects are also available.</p>
            </div>
            <aside className="hero-proof hero-enter hero-enter-delayed" aria-label="Company highlights">
              <p className="proof-label">Built on experience</p><strong>Since 2012</strong><div className="proof-rule" />
              <div className="proof-rating"><span className="stars" aria-hidden="true">★★★★★</span><span><span className="sr-only">5 out of 5 stars. </span>5.0 Google rating</span></div>
            </aside>
          </div>
        </section>

        <section className="trust-strip" aria-label="Company credentials">
          <div className="shell trust-grid reveal-stagger" data-reveal>
            <div><strong>14+</strong><span>Years in business</span></div><div><strong>A+</strong><span>BBB Accredited</span></div><div><strong>13</strong><span>Five-star Google reviews</span></div><div><strong>USA</strong><span>Nationwide service</span></div>
          </div>
        </section>

        <section className="services section" id="services" aria-labelledby="services-title">
          <div className="shell">
            <div className="section-heading" data-reveal>
              <div><p className="eyebrow dark"><span aria-hidden="true" /> What we do</p><h2 id="services-title">Complete systems.<br />One accountable team.</h2></div>
              <p>Every durable floor starts below the finish. We assess the slab, prepare it correctly, and install the system that fits the environment.</p>
            </div>
            <div className="service-grid reveal-stagger" data-reveal>
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.description}</p>
                  <a href="#contact" aria-label={`Ask about ${service.title}`}>Discuss your project <span aria-hidden="true">↗</span></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="projects section" id="projects" aria-labelledby="projects-title">
          <div className="shell">
            <div className="projects-heading" data-reveal>
              <div><p className="eyebrow light"><span aria-hidden="true" /> Selected work</p><h2 id="projects-title">Real floors.<br />Built for real demands.</h2></div>
              <p>Explore a selection of completed work from the Schettini team. Choose a category to focus the gallery.</p>
            </div>
            <div className="gallery-toolbar" role="group" aria-label="Filter projects by category" data-reveal>
              {filters.map((filter) => (
                <button className={activeFilter === filter ? "active" : ""} key={filter} onClick={() => setActiveFilter(filter)} type="button" aria-pressed={activeFilter === filter}>{filter}</button>
              ))}
            </div>
            <div className="project-grid reveal-stagger" aria-live="polite" data-reveal>
              {visibleProjects.map((project) => (
                <button
                  className="project-card"
                  key={project.id}
                  type="button"
                  onClick={(event) => {
                    projectTriggerRef.current = event.currentTarget;
                    setActivePhotoIndex(0);
                    setPhotoLoading(true);
                    setPhotoError(false);
                    setActiveProject(project);
                  }}
                  aria-label={`View ${project.title}, ${project.photos.length} ${project.photos.length === 1 ? "photo" : "photos"}`}
                >
                  <ProjectPicture photo={project.photos[0]} /><span className="project-shade" aria-hidden="true" />
                  <span className="project-photo-count">{project.photos.length} {project.photos.length === 1 ? "photo" : "photos"}</span>
                  <span className="project-meta"><span className="project-kicker">{project.category} · {project.segment}</span><strong>{project.title}</strong><span className="project-view">View gallery <b aria-hidden="true">↗</b></span></span>
                </button>
              ))}
            </div>
            <p className="gallery-note">Real project photos from preparation to the finished surface. Open a gallery to explore the details.</p>
          </div>
        </section>

        <section className="markets section" aria-labelledby="markets-title">
          <div className="shell markets-grid" data-reveal>
            <div className="markets-intro">
              <p className="eyebrow dark"><span aria-hidden="true" /> Who we serve</p><h2 id="markets-title">Performance first, in every environment.</h2>
              <p>Commercial and industrial projects are our primary focus. We also bring the same preparation standards and attention to detail to select residential work.</p>
              <a className="arrow-link" href="#contact">Tell us about your space <span aria-hidden="true">↗</span></a>
            </div>
            <div className="market-list">
              <article><span>01</span><div><h3>Commercial</h3><p>Retail, hospitality, offices, and customer-facing facilities.</p></div></article>
              <article><span>02</span><div><h3>Industrial</h3><p>Warehouses, production spaces, and hard-working operational floors.</p></div></article>
              <article><span>03</span><div><h3>Residential</h3><p>Garages and select specialty concrete-floor projects by appointment.</p></div></article>
            </div>
          </div>
        </section>

        <section className="about section" id="about" aria-labelledby="about-title">
          <div className="shell about-grid about-text-only" data-reveal>
            <div className="about-copy">
              <p className="eyebrow light"><span aria-hidden="true" /> The Schettini standard</p><h2 id="about-title">Experienced hands. Straight answers.</h2>
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
            <div className="process-heading" data-reveal>
              <div><p className="eyebrow dark"><span aria-hidden="true" /> Our process</p><h2 id="process-title">The finish is only as good as the process.</h2></div>
              <p>A dependable floor is the result of careful evaluation, thorough preparation, and an installation plan matched to the space.</p>
            </div>
            <div className="process-grid reveal-stagger" data-reveal>{processSteps.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
          </div>
        </section>

        <section className="reviews section" id="reviews" aria-labelledby="reviews-title">
          <div className="shell">
            <div className="reviews-top" data-reveal>
              <div><p className="eyebrow dark"><span aria-hidden="true" /> Client feedback</p><h2 id="reviews-title">Work that earns trust.</h2></div>
              <div className="google-summary"><strong>5.0</strong><div><span className="stars" aria-hidden="true">★★★★★</span><p><span className="sr-only">5 out of 5 stars. </span>Based on 13 Google reviews</p></div></div>
            </div>
            <div className="review-grid reveal-stagger" data-reveal>
              {reviews.map((review) => <article className="review-card" key={review.author}><span className="stars" aria-hidden="true">★★★★★</span><blockquote>“{review.quote}”</blockquote><footer><strong>{review.author}</strong><span>{review.detail}</span></footer></article>)}
            </div>
            <div className="review-action"><a className="arrow-link" href={socialLinks.googleReviews} target="_blank" rel="noopener noreferrer">Read all reviews on Google <span aria-hidden="true">↗</span></a></div>
          </div>
        </section>

        <section className="coverage section" aria-labelledby="coverage-title">
          <div className="shell coverage-grid" data-reveal>
            <div><p className="eyebrow light"><span aria-hidden="true" /> Service area</p><h2 id="coverage-title">Based in Charlotte.<br />Built to travel.</h2></div>
            <div className="coverage-copy">
              <p>Serving commercial, industrial, and select residential clients nationwide.</p>
              <div className="coverage-states"><div><strong>USA</strong><span>Nationwide service</span></div><div><strong>Charlotte</strong><span>Home base</span></div></div>
              <p className="coverage-note">No public showroom. On-site consultations are scheduled by appointment.</p>
            </div>
          </div>
        </section>

        <section className="faq section" aria-labelledby="faq-title">
          <div className="shell faq-grid" data-reveal>
            <div><p className="eyebrow dark"><span aria-hidden="true" /> Common questions</p><h2 id="faq-title">Planning a flooring project?</h2></div>
            <div className="faq-list">
              <details><summary>Do you handle residential projects?<span aria-hidden="true">+</span></summary><p>Yes. Commercial and industrial work is our primary focus, but we also accept select residential projects, including garage floors.</p></details>
              <details><summary>What areas do you serve?<span aria-hidden="true">+</span></summary><p>We are based in Charlotte, North Carolina, and take on projects nationwide. Availability depends on project scope, schedule, and location.</p></details>
              <details><summary>Can you work around an operating schedule?<span aria-hidden="true">+</span></summary><p>Project schedules are coordinated directly with each client. Tell us about operational or access constraints during the estimate process.</p></details>
              <details><summary>How do I know which floor system I need?<span aria-hidden="true">+</span></summary><p>You do not need to decide before contacting us. We assess the space, substrate, traffic, maintenance needs, and desired finish before recommending a system.</p></details>
            </div>
          </div>
        </section>

        <section className="contact section" id="contact" aria-labelledby="contact-title">
          <div className="shell contact-grid" data-reveal>
            <div className="contact-copy">
              <p className="eyebrow light"><span aria-hidden="true" /> Start a conversation</p><h2 id="contact-title">Tell us what the floor needs to do.</h2>
              <p>Share the project location, type of space, approximate size, and any timing constraints. We will follow up by email to discuss the right next step.</p>
              <address className="contact-direct">
                <a href={directEmailHref} onClick={() => trackEvent("email_click", { placement: "contact_section" })}><span>Email</span><strong>{businessEmail}</strong></a>
                <a href={`tel:${businessPhone}`}><span>Call</span><strong>{businessPhoneDisplay}</strong></a>
                <div><span>Availability</span><strong>By appointment</strong></div>
              </address>
            </div>
            <form
              className="estimate-form"
              name="estimate-request"
              method="POST"
              action={directEmailHref}
              aria-busy={formStatus === "submitting"}
              onChange={() => { if (formStatus !== "idle" && formStatus !== "submitting") setFormStatus("idle"); }}
              onSubmit={handleEstimate}
            >
              <p className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></p>
              <div className="form-row"><label>Name <span aria-hidden="true">*</span><input name="name" autoComplete="name" required maxLength={100} placeholder="Your name" /></label><label>Company<input name="company" autoComplete="organization" maxLength={160} placeholder="Company or organization" /></label></div>
              <div className="form-row"><label>Email <span aria-hidden="true">*</span><input id="estimate-email" type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} placeholder="name@company.com" /></label><label>Phone<input type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength={40} placeholder="Optional" /></label></div>
              <div className="form-row"><label>Service<select name="service" defaultValue="Not sure yet"><option>Not sure yet</option>{services.map((service) => <option key={service.title}>{service.title}</option>)}</select></label><label>Project location <span aria-hidden="true">*</span><input name="location" autoComplete="address-level2" required maxLength={120} placeholder="City, State" /></label></div>
              <label>Project details<textarea name="message" rows={4} maxLength={1500} placeholder="Type of space, approximate square footage, timeline, and current floor condition" /></label>
              {deliveryMode === "server" && <Turnstile siteKey={turnstileSiteKey} onToken={setTurnstileToken} resetKey={formStatus === "success" || formStatus === "error" ? formStatus : "idle"} />}
              <button className="button form-button" type="submit" disabled={formStatus === "submitting" || (deliveryMode === "server" && !turnstileToken)}>
                {formStatus === "submitting" ? <><span className="button-spinner" aria-hidden="true" /> Sending request…</> : <>{deliveryMode === "server" ? "Send estimate request" : "Prepare email request"} <span aria-hidden="true">↗</span></>}
              </button>
              <div className="form-feedback" aria-live="polite" aria-atomic="true">
                {formStatus === "success" && <p className="form-success" role="status">Thank you. Your request was received, and the team will reply by email.</p>}
                {formStatus === "error" && <p className="form-error" role="alert">We could not submit the form. Please <a href={directEmailHref}>email your request directly</a>.</p>}
                {(formStatus === "draft" || formStatus === "error") && emailDraft && <div className="email-draft"><p role="status">{formStatus === "draft" ? "Your draft is ready. Review it and send it from your email app." : "You can send your request using your email app."} If no app opens, copy the details below and email them to <a href={directEmailHref}>{businessEmail}</a>.</p><label>Request details<textarea readOnly rows={5} value={emailDraft.body} onFocus={(event) => event.currentTarget.select()} /></label><div className="draft-actions"><a href={emailDraft.href}>Open email draft</a><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(emailDraft.body); setCopyStatus("Request details copied."); } catch { setCopyStatus("Select the request details above and copy them."); } }}>Copy request details</button></div><p role="status">{copyStatus}</p></div>}
              </div>
              <p className="form-note">
                {deliveryMode === "email" && <>This opens a draft in your email app. Send it there to complete your request. </>}
                We use your information to respond to this request and provide the
                services you ask about. See our <a href="/privacy">Privacy Policy</a>.
              </p>
              <noscript><p className="form-note">Please <a href={directEmailHref}>email your project details directly</a>.</p></noscript>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-main" data-reveal>
          <a className="footer-brand" href="#top" aria-label="Back to top"><img src="/images/schettini-logo-alt.png" alt="Schettini Floor Solutions" width="900" height="718" loading="lazy" /></a>
          <p>Concrete flooring solutions for demanding commercial, industrial, and residential spaces.</p>
          <div className="footer-links"><a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook ↗</a><a href="#contact" onClick={(event) => handleEmailCta(event, "footer")}>Email us</a><a href={`tel:${businessPhone}`}>{businessPhoneDisplay}</a></div>
        </div>
        <div className="shell footer-bottom">
          <span>© 2026 Schettini Floor Solutions LLC · Charlotte, North Carolina · Nationwide service · By appointment</span>
          <nav className="footer-legal" aria-label="Legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/accessibility">Accessibility</a>
          </nav>
          <span className="duetech-credit">Website by <strong>Duetech</strong></span>
        </div>
      </footer>

      <a className="email-float" href="#contact" onClick={(event) => handleEmailCta(event, "floating_button")} aria-label="Open the estimate form and focus the email field"><span>Email us</span><b aria-hidden="true">↗</b></a>

      {activeProject && activePhoto && (
        <div ref={projectDialogRef} className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" aria-describedby="project-modal-description" onMouseDown={(event) => { if (event.target === event.currentTarget) closeProject(); }}>
          <div className="modal-card">
            <button className="modal-close" type="button" onClick={closeProject} aria-label="Close project" autoFocus>×</button>
            <div className="modal-gallery">
              <div className="modal-image" aria-busy={photoLoading}>
                {photoLoading && <span className="photo-loading" role="status"><span className="loading-spinner" aria-hidden="true" /> Loading photo…</span>}
                <ProjectPicture key={activePhoto.src} photo={activePhoto} sizes="(max-width: 900px) 100vw, 600px" eager onLoad={() => setPhotoLoading(false)} onError={() => { setPhotoLoading(false); setPhotoError(true); }} />
                {photoError && <p className="photo-error" role="alert">This photo could not load. Try another photo.</p>}
                {activeProject.photos.length > 1 && <div className="photo-navigation"><button type="button" aria-label="Previous photo" onClick={() => navigatePhoto(-1)}>←</button><span aria-live="polite" aria-atomic="true">Photo {activePhotoIndex + 1} of {activeProject.photos.length}</span><button type="button" aria-label="Next photo" onClick={() => navigatePhoto(1)}>→</button></div>}
              </div>
              {activeProject.photos.length > 1 && <div className="photo-thumbnails" role="group" aria-label="Choose a project photo">{activeProject.photos.map((photo, index) => <button key={photo.src} type="button" aria-label={`Show photo ${index + 1}: ${photo.alt}`} aria-pressed={index === activePhotoIndex} onClick={() => { if (index === activePhotoIndex) return; setPhotoLoading(true); setPhotoError(false); setActivePhotoIndex(index); }}><ProjectPicture photo={photo} sizes="88px" /></button>)}</div>}
            </div>
            <div className="modal-copy"><span>{activeProject.category} · {activeProject.segment}</span><h2 id="project-modal-title">{activeProject.title}</h2><p id="project-modal-description">{activeProject.summary}</p><a className="arrow-link" href="#contact" onClick={() => { setActiveProject(null); requestAnimationFrame(() => document.getElementById("estimate-email")?.focus({ preventScroll: true })); }}>Discuss a similar project <span aria-hidden="true">↗</span></a></div>
          </div>
        </div>
      )}
    </>
  );
}
