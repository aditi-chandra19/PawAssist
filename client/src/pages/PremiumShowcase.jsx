import { useEffect, useRef, useState } from "react";
import { FaBolt, FaBrain, FaCheck, FaCrown, FaShieldAlt, FaStar, FaMagic } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAppData from "../services/useAppData";

const benefits = [
  { title: "VIP Treatment", detail: "Priority access to all services and instant booking", icon: FaCrown, tone: "gold" },
  { title: "AI Health Insights", detail: "24/7 AI-powered health monitoring and recommendations", icon: FaBrain, tone: "berry" },
  { title: "Insurance Coverage", detail: "Comprehensive pet insurance with instant claims support", icon: FaShieldAlt, tone: "ocean" },
  { title: "Exclusive Services", detail: "Access to premium grooming and spa treatments", icon: FaMagic, tone: "mint" },
];

const plans = [
  {
    name: "Basic",
    price: "Rs 299",
    accent: "basic",
    cta: "Choose Basic",
    features: [
      "5 vet consultations/month",
      "Basic health tracking",
      "Community access",
      "Email support",
      "10% discount on services",
    ],
  },
  {
    name: "Premium",
    price: "Rs 599",
    accent: "premium",
    cta: "Choose Premium",
    popular: true,
    features: [
      "Unlimited vet consultations",
      "Advanced health analytics",
      "Priority booking",
      "24/7 chat support",
      "20% discount on all services",
      "Free monthly grooming",
      "AI health assistant",
    ],
  },
  {
    name: "Elite",
    price: "Rs 999",
    accent: "elite",
    cta: "Choose Elite",
    features: [
      "Everything in Premium",
      "Dedicated vet support",
      "Emergency ambulance priority",
      "Premium insurance included",
      "30% discount on all services",
      "Home visit consultations",
      "Nutrition consultation",
      "Behavior training sessions",
    ],
  },
];

const testimonials = [
  {
    quote: "\"The AI health assistant is a game changer! It helped me identify my dog's allergy symptoms early.\"",
    name: "Priya Sharma",
    role: "Premium Member",
    initial: "P",
  },
  {
    quote: "\"Best investment for my pets. The priority booking and free grooming saves me so much time and money!\"",
    name: "Rahul Verma",
    role: "Elite Member",
    initial: "R",
  },
  {
    quote: "\"The 24/7 support is incredible. I always get quick responses to my pet care questions.\"",
    name: "Sneha Patel",
    role: "Premium Member",
    initial: "S",
  },
];

export default function PremiumShowcase() {
  const navigate = useNavigate();
  const { data, loading } = useAppData();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const plansRef = useRef(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  if (loading || !data) {
    return <div className="panel">Loading premium plan...</div>;
  }

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    window.requestAnimationFrame(() => {
      const checkout = document.getElementById("premium-checkout-card");
      checkout?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleClaimOffer = () => {
    const premiumPlan = plans.find((plan) => plan.name === "Premium");
    setSelectedPlan(premiumPlan);
    plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`premium-showcase${isVisible ? " is-visible" : ""}`}>
      <section className="premium-showcase-hero">
        <div className="premium-showcase-crown">
          <FaCrown />
        </div>
        <h1>Upgrade to Premium</h1>
        <p>Give your pets the VIP care they deserve</p>
      </section>

      <section className="premium-showcase-section">
        <h2>Why Go Premium?</h2>
        <div className="premium-showcase-benefits">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <article key={benefit.title} className="premium-showcase-benefit-card" style={{ animationDelay: `${0.12 * (index + 1)}s` }}>
                <div className={`premium-showcase-benefit-icon ${benefit.tone}`}>
                  <Icon />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="premium-showcase-section" ref={plansRef}>
        <h2>Choose Your Plan</h2>
        <div className="premium-showcase-plans">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`premium-showcase-plan-card ${plan.accent}${plan.popular ? " popular" : ""}${selectedPlan?.name === plan.name ? " selected" : ""}`}
              style={{ animationDelay: `${0.18 * (index + 1)}s` }}
            >
              {plan.popular ? (
                <span className="premium-showcase-popular">
                  <FaStar />
                  Most Popular
                </span>
              ) : null}
              <div className={`premium-showcase-plan-top ${plan.accent}`}>
                <h3>{plan.name}</h3>
                <div className="premium-showcase-price-row">
                  <strong>{plan.price}</strong>
                  <span>/month</span>
                </div>
              </div>
              <div className="premium-showcase-plan-body">
                <div className="premium-showcase-feature-list">
                  {plan.features.map((feature) => (
                    <div key={feature} className="premium-showcase-feature-item">
                      <span className="premium-showcase-check">
                        <FaCheck />
                      </span>
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
                <button type="button" className={`premium-showcase-cta ${plan.accent}`} onClick={() => handleSelectPlan(plan)}>
                  {plan.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedPlan ? (
        <section id="premium-checkout-card" className="premium-showcase-checkout">
          <div>
            <span className="premium-showcase-checkout-eyebrow">Selected plan</span>
            <h3>{selectedPlan.name} Membership</h3>
            <p>
              {selectedPlan.price} per month. Your plan includes concierge support, better access, and member-first care journeys.
            </p>
          </div>
          <div className="premium-showcase-checkout-actions">
            <button type="button" className="premium-showcase-primary-action" onClick={() => navigate("/app/wallet")}>
              Continue to Wallet
            </button>
            <button type="button" className="premium-showcase-secondary-action" onClick={() => navigate("/app/chat")}>
              Talk to Support
            </button>
          </div>
        </section>
      ) : null}

      <section className="premium-showcase-section">
        <h2>What Our Members Say</h2>
        <div className="premium-showcase-testimonials">
          {testimonials.map((item, index) => (
            <article key={item.name} className="premium-showcase-testimonial-card" style={{ animationDelay: `${0.16 * (index + 1)}s` }}>
              <div className="premium-showcase-stars">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <FaStar key={`${item.name}-${starIndex}`} />
                ))}
              </div>
              <p>{item.quote}</p>
              <div className="premium-showcase-person">
                <span>{item.initial}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-showcase-offer">
        <div className="premium-showcase-offer-icon">
          <FaBolt />
        </div>
        <h2>Limited Time Offer!</h2>
        <p>Get 2 months free on annual plans</p>
        <button type="button" className="premium-showcase-offer-button" onClick={handleClaimOffer}>Claim Offer Now</button>
      </section>
    </div>
  );
}
