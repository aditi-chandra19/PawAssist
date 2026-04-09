import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageSection from "../components/ui/PageSection";
import useAppData from "../services/useAppData";

const providerRoleByService = {
  "pet-walking": ["Walker"],
  "pet-sitting": ["Pet Sitter"],
  "pet-hotel": ["Boarding Partner"],
  "pet-taxi": ["Transport Partner"],
  training: ["Canine Trainer"],
  "fitness-training": ["Fitness Coach"],
  "custom-diet": ["Nutritionist"],
  grooming: ["Certified Groomer"],
  "luxury-grooming": ["Certified Groomer"],
  "spa-wellness": ["Certified Groomer"],
};

export default function Provider() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data, loading } = useAppData();
  const selectedServiceId = searchParams.get("service") || "";

  const selectedService = useMemo(
    () => data?.services?.find((service) => service.id === selectedServiceId) || null,
    [data?.services, selectedServiceId],
  );

  const visibleProviders = useMemo(() => {
    const providers = data?.providers || [];

    if (!providers.length) {
      return [];
    }

    const allowedRoles = providerRoleByService[selectedServiceId];
    if (!allowedRoles?.length) {
      return providers;
    }

    return providers.filter((provider) => allowedRoles.includes(provider.role));
  }, [data, selectedServiceId]);

  if (loading || !data) {
    return <div className="panel">Loading provider network...</div>;
  }

  const handleSelectProvider = (providerId) => {
    const mode = selectedService?.mode || "default";
    const query = new URLSearchParams({ service: selectedServiceId, mode, provider: providerId });
    navigate(`/app/booking?${query.toString()}`);
  };

  return (
    <div className="page-stack">
      <PageSection
        title={selectedService ? `${selectedService.name} providers` : "Partner providers"}
        subtitle={
          selectedService
            ? `Available partners for ${selectedService.name.toLowerCase()}.`
            : "See specialties, distance, and next available slots."
        }
      >
        <div className="card-grid">
          {visibleProviders.map((provider) => (
            <button key={provider.id} type="button" className="panel clickable-panel" onClick={() => handleSelectProvider(provider.id)}>
              <h3>{provider.name}</h3>
              <p>{provider.role}</p>
              <p>
                {provider.distance} away • ETA {provider.eta}
              </p>
              <p>Languages: {provider.languages.join(", ")}</p>
              <p>Specialties: {provider.specialties.join(", ")}</p>
              <strong>{provider.nextSlot}</strong>
            </button>
          ))}
        </div>
        {!visibleProviders.length ? (
          <div className="panel">
            <h3>No providers found</h3>
            <p>We couldn't find a direct provider match for this service yet. Please try another service flow.</p>
          </div>
        ) : null}
      </PageSection>
    </div>
  );
}
