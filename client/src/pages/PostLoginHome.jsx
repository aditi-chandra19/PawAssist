import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAward, FiCheckCircle, FiCreditCard, FiDollarSign, FiShield, FiSliders } from "react-icons/fi";
import PawAssistBrand from "../components/ui/PawAssistBrand";
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

const trustStats = [
  { label: "Fastest response lane", value: "10 min" },
  { label: "Unified care modules", value: "8+" },
  { label: "Premium support visibility", value: "24/7" },
];

const guaranteeLeft = [
  {
    title: "Secure Payment",
    detail: "Payments stay protected while the right service flow and support path are being confirmed.",
    icon: FiShield,
  },
  {
    title: "Pay As You Go",
    detail: "Choose only what you need, when you need it, without getting locked into unnecessary steps.",
    icon: FiCreditCard,
  },
  {
    title: "Industry Value",
    detail: "Premium-feeling pet care journeys built to stay transparent, useful, and accessible.",
    icon: FiDollarSign,
  },
];

const guaranteeRight = [
  {
    title: "Verified Pet Experts",
    detail: "Service experiences are designed around trusted providers and clearly structured care decisions.",
    icon: FiCheckCircle,
  },
  {
    title: "Happy Pet Parents",
    detail: "Built for confidence, comfort, and reassurance across both everyday and urgent care journeys.",
    icon: FiAward,
  },
  {
    title: "Customized Packages",
    detail: "Every service lane can adapt to your pet, your urgency, and your preferred next step.",
    icon: FiSliders,
  },
];

const guaranteeImages = [
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
];

