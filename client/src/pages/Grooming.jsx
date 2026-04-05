import PageSection from "../components/ui/PageSection";
import useAppData from "../services/useAppData";

const groomingOptions = [
  {
    title: "Quick Freshen Up",
    detail: "Bath, dry, paw cleanup, and light coat finishing for routine upkeep.",
  },
  {
    title: "Sensitive Skin Care",
    detail: "Low-irritation products, gentle handling, and comfort-first grooming steps.",
  },
  {
    title: "Full Coat Reset",
    detail: "De-shedding, trimming, hygiene care, and full spa-style grooming support.",
  },
];

export default function Grooming() {
  const { data, loading } = useAppData();

  if (loading || !data) {
    return <div className="panel">Loading grooming plans...</div>;
  }

  return (
    <div className="page-stack">
      <PageSection title="Grooming options" subtitle="Start with the type of grooming experience you want.">
        <div className="card-grid">
          {groomingOptions.map((option) => (
            <article key={option.title} className="panel">
              <span className="eyebrow">Option</span>
              <h3>{option.title}</h3>
              <p>{option.detail}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection title="Grooming packages" subtitle="Choose quick upkeep or a full spa reset.">
        <div className="card-grid">
          {data.groomingPackages.map((pkg) => (
            <article key={pkg.id} className="panel">
              <h3>{pkg.name}</h3>
              <p>{pkg.includes}</p>
              <p>{pkg.duration}</p>
              <strong>Rs {pkg.price}</strong>
            </article>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
