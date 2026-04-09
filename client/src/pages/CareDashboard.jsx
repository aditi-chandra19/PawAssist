import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppData from "../services/useAppData";
import useUserStore from "../store/useUserStore";

const promoSlides = [
  {
    title: "Dog Walking",
    subtitle: "Happy walks, happy paws",
    price: "96 / Per Walk",
    accent: "sun",
    kicker: "Start From",
    badge: "Upto 20% Discount",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    to: "/app/provider?service=pet-walking",
    tab: "services",
  },
  {
    title: "Pet Insurance",
    subtitle: "Coverage that keeps your pet safe and secure",
    price: "1999/-",
    accent: "seafoam",
    kicker: "Start from",
    badge: "Safe Cover",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    to: "/app/insurance",
    tab: "products",
  },
  {
    title: "Dog Grooming",
    subtitle: "Grooming services with exclusive discounts",
    price: "499/-",
    accent: "mint",
    kicker: "Start from",
    badge: "Fresh Coat",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80",
    to: "/app/grooming",
    tab: "services",
  },
  {
    title: "Dog Boarding",
    subtitle: "Reliable boarding at discounted rates near you",
    price: "699/-",
    accent: "sky",
    kicker: "Start from",
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80",
    to: "/app/provider?service=pet-hotel",
    tab: "services",
  },
  {
    title: "Dog Training",
    subtitle: "Smart sessions for calmer and happier pets",
    price: "4999/-",
    accent: "blush",
    kicker: "Start from",
    badge: "Pro Coaches",
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=80",
    to: "/app/booking?service=training&mode=training",
    tab: "services",
  },
  {
    title: "Pet Products",
    subtitle: "Care essentials, supplements, and accessories",
    price: "From 299/-",
    accent: "peach",
    kicker: "Start from",
    badge: "Fresh Picks",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
    to: "/app/booking?service=medicine-express&mode=delivery",
    tab: "products",
  },
  {
    title: "Wellness Kit",
    subtitle: "Daily care bundles for coat, gut, and immunity",
    price: "799/-",
    accent: "sage",
    kicker: "Start from",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80",
    to: "/app/health",
    tab: "products",
  },
  {
    title: "Nutrition Packs",
    subtitle: "Balanced meals and treats for every life stage",
    price: "499/-",
    accent: "sun",
    kicker: "Start from",
    badge: "Vet Pick",
    image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=900&q=80",
    to: "/app/provider?service=custom-diet",
    tab: "products",
  },
  {
    title: "Cat Grooming",
    subtitle: "Gentle grooming routines for calm, clean cats",
    price: "549/-",
    accent: "seafoam",
    kicker: "Start from",
    badge: "Soft Care",
    image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80",
    to: "/app/grooming",
    tab: "services",
  },
  {
    title: "Health Check",
    subtitle: "Preventive vet reviews with quick report cards",
    price: "349/-",
    accent: "peach",
    kicker: "Start from",
    badge: "Quick Book",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80",
    to: "/app/booking?service=vet-visit&mode=consult",
    tab: "services",
  },
];

const serviceCategories = [
  { id: "all", label: "All Services", short: "AS" },
  { id: "core", label: "Core Services", short: "CS" },
  { id: "healthcare", label: "Healthcare", short: "HC" },
  { id: "wellness", label: "Wellness", short: "WL" },
  { id: "daily-care", label: "Daily Care", short: "DC" },
  { id: "special", label: "Special Services", short: "SS" },
];

const toneByCategory = {
  core: "cyan",
  healthcare: "green",
  wellness: "purple",
  "daily-care": "sky",
  special: "orange",
};

const imageByService = {
  "vet-visit": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80",
  ambulance: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80",
  "ai-health": "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
  "premium-vet-visit": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
  "luxury-grooming": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80",
  training: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=80",
};

function formatPrice(value, serviceId) {
  if (!value) {
    return "Free";
  }

  if (serviceId === "pet-insurance") {
    return `Rs ${value}/mo`;
  }

  if (serviceId === "pet-hotel") {
    return `Rs ${value}/day`;
  }

  return `Rs ${value}`;
}