const reviews = [
  {
    name: "Mrs. Vedita",
    date: "May 10, 2023",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    review:
      "We had such a fantastic experience with the grooming professionals. Their attention to detail and calm handling made the whole session feel effortless and premium.",
    petLabel: "Casper: Before and After",
    images: [
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    name: "Mr. Raj",
    date: "June 15, 2023",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    review:
      "The consultation flow felt thoughtful and reassuring. From the first question to the final recommendation, everything was organized and easy to trust.",
    petLabel: "Tyson: During Treatment",
    images: [
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    name: "Aisha Mehra",
    date: "July 02, 2023",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    review:
      "I loved being able to preview the platform first. Once I signed in, booking grooming and checking follow-up details felt incredibly smooth.",
    petLabel: "Milo: Spa Day",
    images: [
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    name: "Ritika Sen",
    date: "August 18, 2023",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80",
    review:
      "The emergency lane is what sold me. It feels fast, but not messy. You always know what the next step is.",
    petLabel: "Bruno: Emergency Response",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    name: "Neha Kapoor",
    date: "September 09, 2023",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    review:
      "The AI guidance helped me understand what was urgent and what could wait. That clarity alone made the app worth using.",
    petLabel: "Leo: AI Guidance",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    name: "Arjun Sethi",
    date: "October 21, 2023",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    review:
      "The platform feels modern and premium, but still very clear. Nothing feels buried or confusing.",
    petLabel: "Nova: Care Timeline",
    images: [
      "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    name: "Sana Ali",
    date: "November 03, 2023",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    review:
      "I was impressed by how the dashboard preview showed enough detail to build trust before even logging in.",
    petLabel: "Coco: Preview Experience",
    images: [
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    name: "Dev Malhotra",
    date: "December 12, 2023",
    avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=300&q=80",
    review:
      "The service packaging is smart. It feels like the app understands the difference between routine care and urgent care.",
    petLabel: "Mochi: Service Match",
    images: [
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    name: "Priya Nair",
    date: "January 06, 2024",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    review:
      "The overall aesthetic made a big difference. It feels less like a utility app and more like a thoughtful care platform.",
    petLabel: "Toby: Routine Care",
    images: [
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    name: "Kiran Rao",
    date: "February 14, 2024",
    avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80",
    review:
      "From consultation to follow-up, the whole journey felt connected. That continuity is what makes PawAssist stand out.",
    petLabel: "Zoe: Follow-up Support",
    images: [
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=700&q=80",
    ],
  },
];

export default function PostLoginHome() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const firstName = (user?.name || "Pet Parent").split(" ")[0];
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeGuaranteeImage, setActiveGuaranteeImage] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isCompactReviews, setIsCompactReviews] = useState(false);
  const pageRef = useRef(null);

  const tickerItems = [
    "Emergency Dispatch",
    "AI Triage",
    "Vet Consult",
    "Luxury Grooming",
    "Pet Records",
    "Care Routing",
  ];

  const navigateWithAuth = (to, { allowGuest = false } = {}) => {
    if (user || allowGuest) {
      navigate(to);
      return;
    }

    navigate("/login");
  };

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
    const updateViewport = () => {
      setIsCompactReviews(window.innerWidth <= 980);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveGuaranteeImage((current) => (current + 1) % guaranteeImages.length);
    }, 2800);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const visibleCards = isCompactReviews ? 1 : 2;
    const maxSlides = Math.max(1, reviews.length - visibleCards + 1);
    const intervalId = window.setInterval(() => {
      setReviewIndex((current) => (current + 1) % maxSlides);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [isCompactReviews]);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.16 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const visibleCards = isCompactReviews ? 1 : 2;
  const maxSlides = Math.max(1, reviews.length - visibleCards + 1);
  const reviewShift = isCompactReviews ? 100 : 50;

  return (
    <div ref={pageRef} className="care-page post-login-home wickret-clone-home">
      <div className="wickret-noise-overlay" aria-hidden="true" />
      <div className="wickret-grid-overlay" aria-hidden="true" />
      <div className="wickret-orb" aria-hidden="true" />

      <section className="wickret-home-nav">
        <div className="wickret-home-brand">
          <span className="wickret-brand-mark">
            <PawAssistBrand />
          </span>
          <div className="wickret-brand-copy">
            <strong>PawAssist</strong>
            <span>Care companion for modern pet parents</span>
          </div>
        </div>
        <div className="wickret-home-links">
          <button type="button" onClick={() => navigateWithAuth("/app/grooming")}>Benefits</button>
          <button type="button" onClick={() => navigateWithAuth("/app/insurance")}>Security</button>
          <button type="button" onClick={() => navigate("/explore")}>Download</button>
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
          <div className="wickret-trust-row">
            {trustStats.map((item) => (
              <article key={item.label} className="wickret-trust-pill">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
          <div className="hero-actions wickret-hero-actions">
            <button type="button" className="primary-button wickret-magnetic-button" onClick={() => navigate("/explore")}>
              Explore
            </button>
            <button type="button" className="ghost-button wickret-magnetic-button" onClick={() => navigateWithAuth("/app/ai-assistant?mode=triage")}>
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
                <div className="wickret-phone-copy-loop" aria-hidden="true">
                  <div className="wickret-copy-track">
                    <span>Vet help in 2 mins</span>
                    <span>Premium grooming route</span>
                    <span>Care summary updated</span>
                    <span>Emergency support ready</span>
                  </div>
                </div>
                <div className="wickret-status-chip chip-top" aria-hidden="true">
                  <span className="chip-dot" />
                  Live wellness feed
                </div>
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

      <section className="wickret-guarantee-section wickret-fade-up-block" data-reveal>
        <div className="wickret-section-heading">
          <span className="wickret-end-kicker">Happiness Guarantee</span>
          <h2>Trusted support, thoughtful service design, and a better pet-care experience.</h2>
        </div>
        <div className="wickret-guarantee-layout">
          <div className="wickret-guarantee-column">
            {guaranteeLeft.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="wickret-guarantee-card">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                  <Icon />
                </article>
              );
            })}
          </div>
          <div className="wickret-guarantee-visual">
            <div className="wickret-guarantee-image-shell">
              <img
                src={guaranteeImages[activeGuaranteeImage]}
                alt="Happy pet"
                className="wickret-guarantee-image"
              />
            </div>
          </div>
          <div className="wickret-guarantee-column">
            {guaranteeRight.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="wickret-guarantee-card">
                  <Icon />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wickret-reviews-section wickret-fade-up-block" data-reveal>
        <div className="wickret-section-heading">
          <span className="wickret-end-kicker">Pet Parent Stories</span>
          <h2>See reviews from our happy pet parents.</h2>
        </div>
        <div className="wickret-reviews-controls">
          <button type="button" className="ghost-button" onClick={() => setReviewIndex((current) => (current - 1 + maxSlides) % maxSlides)}>
            Previous
          </button>
          <button type="button" className="ghost-button" onClick={() => setReviewIndex((current) => (current + 1) % maxSlides)}>
            Next
          </button>
        </div>
        <div className="wickret-reviews-window">
          <div className="wickret-reviews-track" style={{ transform: `translateX(-${reviewIndex * reviewShift}%)` }}>
            {reviews.map((item) => (
              <article key={`${item.name}-${item.date}`} className="wickret-review-card">
                <div className="wickret-review-meta">
                  <img src={item.avatar} alt={item.name} className="wickret-review-avatar" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.date}</span>
                    <p className="wickret-review-stars">★★★★★</p>
                  </div>
                </div>
                <div className="wickret-review-body">
                  <p>{item.review}</p>
                  <div className="wickret-review-gallery">
                    {item.images.map((image, index) => (
                      <img key={`${item.name}-${index}`} src={image} alt={item.petLabel} />
                    ))}
                  </div>
                  <span className="wickret-review-label">{item.petLabel}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="wickret-review-dots" aria-hidden="true">
          {Array.from({ length: maxSlides }).map((_, index) => (
            <span key={index} className={index === reviewIndex ? "active" : ""} />
          ))}
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
