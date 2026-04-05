import useAppData from "../services/useAppData";

export default function Premium() {
  const { data, loading } = useAppData();

  if (loading || !data) {
    return <div className="panel">Loading premium plan...</div>;
  }

  const benefits = [
    { title: "Priority Booking", detail: "Skip the queue with instant booking", icon: "⚡", tone: "orange" },
    { title: "Insurance Coverage", detail: "Up to ₹50,000 coverage annually", icon: "🛡", tone: "blue" },
    { title: "Expert Vets", detail: "Access to top-rated professionals", icon: "✩", tone: "pink" },
    { title: "Exclusive Rewards", detail: "Earn 2x points on every booking", icon: "🎁", tone: "green" },
  ];

  const plans = [
    {
      name: "Basic",
      price: "₹199",
      accent: "blue",
      cta: "Subscribe Now",
      features: [
        "5 Vet Consultations",
        "Basic Grooming Discount",
        "24/7 Chat Support",
        "Health Records",
      ],
    },
    {
      name: "Premium",
      price: "₹499",
      accent: "pink",
      cta: "Get Premium",
      popular: true,
      features: [
        "Unlimited Vet Consultations",
        "Priority Emergency Response",
        "20% off on All Services",
        "AI Health Monitoring",
        "Free Monthly Checkup",
        "Insurance Coverage",
      ],
    },
    {
      name: "Elite",
      price: "₹999",
      accent: "orange",
      cta: "Subscribe Now",
      features: [
        "Everything in Premium",
        "Dedicated Pet Care Manager",
        "30% off on All Services",
        "Free Grooming (Monthly)",
        "Premium Pet Spa Access",
        "Concierge Services",
        "Home Visit Priority",
      ],
    },
  ];

  return (
    <div className="premium-page">
      <section className="premium-hero">
        <div className="premium-hero-orb orb-left" />
        <div className="premium-hero-orb orb-right" />
        <div className="premium-hero-icon">♕</div>
        <h1>Go Premium</h1>
        <p>Unlock unlimited care for your pets</p>
      </section>

      <section className="premium-benefits-card">
        <h2>Premium Benefits</h2>
        <div className="premium-benefits-grid">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="premium-benefit">
              <div className={`premium-benefit-icon ${benefit.tone}`}>{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-plans">
        <h2>Choose Your Plan</h2>
        <div className="premium-plan-stack">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`premium-plan-card ${plan.accent}${plan.popular ? " popular" : ""}`}
            >
              {plan.popular ? <span className="premium-popular-badge">★ MOST POPULAR</span> : null}
              <div className={`premium-plan-icon ${plan.accent}`}>
                {plan.name === "Basic" ? "♡" : plan.name === "Premium" ? "♕" : "✩"}
              </div>
              <h3>{plan.name}</h3>
              <div className="premium-price-row">
                <strong>{plan.price}</strong>
                <span>/month</span>
              </div>
              <div className="premium-feature-list">
                {plan.features.map((feature) => (
                  <div key={feature} className="premium-feature-item">
                    <span className={`premium-check ${plan.accent}`}>✓</span>
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
              <button className={`premium-cta ${plan.accent}`}>{plan.cta}</button>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-testimonial">
        <div className="premium-testimonial-head">
          <div className="premium-star">★</div>
          <div>
            <strong>"Best decision ever!"</strong>
            <p>50,000+ Happy Members</p>
          </div>
        </div>
        <p className="premium-testimonial-copy">
          "PawAssist Premium has been a lifesaver! The 24/7 vet access and priority
          emergency response gives me peace of mind."
        </p>
        <span className="premium-testimonial-author">- Priya S., Mumbai</span>
      </section>

      <div className="premium-guarantee">🛡 30-Day Money Back Guarantee</div>
    </div>
  );
}