function buildServiceRoute(service) {
  if (service.id === "ai-health") {
    return "/app/ai-assistant";
  }

  if (service.id === "custom-diet") {
    return "/app/provider?service=custom-diet";
  }

  if (service.id === "support-247") {
    return "/app/ai-assistant?mode=triage";
  }

  if (service.id === "pet-insurance") {
    return "/app/insurance";
  }

  if (service.id === "lost-found") {
    return "/app/community";
  }

  if (["pet-walking", "pet-sitting", "pet-hotel", "pet-taxi"].includes(service.id)) {
    return `/app/provider?service=${service.id}`;
  }

  if (["luxury-grooming", "spa-wellness"].includes(service.id)) {
    return "/app/grooming";
  }

  if (service.id === "ambulance") {
    return "/app/booking?service=ambulance&mode=emergency";
  }

  if (["training", "fitness-training"].includes(service.id)) {
    return `/app/booking?service=${service.id}&mode=training`;
  }

  return `/app/booking?service=${service.id}&mode=${service.mode || "default"}`;
}

function serviceToDashboardCard(service) {
  return {
    id: service.id,
    title: service.name,
    subtitle: service.description,
    price: formatPrice(service.price, service.id),
    icon: service.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    badge: service.badge || "SH",
    meta: `${service.rating ?? 4.8}  ${service.eta || "Available now"}`,
    tone: toneByCategory[service.category] || "cyan",
    category: service.category || "special",
    keywords: [
      service.name,
      service.description,
      service.category,
      service.providerRole,
      service.mode,
    ].filter(Boolean),
    to: buildServiceRoute(service),
    image: imageByService[service.id] || "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
  };
}

