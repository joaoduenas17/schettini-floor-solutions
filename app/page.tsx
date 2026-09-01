"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent as ReactMouseEvent } from "react";
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

type Project = {
  id: number;
  title: string;
  category: string;
  segment: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  summary: string;
  video?: boolean;
};

const projects: Project[] = [
  { id: 1, title: "Polished Aggregate Finish", category: "Polished Concrete", segment: "Commercial", image: "/images/project-polished.webp", width: 640, height: 640, alt: "Close-up of a polished aggregate concrete floor installed by Schettini Floor Solutions", summary: "A refined, durable finish designed to turn the existing slab into the finished floor." },
  { id: 2, title: "High-Build Floor System", category: "Coatings", segment: "Industrial", image: "/images/project-coating.webp", width: 640, height: 430, alt: "Glossy concrete coating project installed by Schettini Floor Solutions", summary: "A seamless coating system selected for dependable performance and easier maintenance." },
  { id: 3, title: "Commercial Concrete Finish", category: "Polished Concrete", segment: "Commercial", image: "/images/project-commercial.webp", width: 640, height: 639, alt: "Finished commercial concrete floor in a large interior space", summary: "A clean concrete finish built for a busy customer-facing environment." },
  { id: 4, title: "Decorative Floor System", category: "Coatings", segment: "Commercial", image: "/images/project-decorative.webp", width: 361, height: 640, alt: "Decorative concrete flooring project installed by Schettini Floor Solutions", summary: "A distinctive decorative system that balances visual character with everyday durability.", video: true },
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

const featureVideoPageUrl =
  "https://www.facebook.com/Schettinifloorsolutions/videos/476932537067258/";
const featureVideoEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(featureVideoPageUrl)}&show_text=false&width=400`;
const directEmailHref = `mailto:${businessEmail}?subject=${encodeURIComponent("Flooring project estimate request")}`;

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const projectTriggerRef = useRef<HTMLButtonElement | null>(null);
  const videoTriggerRef = useRef<HTMLButtonElement | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const visibleProjects = activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter);

  const closeProject = () => {
    setActiveProject(null);
    requestAnimationFrame(() => projectTriggerRef.current?.focus());
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    setIsVideoLoaded(false);
    requestAnimationFrame(() => videoTriggerRef.current?.focus());
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
    const hasOverlay = Boolean(activeProject || isVideoOpen || isMobileMenuOpen);
    if (!hasOverlay) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activeProject) closeProject();
      else if (isVideoOpen) closeVideo();
      else closeMobileMenu(true);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [activeProject, isVideoOpen, isMobileMenuOpen]);

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
    formData.set("form-name", "estimate-request");
    const encodedBody = new URLSearchParams();

    formData.forEach((value, key) => {
      if (typeof value === "string") encodedBody.append(key, value);
    });

    setFormStatus("submitting");

    try {
      const response = await fetch("/form-detection.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedBody.toString(),
      });

      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
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
                    if (project.video) {
                      videoTriggerRef.current = event.currentTarget;
                      setIsVideoOpen(true);
                      trackEvent("decorative_project_video_opened");
                      return;
                    }
                    projectTriggerRef.current = event.currentTarget;
                    setActiveProject(project);
                  }}
                  aria-label={project.video ? `Play ${project.title} video` : `View ${project.title}`}
                >
                  <img src={project.image} alt={project.alt} width={project.width} height={project.height} loading="lazy" /><span className="project-shade" aria-hidden="true" />
                  <span className="project-meta"><span className="project-kicker">{project.category} · {project.segment}</span><strong>{project.title}</strong><span className="project-view">{project.video ? "Watch project" : "View project"} <b aria-hidden="true">{project.video ? "▶" : "↗"}</b></span></span>
                </button>
              ))}
            </div>
            <p className="gallery-note">More project categories and full case studies will be added as the archive is prepared.</p>
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
          <div className="shell about-grid" data-reveal>
            <div className="about-image">
              <img className="about-team-image" src="/images/team.webp" alt="Schettini Floor Solutions crew working together on a concrete floor project" width="640" height="640" loading="lazy" />
              <div className="about-badge"><strong>A+</strong><span>BBB Accredited</span></div>
            </div>
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
              action="/form-detection.html"
              data-netlify="true"
              data-netlify-honeypot="website"
              aria-busy={formStatus === "submitting"}
              onChange={() => { if (formStatus !== "idle" && formStatus !== "submitting") setFormStatus("idle"); }}
              onSubmit={handleEstimate}
            >
              <input type="hidden" name="form-name" value="estimate-request" />
              <p className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></p>
              <div className="form-row"><label>Name <span aria-hidden="true">*</span><input name="name" autoComplete="name" required placeholder="Your name" /></label><label>Company<input name="company" autoComplete="organization" placeholder="Company or organization" /></label></div>
              <div className="form-row"><label>Email <span aria-hidden="true">*</span><input id="estimate-email" type="email" name="email" autoComplete="email" inputMode="email" required placeholder="name@company.com" /></label><label>Phone<input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="Optional" /></label></div>
              <div className="form-row"><label>Service<select name="service" defaultValue="Not sure yet"><option>Not sure yet</option>{services.map((service) => <option key={service.title}>{service.title}</option>)}</select></label><label>Project location <span aria-hidden="true">*</span><input name="location" autoComplete="address-level2" required placeholder="City, State" /></label></div>
              <label>Project details<textarea name="message" rows={4} placeholder="Type of space, approximate square footage, timeline, and current floor condition" /></label>
              <button className="button form-button" type="submit" disabled={formStatus === "submitting"}>
                {formStatus === "submitting" ? <><span className="button-spinner" aria-hidden="true" /> Sending request…</> : <>Send estimate request <span aria-hidden="true">↗</span></>}
              </button>
              <div className="form-feedback" aria-live="polite" aria-atomic="true">
                {formStatus === "success" && <p className="form-success" role="status">Thank you. Your request was received, and the team will reply by email.</p>}
                {formStatus === "error" && <p className="form-error" role="alert">We could not submit the form. Please <a href={directEmailHref}>email your request directly</a>.</p>}
              </div>
              <p className="form-note">
                We use your information to respond to this request and provide the
                services you ask about. See our <a href="/privacy">Privacy Policy</a>.
              </p>
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

      {activeProject && (
        <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" aria-describedby="project-modal-description" onMouseDown={(event) => { if (event.target === event.currentTarget) closeProject(); }}>
          <div className="modal-card">
            <button className="modal-close" type="button" onClick={closeProject} aria-label="Close project" autoFocus>×</button>
            <div className="modal-image"><img src={activeProject.image} alt={activeProject.alt} width={activeProject.width} height={activeProject.height} /></div>
            <div className="modal-copy"><span>{activeProject.category} · {activeProject.segment}</span><h2 id="project-modal-title">{activeProject.title}</h2><p id="project-modal-description">{activeProject.summary}</p><a className="arrow-link" href="#contact" onClick={closeProject}>Discuss a similar project <span aria-hidden="true">↗</span></a></div>
          </div>
        </div>
      )}

      {isVideoOpen && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-labelledby="video-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) closeVideo(); }}>
          <div className="video-modal-card">
            <div className="video-modal-heading"><div><p>Project video</p><h2 id="video-modal-title">Decorative Floor System</h2></div><button className="modal-close video-close" type="button" onClick={closeVideo} aria-label="Close video" autoFocus>×</button></div>
            <div className="video-frame-wrap">
              {!isVideoLoaded && <div className="video-loading" role="status"><span className="loading-spinner" aria-hidden="true" /> Loading video…</div>}
              <iframe
                src={featureVideoEmbedUrl}
                title="Schettini Floor Solutions epoxy floor project video"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setIsVideoLoaded(true)}
              />
            </div>
            <a className="video-fallback-link" href={featureVideoPageUrl} target="_blank" rel="noopener noreferrer">Watch on Facebook <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      )}
    </>
  );
}
