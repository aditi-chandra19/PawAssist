import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const serviceTiles = [
  {
    title: "Emergency Response",
    subtitle: "Immediate dispatch, live triage, and priority care routing.",
    cta: "Open",
    to: "/app/booking?service=ambulance&mode=emergency",
  },
  {
    title: "Clinical AI Assist",
    subtitle: "Professional symptom guidance and smart next-step support.",
    cta: "Launch",
    to: "/app/ai-assistant?mode=triage",
  },
  {
    title: "Luxury Grooming",
    subtitle: "Spa resets, coat care, and comfort-first grooming options.",
    cta: "View",
    to: "/app/grooming",
  },
];

const moneyLines = [
  "Emergency booking without generic screens",
  "AI guidance that escalates into the right service",
  "Grooming, consults, and records in one premium flow",
  "Move through care journeys with less friction",
];

const termsColumns = [
  {
    title: "Customer Service",
    accent: "on Your Terms",
    detail: "Real-time support, fast flow switching, and dedicated experiences for each kind of care.",
  },
  {
    title: "Security",
    accent: "and Trust",
    detail: "Profiles, records, reminders, and booking history stay organized in one dependable space.",
  },
  {
    title: "A powerful care",
    accent: "routing engine",
    detail: "Emergency, consult, grooming, and AI paths now open according to the service you choose.",
  },
];

export default function PostLoginHome() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const firstName = (user?.name || "Pet Parent").split(" ")[0];
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const pageRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  const tickerItems = [
    "Emergency Dispatch",
    "AI Triage",
    "Vet Consult",
    "Luxury Grooming",
    "Pet Records",
    "Care Routing",
  ];

  useEffect(() => {
    const updateTilt = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 18;
      setTilt({ x, y });
    };

    window.addEventListener("pointermove", updateTilt);
    return () => window.removeEventListener("pointermove", updateTilt);
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    const cursor = cursorRef.current;
    const ring = ringRef.current;

    if (!page || !cursor || !ring || window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let frameId = 0;

    const handleMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    const expandCursor = () => {
      cursor.classList.add("is-hover");
      ring.classList.add("is-hover");
    };

    const shrinkCursor = () => {
      cursor.classList.remove("is-hover");
      ring.classList.remove("is-hover");
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      frameId = window.requestAnimationFrame(animateRing);
    };

    const interactiveEls = page.querySelectorAll("button, a, .wickret-service-tile, .wickret-term-card");
    interactiveEls.forEach((element) => {
      element.addEventListener("mouseenter", expandCursor);
      element.addEventListener("mouseleave", shrinkCursor);
    });

    page.addEventListener("pointermove", handleMove);
    frameId = window.requestAnimationFrame(animateRing);

    return () => {
      page.removeEventListener("pointermove", handleMove);
      interactiveEls.forEach((element) => {
        element.removeEventListener("mouseenter", expandCursor);
        element.removeEventListener("mouseleave", shrinkCursor);
      });
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={pageRef} className="care-page post-login-home wickret-clone-home">
      <div ref={cursorRef} className="wickret-cursor" aria-hidden="true" />
      <div ref={ringRef} className="wickret-cursor-ring" aria-hidden="true" />
      <div className="wickret-noise-overlay" aria-hidden="true" />
      <div className="wickret-grid-overlay" aria-hidden="true" />
      <div className="wickret-orb" aria-hidden="true" />

      <section className="wickret-home-nav">
        <div className="wickret-home-brand">
          <span className="wickret-brand-dot" />
          <strong>PawAssist</strong>
        </div>
        <div className="wickret-home-links">
          <button type="button" onClick={() => navigate("/app/grooming")}>Benefits</button>
          <button type="button" onClick={() => navigate("/app/insurance")}>Security</button>
          <button type="button" onClick={() => navigate("/app/dashboard")}>Download</button>
        </div>
      </section>

      <section className="wickret-clone-hero">
        <div className="wickret-clone-copy">
          <span className="wickret-micro-copy">Welcome back, {firstName}</span>
          <h1 className="wickret-heading-reveal">
            <span className="wickret-heading-line">
              <span className="wickret-heading-inner">Pet Care</span>
            </span>
            <span className="wickret-heading-line">
              <span className="wickret-heading-inner">Reimagined</span>
            </span>
          </h1>
          <p className="wickret-hero-subcopy">
            Emergency support, AI guidance, grooming, records, and dashboard actions now move through one polished care experience.
          </p>
          <div className="hero-actions wickret-hero-actions">
            <button type="button" className="primary-button wickret-magnetic-button" onClick={() => navigate("/app/dashboard")}>
              Explore
            </button>
            <button type="button" className="ghost-button wickret-magnetic-button" onClick={() => navigate("/app/ai-assistant?mode=triage")}>
              AI Assist
            </button>
          </div>
          <div className="wickret-floating-lines" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="wickret-phone-stage">
          <div
            className="wickret-phone-shell"
            style={{
              transform: `perspective(1600px) rotateY(${tilt.x * 0.35}deg) rotateX(${-tilt.y * 0.35}deg) translateY(${tilt.y * 0.35}px)`,
            }}
          >
            <div className="wickret-phone-frame">
              <div className="wickret-phone-notch" />
              <div className="wickret-phone-screen">
                <div className="wickret-phone-surface" />
                <img
                  src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80"
                  alt="Healthy happy dog"
                  className="wickret-phone-image"
                />
                <div className="wickret-ui-card primary">
                  <span><i className="wickret-pulse-dot" />AI Assist</span>
                  <strong>Symptoms organized instantly</strong>
                </div>
                <div className="wickret-ui-card secondary">
                  <span>Next action</span>
                  <strong>Explore the dashboard for care paths</strong>
                </div>
              </div>
            </div>
            <div className="wickret-orbit-card orbit-left stat-pill pill-left">
              <span>Emergency</span>
              <strong>10 min dispatch</strong>
            </div>
            <div className="wickret-orbit-card orbit-right stat-pill pill-right">
              <span>Grooming</span>
              <strong>Full spa reset</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="wickret-money-section wickret-fade-up-block">
        <div className="wickret-money-copy">
          <h2>It&apos;s Your Pet Care</h2>
          <h3>Stop opening the same screen</h3>
        </div>
        <div className="wickret-money-list">
          {moneyLines.map((line) => (
            <div key={line} className="wickret-money-row">
              <span />
              <p>{line}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wickret-service-cards wickret-fade-up-block">
        {serviceTiles.map((card) => (
          <article key={card.title} className="wickret-service-tile">
            <strong>{card.title}</strong>
            <p>{card.subtitle}</p>
            <button type="button" className="ghost-button" onClick={() => navigate(card.to)}>
              {card.cta}
            </button>
          </article>
        ))}
      </section>

      <section className="wickret-terms-grid wickret-fade-up-block">
        {termsColumns.map((item) => (
          <article key={item.title} className="wickret-term-card">
            <h3>{item.title}</h3>
            <h4>{item.accent}</h4>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="wickret-download-band wickret-fade-up-block">
        <div>
          <h3>Download the app to get started</h3>
          <p>The first page leads into your dashboard, and each option now opens the right dedicated flow.</p>
        </div>
        <div className="hero-actions">
          <button type="button" className="primary-button" onClick={() => navigate("/app/dashboard")}>
            Explore
          </button>
          <button type="button" className="ghost-button" onClick={() => navigate("/app/profile")}>
            Profile
          </button>
        </div>
      </section>

      <section className="wickret-ticker-wrap">
        <div className="wickret-ticker">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
