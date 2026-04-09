import { useNavigate } from "react-router-dom";
import PageSection from "../components/ui/PageSection";
import useAppData from "../services/useAppData";

const groomingOptions = [
  {
    title: "Quick Freshen Up",
    detail: "Bath, dry, paw cleanup, and light coat finishing for routine upkeep.",
    to: "/app/booking?service=luxury-grooming&mode=visit",
  },
  {
    title: "Sensitive Skin Care",
    detail: "Low-irritation products, gentle handling, and comfort-first grooming steps.",
    to: "/app/booking?service=luxury-grooming&mode=visit",
  },
  {
    title: "Full Coat Reset",
    detail: "De-shedding, trimming, hygiene care, and full spa-style grooming support.",
    to: "/app/booking?service=spa-wellness&mode=visit",
  },
];

export default function Grooming() {
  const navigate = useNavigate();
  const { data, loading } = useAppData();

  if (loading || !data) {
    return <div className="panel">Loading grooming plans...</div>;
  }

  return (
    <div className="page-stack">
      <PageSection title="Grooming options" subtitle="Start with the type of grooming experience you want.">
        <div className="card-grid">
          {groomingOptions.map((option) => (
            <button key={option.title} type="button" className="panel clickable-panel" onClick={() => navigate(option.to)}>
              <span className="eyebrow">Option</span>
              <h3>{option.title}</h3>
              <p>{option.detail}</p>
            </button>
          ))}
        </div>
      </PageSection>

      <PageSection title="Grooming packages" subtitle="Choose quick upkeep or a full spa reset.">
        <div className="card-grid">
          {data.groomingPackages.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              className="panel clickable-panel"
              onClick={() => navigate(`/app/booking?service=${pkg.id === "groom-2" ? "spa-wellness" : "luxury-grooming"}&mode=visit`)}
            >
              <h3>{pkg.name}</h3>
              <p>{pkg.includes}</p>
              <p>{pkg.duration}</p>
              <strong>Rs {pkg.price}</strong>
            </button>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