const quickActions = [
  { title: "Create Booking", detail: "Launch premium service flow", to: "/app/booking", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=80" },
  { title: "Review Insurance", detail: "Coverage, claims, and plans", to: "/app/insurance", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80" },
  { title: "Ask AI Assistant", detail: "Triage, tips, and summaries", to: "/app/ai-assistant", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=80" },
  { title: "Open Community", detail: "Shared advice from pet parents", to: "/app/community", image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=700&q=80" },
];

function matchesQuery(item, query) {
  if (!query) {
    return true;
  }

  const haystack = [item.title, item.subtitle, item.price, ...(item.keywords || [])].join(" ").toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export default function CareDashboard({ forcePreview = false }) {
  const navigate = useNavigate();
  const { data, loading } = useAppData();
  const user = useUserStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeServiceCategory, setActiveServiceCategory] = useState("all");
  const [showAllServices, setShowAllServices] = useState(false);
  const [activePromoTab, setActivePromoTab] = useState("services");
  const [promoIndex, setPromoIndex] = useState(0);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [showEmergencyToast, setShowEmergencyToast] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const isGuestPreview = forcePreview || !user;

  useEffect(() => {
    if (isGuestPreview) {
      return undefined;
    }

    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.14 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [isGuestPreview]);

  useEffect(() => {
    if (!showEmergencyToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShowEmergencyToast(false);
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [showEmergencyToast]);

  const visiblePromoSlides = useMemo(
    () => promoSlides.filter((slide) => slide.tab === activePromoTab),
    [activePromoTab],
  );

  useEffect(() => {
    if (visiblePromoSlides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setPromoIndex((current) => (current + 1) % visiblePromoSlides.length);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, [visiblePromoSlides]);

  const dashboardServices = useMemo(
    () => (data?.services || []).map(serviceToDashboardCard),
    [data?.services],
  );

  const filteredFeatured = useMemo(
    () => dashboardServices.slice(0, 3).filter((item) => matchesQuery(item, searchQuery)),
    [dashboardServices, searchQuery],
  );

  const filteredAllServices = useMemo(() => {
    return dashboardServices.filter((item) => {
      const matchesCategory = activeServiceCategory === "all" || item.category === activeServiceCategory;
      return matchesCategory && matchesQuery(item, searchQuery);
    });
  }, [activeServiceCategory, dashboardServices, searchQuery]);

  const visibleServices = useMemo(() => {
    if (searchQuery.trim()) {
      return filteredAllServices;
    }

    return showAllServices ? filteredAllServices : filteredAllServices.slice(0, 6);
  }, [filteredAllServices, searchQuery, showAllServices]);

  if (loading || !data) {
    return <div className="panel">Loading your care dashboard...</div>;
  }

  const navigateWithAuth = (to) => {
    if (user && !forcePreview) {
      navigate(to);
      return;
    }

    navigate("/login", { state: { from: "/app/home" } });
  };

  const handleEnterNavigate = (event, to) => {
    if (event.key === "Enter" || event.key === " ") {
      navigateWithAuth(to);
    }
  };

  const handleEmergencyClick = () => {
    if (isGuestPreview) {
      navigateWithAuth("/app/booking?service=ambulance&mode=emergency");
      return;
    }

    setIsEmergencyOpen(true);
  };

  const handleEmergencyConfirm = () => {
    setIsEmergencyOpen(false);
    setShowEmergencyToast(true);
  };

  const totalMatches = filteredFeatured.length + filteredAllServices.length;
  const activeUser = user || { name: "Guest" };
  const actionLabel = isGuestPreview ? "Sign In" : "Book Now";
  const promoWindow = Array.from({ length: Math.min(3, visiblePromoSlides.length) }, (_, offset) => {
    return visiblePromoSlides[(promoIndex + offset) % visiblePromoSlides.length];
  });
  const categoryCounts = serviceCategories.reduce((accumulator, category) => {
    accumulator[category.id] = category.id === "all"
      ? dashboardServices.length
      : dashboardServices.filter((item) => item.category === category.id).length;
    return accumulator;
  }, {});

  return (
    <div className="dashboard-page dashboard-page-enter premium-dashboard-theme">
      {isGuestPreview ? (
        <section className="dashboard-preview-banner">
          <div className="dashboard-preview-banner-copy">
            <span className="dashboard-preview-banner-icon">!</span>
            <p>You&apos;re in preview mode. Sign in to book services and access all features!</p>
          </div>
          <button type="button" className="dashboard-preview-signin" onClick={() => navigate("/login", { state: { from: "/app/home" } })}>
            Sign In Now
          </button>
        </section>
      ) : null}

      <header className="dashboard-topbar dashboard-surface-card" data-reveal>
        <div>
          <h1>{isGuestPreview ? "Dashboard Preview" : `Good Afternoon, ${activeUser?.name || "Pet Parent"}!`}</h1>
          <p>
            {isGuestPreview
              ? "Exploring all available services before login."
              : "Care orchestration, wellness, bookings, and support in one premium workspace."}
          </p>
        </div>
        <div className="dashboard-top-actions">
          <label className="dashboard-search-shell">
            <input
              className="dashboard-search-input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search services, grooming, insurance, walking..."
            />
          </label>
          {!isGuestPreview ? (
            <button type="button" className="dashboard-search-button" onClick={() => navigateWithAuth("/app/booking")}>
              Go
            </button>
          ) : null}
          <button type="button" className="dashboard-emergency-button" onClick={handleEmergencyClick}>
            Emergency
          </button>
          <button type="button" className="dashboard-bell dashboard-notification-button" onClick={() => setIsNotificationsOpen(true)}>
            {data.stats.unreadMessages}
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-main-column">
          <section className="dashboard-promo-section dashboard-surface-card" data-reveal>
            <div className="dashboard-promo-tabs">
              <button
                type="button"
                className={`dashboard-promo-tab${activePromoTab === "services" ? " active" : ""}`}
                    onClick={() => {
                      setActivePromoTab("services");
                      setPromoIndex(0);
                    }}
              >
                Pet Services
              </button>
              <span>|</span>
              <button
                type="button"
                className={`dashboard-promo-tab${activePromoTab === "products" ? " active" : ""}`}
                    onClick={() => {
                      setActivePromoTab("products");
                      setPromoIndex(0);
                    }}
              >
                Pet Products
              </button>
            </div>

            <div className="dashboard-promo-carousel">
              <button
                type="button"
                className="dashboard-promo-arrow left"
                onClick={() => setPromoIndex((current) => (current - 1 + visiblePromoSlides.length) % visiblePromoSlides.length)}
                aria-label="Previous promotions"
              >
                ‹
              </button>

              <div className="dashboard-promo-track">
                {promoWindow.map((slide) => (
                  <article
                    key={`${slide.title}-${slide.tab}`}
                    className={`dashboard-promo-card ${slide.accent}`}
                    onClick={() => navigateWithAuth(slide.to)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => handleEnterNavigate(event, slide.to)}
                  >
                    <div className="dashboard-promo-copy">
                      <span className="dashboard-promo-kicker">{slide.kicker}</span>
                      <strong className="dashboard-promo-price">{slide.price}</strong>
                      {slide.badge ? <span className="dashboard-promo-badge">{slide.badge}</span> : null}
                      <h3>{slide.title}</h3>
                      <p>{slide.subtitle}</p>
                      <button
                        type="button"
                        className="dashboard-promo-cta"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigateWithAuth(slide.to);
                        }}
                      >
                        {actionLabel}
                      </button>
                    </div>
                    <img src={slide.image} alt={slide.title} className="dashboard-promo-image" loading="lazy" decoding="async" />
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="dashboard-promo-arrow right"
                onClick={() => setPromoIndex((current) => (current + 1) % visiblePromoSlides.length)}
                aria-label="Next promotions"
              >
                ›
              </button>
            </div>

            <div className="dashboard-promo-dots">
              {visiblePromoSlides.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  className={index === promoIndex ? "active" : ""}
                  onClick={() => setPromoIndex(index)}
                  aria-label={`Go to promotion ${index + 1}`}
                />
              ))}
            </div>
          </section>

          <section className="dashboard-stats" data-reveal>
            <article className="dashboard-stat-card dashboard-surface-card">
              <div className="dashboard-stat-icon green">SV</div>
              <span>Total Saved</span>
              <strong>Rs 2,450</strong>
            </article>
            <article className="dashboard-stat-card dashboard-surface-card">
              <div className="dashboard-stat-icon purple">BK</div>
              <span>Total Bookings</span>
              <strong>12</strong>
            </article>
            <article className="dashboard-stat-card dashboard-surface-card">
              <div className="dashboard-stat-icon amber">RP</div>
              <span>Reward Points</span>
              <strong>{data.stats.rewardPoints}</strong>
            </article>
            <article className="dashboard-stat-card dashboard-surface-card">
              <div className="dashboard-stat-icon pink">PT</div>
              <span>Active Pets</span>
              <strong>{data.pets.length}</strong>
            </article>
          </section>

          <section className="dashboard-section dashboard-services-section" data-reveal>
            <div className="dashboard-section-head">
              <h2>Quick Actions</h2>
              <button type="button" className="dashboard-link-button" onClick={() => navigateWithAuth("/app/premium")}>
                Open Control Center
              </button>
            </div>
            <div className="dashboard-quick-grid">
              {quickActions.map((action, index) => (
                <button
                  key={action.title}
                  type="button"
                  className={`dashboard-quick-card quick-${index + 1}`}
                  onClick={() => navigateWithAuth(action.to)}
                >
                  <img src={action.image} alt={action.title} className="dashboard-quick-image" loading="lazy" decoding="async" />
                  <strong>{action.title}</strong>
                  <p>{action.detail}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="dashboard-section" data-reveal>
            <div className="dashboard-section-head">
              <h2>Featured Services</h2>
              <button type="button" className="dashboard-link-button" onClick={() => navigateWithAuth("/app/booking")}>
                View All
              </button>
            </div>
            <div className="featured-grid premium-featured-grid">
              {filteredFeatured.map((service) => (
                <article
                  key={service.title}
                  className={`featured-service-card ${service.tone} image-card featured-photo-card`}
                  onClick={() => navigateWithAuth(service.to)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => handleEnterNavigate(event, service.to)}
                >
                  <img src={service.image} alt={service.title} className="featured-service-photo" loading="lazy" decoding="async" />
                  <div className="featured-service-overlay" />
                  <div className="featured-service-top">
                    <div className="featured-service-icon">{service.icon}</div>
                    <span className="featured-badge">{service.badge}</span>
                  </div>
                  <div className="featured-service-content">
                    <h3>{service.title}</h3>
                    <p>{service.subtitle}</p>
                    <div className="featured-service-bottom">
                      <strong>{service.price}</strong>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigateWithAuth(service.to);
                        }}
                      >
                        {actionLabel}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="insight-banner premium-insight-banner" data-reveal>
            <div className="insight-copy">
              <span>AI Health Insight</span>
              <h2>Bruno needs a checkup</h2>
              <p>
                Last visit was 45 days ago. Our care engine recommends a proactive routine checkup,
                hydration review, and coat-health screening this week.
              </p>
              <button type="button" onClick={() => navigateWithAuth("/app/booking")}>
                {isGuestPreview ? "Sign In" : "Schedule Now"}
              </button>
            </div>
            <div className="insight-visual-wrap">
              <img
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80"
                alt="Dog wellness insight"
                className="insight-dog-image"
                loading="lazy"
                decoding="async"
              />
            </div>
          </section>

          <section className="dashboard-section" data-reveal>
            <div className="dashboard-services-board dashboard-surface-card">
              <div className="dashboard-services-tabs">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`dashboard-services-tab${activeServiceCategory === category.id ? " active" : ""}`}
                    onClick={() => setActiveServiceCategory(category.id)}
                  >
                    <span>{category.short}</span>
                    {category.label} ({categoryCounts[category.id]})
                  </button>
                ))}
              </div>

              <div className="dashboard-section-head dashboard-services-head">
                <div className="dashboard-services-title">
                  <h2>All Services</h2>
                  <span>{filteredAllServices.length}</span>
                </div>
                <div className="dashboard-services-actions">
                  <p>Popular care, healthcare, wellness, and special services in one view.</p>
                  {filteredAllServices.length > 6 && !searchQuery.trim() ? (
                    <button
                      type="button"
                      className="dashboard-link-button"
                      onClick={() => setShowAllServices((current) => !current)}
                    >
                      {showAllServices ? "Show Less" : "Show More"}
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="dashboard-services-grid">
                {visibleServices.map((service) => (
                  <article
                    key={service.title}
                    className="dashboard-service-card"
                    onClick={() => navigateWithAuth(service.to)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => handleEnterNavigate(event, service.to)}
                  >
                    <div className={`dashboard-service-icon tone-${service.tone}`}>{service.icon}</div>
                    {service.badge ? <span className={`dashboard-service-badge badge-${service.badge.toLowerCase()}`}>{service.badge}</span> : null}
                    <h3>{service.title}</h3>
                    <p>{service.subtitle}</p>
                    <div className="dashboard-service-meta">
                      <span>{service.meta}</span>
                    </div>
                    <div className="dashboard-service-bottom">
                      <strong>{service.price}</strong>
                      <button
                        type="button"
                        className={`dashboard-service-book tone-${service.tone}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          navigateWithAuth(service.to);
                        }}
                      >
                        {isGuestPreview ? "Sign In" : "Book"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            {totalMatches === 0 ? (
              <div className="dashboard-empty-state dashboard-surface-card">
                <strong>No services match your search.</strong>
                <p>Try words like grooming, insurance, diet, walking, ambulance, or AI.</p>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="dashboard-side-column">
          <section className="side-card dashboard-surface-card" data-reveal>
            <h2>Upcoming Appointments</h2>
            {data.bookings.slice(0, 2).map((booking, index) => (
              <article key={booking.id} className="appointment-card">
                <div>
                  <h3>{index === 0 ? "Vet Consultation" : "Grooming Session"}</h3>
                  <p>{index === 0 ? "for Bruno" : "for Luna"}</p>
                </div>
                <span className={`appointment-status ${booking.status}`}>{booking.status}</span>
                <p>{index === 0 ? "Today, 3:00 PM" : "Tomorrow, 11:00 AM"}</p>
                <p>{index === 0 ? "Dr. Priya Sharma" : "Riya Kapoor"}</p>
              </article>
            ))}
            <button className="book-appointment-button" type="button" onClick={() => navigateWithAuth("/app/booking")}>
              {isGuestPreview ? "Sign In to Book" : "Book New Appointment"}
            </button>
          </section>

          <section className="side-card dashboard-surface-card" data-reveal>
            <h2>Recent Activity</h2>
            {[
              { title: "Completed Vaccination", time: "Bruno - 2 hours ago", icon: "VC" },
              { title: "Booking Confirmed", time: "Luna - 5 hours ago", icon: "BK" },
              { title: "Payment Successful", time: "Bruno - 1 day ago", icon: "PY" },
            ].map((item) => (
              <div key={item.title} className="activity-row">
                <span>{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.time}</p>
                </div>
              </div>
            ))}
          </section>

          <section
            className="promo-card insurance dashboard-surface-card promo-card-image"
            onClick={() => navigateWithAuth("/app/insurance")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => handleEnterNavigate(event, "/app/insurance")}
            data-reveal
          >
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"
              alt="Pet insurance"
              className="promo-card-photo"
              loading="lazy"
              decoding="async"
            />
            <div className="promo-card-overlay insurance-overlay" />
            <h3>Pet Insurance</h3>
            <p>Protection plans, claim support, and preventive care coverage.</p>
          </section>

          <section
            className="promo-card community dashboard-surface-card promo-card-image"
            onClick={() => navigateWithAuth("/app/community")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => handleEnterNavigate(event, "/app/community")}
            data-reveal
          >
            <img
              src="https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80"
              alt="Pet parent community"
              className="promo-card-photo"
              loading="lazy"
              decoding="async"
            />
            <div className="promo-card-overlay community-overlay" />
            <h3>Join Community</h3>
            <p>Advice, celebrations, and trusted stories from pet parents like you.</p>
          </section>
        </aside>
      </div>

      {isEmergencyOpen ? (
        <div className="dashboard-emergency-overlay" role="presentation" onClick={() => setIsEmergencyOpen(false)}>
          <div className="dashboard-emergency-modal" role="dialog" aria-modal="true" aria-labelledby="emergency-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="dashboard-emergency-head">
              <div className="dashboard-emergency-icon">!</div>
              <div>
                <h2 id="emergency-modal-title">Emergency Call</h2>
                <p>Request immediate assistance</p>
              </div>
            </div>
            <p className="dashboard-emergency-copy">
              We&apos;ll dispatch the nearest emergency vet ambulance to your location. Average response time is under 15 minutes.
            </p>
            <div className="dashboard-emergency-fee">
              <span>⚡</span>
              <p>Emergency service fee: ₹499 (includes first consultation)</p>
            </div>
            <div className="dashboard-emergency-actions">
              <button type="button" className="dashboard-emergency-cancel" onClick={() => setIsEmergencyOpen(false)}>
                Cancel
              </button>
              <button type="button" className="dashboard-emergency-confirm" onClick={handleEmergencyConfirm}>
                Confirm Emergency
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showEmergencyToast ? (
        <div className="dashboard-emergency-toast" role="status" aria-live="polite">
          <div className="dashboard-emergency-toast-icon">✓</div>
          <div>
            <strong>Emergency Request Sent!</strong>
            <p>Ambulance is on the way. ETA: 12 minutes</p>
          </div>
          <button type="button" className="dashboard-emergency-toast-close" onClick={() => setShowEmergencyToast(false)}>
            x
          </button>
        </div>
      ) : null}

      {isNotificationsOpen ? (
        <div className="dashboard-notifications-overlay" role="presentation" onClick={() => setIsNotificationsOpen(false)}>
          <div className="dashboard-notifications-dialog" role="dialog" aria-modal="true" aria-labelledby="notifications-dialog-title" onClick={(event) => event.stopPropagation()}>
            <div className="dashboard-notifications-head">
              <div>
                <h2 id="notifications-dialog-title">Notifications</h2>
                <p>Important reminders, care updates, and account activity.</p>
              </div>
              <button type="button" className="dashboard-notifications-close" onClick={() => setIsNotificationsOpen(false)}>
                x
              </button>
            </div>

            <div className="dashboard-notifications-list">
              {data.notifications.map((item) => (
                <article key={item.id} className={`dashboard-notification-card priority-${item.priority}`}>
                  <div className="dashboard-notification-dot" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                    <span>{item.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
