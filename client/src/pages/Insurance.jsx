const benefits = [
  { title: "Comprehensive Protection", detail: "Cover clinic and emergency expenses" },
  { title: "Instant Claims", detail: "Claims processed in 24 hours" },
  { title: "Preventive Care", detail: "Annual health checkups included" },
  { title: "24/7 Support", detail: "Dedicated helpline always available" },
];

const plans = [
  {
    name: "Basic Care",
    price: "Rs 299",
    accent: "blue",
    cover: "up to Rs 50,000 coverage",
    items: ["Accident Coverage", "Basic Surgery", "Hospitalization", "Emergency Care"],
  },
  {
    name: "Complete Care",
    price: "Rs 599",
    accent: "pink",
    cover: "up to Rs 2,00,000 coverage",
    items: ["Everything in Basic", "Illness Coverage", "Advanced Surgery", "Chronic Treatment", "Dental Care"],
    recommended: true,
  },
  {
    name: "Lifetime Care",
    price: "Rs 999",
    accent: "orange",
    cover: "up to Rs 5,00,000 coverage",
    items: ["Everything in Complete", "Lifetime Coverage", "Alternative Therapies", "Specialist Consultations", "International Coverage"],
  },
];

const claimSteps = ["Visit Vet", "Upload Bills", "Get Approved", "Receive Payment"];

export default function Insurance() {
  return (
    <div className="care-page insurance-page">
      <header className="page-hero ocean">
        <div>
          <h1>Pet Insurance</h1>
          <p>Protect your furry family</p>
        </div>
      </header>

      <section className="offer-banner">Special launch offer: Get 2 months free on annual plans.</section>

      <section className="section-block">
        <div className="section-title-row">
          <h2>Why Pet Insurance?</h2>
        </div>
        <div className="feature-grid four">
          {benefits.map((item) => (
            <article key={item.title} className="feature-tile centered">
              <div className="feature-icon blue">{item.title.slice(0, 1)}</div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-title-row">
          <h2>Choose Your Coverage</h2>
        </div>
        <div className="premium-plan-stack">
          {plans.map((plan) => (
            <article key={plan.name} className={`premium-plan-card ${plan.accent}${plan.recommended ? " popular" : ""}`}>
              {plan.recommended ? <span className="premium-popular-badge">RECOMMENDED</span> : null}
              <div className={`premium-plan-icon ${plan.accent}`}>I</div>
              <h3>{plan.name}</h3>
              <div className="premium-price-row">
                <strong>{plan.price}</strong>
                <span>/month</span>
              </div>
              <p className="plan-cover">{plan.cover}</p>
              <div className="premium-feature-list">
                {plan.items.map((item) => (
                  <div key={item} className="premium-feature-item">
                    <span className={`premium-check ${plan.accent}`}>+</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <button className={`premium-cta ${plan.accent}`}>Get Covered Now</button>
            </article>
          ))}
        </div>
      </section>

      <section className="claim-process-card">
        <h2>Easy Claim Process</h2>
        <div className="claim-steps">
          {claimSteps.map((step, index) => (
            <div key={step} className="claim-step">
              <span>{index + 1}</span>
              <div>
                <strong>{step}</strong>
                <p>
                  {index === 0
                    ? "Get treatment at any partner clinic"
                    : index === 1
                      ? "Submit documents through the app"
                      : index === 2
                        ? "Instant approval in 24 hours"
                        : "Direct bank transfer"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="insurance-foot-stats">
        <div>
          <strong>15K+</strong>
          <span>Pets insured</span>
        </div>
        <div>
          <strong>98%</strong>
          <span>Claim approval</span>
        </div>
        <div>
          <strong>24 hrs</strong>
          <span>Processing</span>
        </div>
      </section>
    </div>
  );
}

