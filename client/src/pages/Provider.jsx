import PageSection from "../components/ui/PageSection";
import useAppData from "../services/useAppData";

export default function Provider() {
  const { data, loading } = useAppData();

  if (loading || !data) {
    return <div className="panel">Loading provider network...</div>;
  }

  return (
    <div className="page-stack">
      <PageSection title="Partner providers" subtitle="See specialties, distance, and next available slots.">
        <div className="card-grid">
          {data.providers.map((provider) => (
            <article key={provider.id} className="panel">
              <h3>{provider.name}</h3>
              <p>{provider.role}</p>
              <p>
                {provider.distance} away • ETA {provider.eta}
              </p>
              <p>Languages: {provider.languages.join(", ")}</p>
              <p>Specialties: {provider.specialties.join(", ")}</p>
              <strong>{provider.nextSlot}</strong>
            </article>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
