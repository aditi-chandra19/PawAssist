import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppData from "../services/useAppData";
import useUserStore from "../store/useUserStore";

const featuredServices = [
  {
    title: "Video Vet",
    subtitle: "24/7 instant care for urgent questions",
    price: "Rs 199",
    badge: "NEW",
    icon: "VV",
    tone: "blue",
    to: "/app/booking?service=vet-visit&mode=consult",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80",
    keywords: ["video", "vet", "consultation", "doctor"],
  },
  {
    title: "Emergency Care",
    subtitle: "Rapid response when every minute matters",
    price: "Rs 499",
    badge: "SOS",
    icon: "ER",
    tone: "orange",
    to: "/app/booking?service=ambulance&mode=emergency",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80",
    keywords: ["emergency", "ambulance", "urgent", "care"],
  },
  {
    title: "AI Assistant",
    subtitle: "Smart health tips and instant triage",
    price: "Free",
    badge: "AI",
    icon: "AI",
    tone: "pink",
    to: "/app/ai-assistant",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
    keywords: ["ai", "assistant", "health", "tips"],
  },
];

const premiumServices = [
  { title: "Premium Vet Visit", price: "Rs 599", icon: "PV", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80", keywords: ["premium", "vet", "visit"], to: "/app/booking?service=vet-visit&mode=consult" },
  { title: "Luxury Grooming", price: "Rs 899", icon: "LG", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80", keywords: ["luxury", "grooming", "spa"], to: "/app/grooming" },
  { title: "Expert Training", price: "Rs 799", icon: "ET", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", keywords: ["expert", "training", "behavior"], to: "/app/booking?service=training&mode=training" },
  { title: "Spa and Wellness", price: "Rs 1,299", icon: "SW", image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=600&q=80", keywords: ["spa", "wellness", "care"], to: "/app/grooming" },
  { title: "Pet Hotel", price: "Rs 999/day", icon: "PH", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80", keywords: ["hotel", "boarding", "stay"], to: "/app/provider" },
  { title: "Medicine Express", price: "Rs 99", icon: "ME", image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80", keywords: ["medicine", "express", "delivery"], to: "/app/health" },
];

const lifestyleServices = [
  { title: "Pet Walking", price: "Rs 199", image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80", keywords: ["walking", "exercise"], to: "/app/provider" },
  { title: "Pet Sitting", price: "Rs 399", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80", keywords: ["sitting", "care", "home"], to: "/app/provider" },
  { title: "Home Vaccination", price: "Rs 349", image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80", keywords: ["vaccination", "vaccine", "home"], to: "/app/health" },
  { title: "Health Check", price: "Rs 499", image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80", keywords: ["health", "checkup"], to: "/app/booking?service=vet-visit&mode=consult" },
  { title: "Custom Diet Plan", price: "Rs 299", image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=600&q=80", keywords: ["diet", "plan", "nutrition"], to: "/app/ai-assistant?mode=nutrition" },
  { title: "24/7 Support", price: "Free", image: "https://images.unsplash.com/photo-1523480717984-24cba35ae1ef?auto=format&fit=crop&w=600&q=80", keywords: ["support", "help"], to: "/app/ai-assistant?mode=triage" },
];

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

export default function CareDashboard() {
  const navigate = useNavigate();
  const { data, loading } = useAppData();
  const user = useUserStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");

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
      { threshold: 0.14 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const filteredFeatured = useMemo(
    () => featuredServices.filter((item) => matchesQuery(item, searchQuery)),
    [searchQuery],
  );

  const filteredPremium = useMemo(
    () => premiumServices.filter((item) => matchesQuery(item, searchQuery)),
    [searchQuery],
  );

  const filteredLifestyle = useMemo(
    () => lifestyleServices.filter((item) => matchesQuery(item, searchQuery)),
    [searchQuery],
  );

  if (loading || !data) {
    return <div className="panel">Loading your care dashboard...</div>;
  }

  const handleEnterNavigate = (event, to) => {
    if (event.key === "Enter" || event.key === " ") {
      navigate(to);
    }
  };

  const totalMatches = filteredFeatured.length + filteredPremium.length + filteredLifestyle.length;
  const activeUser = user || data.user;

  return (
    <div className="dashboard-page dashboard-page-enter premium-dashboard-theme">
      <header className="dashboard-topbar dashboard-surface-card" data-reveal>
        <div>
          <h1>Good Afternoon, {activeUser?.name || "Pet Parent"}!</h1>
          <p>Care orchestration, wellness, bookings, and support in one premium workspace.</p>
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
          <button type="button" className="dashboard-search-button" onClick={() => navigate("/app/booking")}>
            Go
          </button>
          <div className="dashboard-bell">{data.stats.unreadMessages}</div>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-main-column">
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

          <section className="dashboard-section" data-reveal>
            <div className="dashboard-section-head">
              <h2>Quick Actions</h2>
              <button type="button" className="dashboard-link-button" onClick={() => navigate("/app/premium")}>
                Open Control Center
              </button>
            </div>
            <div className="dashboard-quick-grid">
              {quickActions.map((action, index) => (
                <button
                  key={action.title}
                  type="button"
                  className={`dashboard-quick-card quick-${index + 1}`}
                  onClick={() => navigate(action.to)}
                >
                  <img src={action.image} alt={action.title} className="dashboard-quick-image" />
                  <strong>{action.title}</strong>
                  <p>{action.detail}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="dashboard-section" data-reveal>
            <div className="dashboard-section-head">
              <h2>Featured Services</h2>
              <button type="button" className="dashboard-link-button" onClick={() => navigate("/app/booking")}>
                View All
              </button>
            </div>
            <div className="featured-grid premium-featured-grid">
              {filteredFeatured.map((service) => (
                <article
                  key={service.title}
                  className={`featured-service-card ${service.tone} image-card featured-photo-card`}
                  onClick={() => navigate(service.to)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => handleEnterNavigate(event, service.to)}
                >
                  <img src={service.image} alt={service.title} className="featured-service-photo" />
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
                          navigate(service.to);
                        }}
                      >
                        Book
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
              <button type="button" onClick={() => navigate("/app/booking")}>
                Schedule Now
              </button>
            </div>
            <div className="insight-visual-wrap">
              <img
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80"
                alt="Dog wellness insight"
                className="insight-dog-image"
              />
              <div className="insight-brain">AI</div>
            </div>
          </section>

          <section className="dashboard-section" data-reveal>
            <div className="dashboard-section-head">
              <h2>Premium Services</h2>
              <button type="button" className="dashboard-link-button" onClick={() => navigate("/app/premium")}>
                View All
              </button>
            </div>
            <div className="premium-services-grid">
              {filteredPremium.map((service) => (
                <article
                  key={service.title}
                  className="premium-service-card dashboard-surface-card"
                  onClick={() => navigate(service.to)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => handleEnterNavigate(event, service.to)}
                >
                  <img src={service.image} alt={service.title} className="service-card-image" />
                  <div className="premium-service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <strong>{service.price}</strong>
                  <span className="premium-dot" />
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-section" data-reveal>
            <h2>Lifestyle and Wellness</h2>
            <div className="lifestyle-grid">
              {filteredLifestyle.map((service) => (
                <article
                  key={service.title}
                  className="lifestyle-card dashboard-surface-card"
                  onClick={() => navigate(service.to)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => handleEnterNavigate(event, service.to)}
                >
                  <img src={service.image} alt={service.title} className="lifestyle-card-image" />
                  <div>
                    <h3>{service.title}</h3>
                    <strong>{service.price}</strong>
                  </div>
                  <span>Go</span>
                </article>
              ))}
            </div>
            {totalMatches === 0 ? (
              <div className="dashboard-empty-state dashboard-surface-card">
                <strong>No services match your search.</strong>
                <p>Try words like grooming, insurance, diet, walking, or AI.</p>
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
            <button className="book-appointment-button" type="button" onClick={() => navigate("/app/booking")}>
              Book New Appointment
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
            onClick={() => navigate("/app/insurance")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => handleEnterNavigate(event, "/app/insurance")}
            data-reveal
          >
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"
              alt="Pet insurance"
              className="promo-card-photo"
            />
            <div className="promo-card-overlay insurance-overlay" />
            <h3>Pet Insurance</h3>
            <p>Protection plans, claim support, and preventive care coverage.</p>
          </section>

          <section
            className="promo-card community dashboard-surface-card promo-card-image"
            onClick={() => navigate("/app/community")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => handleEnterNavigate(event, "/app/community")}
            data-reveal
          >
            <img
              src="https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80"
              alt="Pet parent community"
              className="promo-card-photo"
            />
            <div className="promo-card-overlay community-overlay" />
            <h3>Join Community</h3>
            <p>Advice, celebrations, and trusted stories from pet parents like you.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
