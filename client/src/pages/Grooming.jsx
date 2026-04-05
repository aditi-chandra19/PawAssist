import PageSection from "../components/ui/PageSection";
import useAppData from "../services/useAppData";

export default function Grooming() {
  const { data, loading } = useAppData();

  if (loading || !data) {
    return <div className="panel">Loading grooming plans...</div>;
  }

  return (
    <div className="page-stack">
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
