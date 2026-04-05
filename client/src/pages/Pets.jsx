import useAppData from "../services/useAppData";

const petPhotos = {
  "pet-1":
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80",
  "pet-2":
    "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=600&q=80",
};

const petSummaries = {
  "pet-1": {
    healthScore: 95,
    breed: "Labrador Retriever",
    vaccinationStatus: "Up to date",
    nextCheckup: "Apr 15, 2026",
    featured: true,
  },
  "pet-2": {
    healthScore: 88,
    breed: "Persian Cat",
    vaccinationStatus: "Pending",
    nextCheckup: "Apr 8, 2026",
    featured: false,
  },
};

const defaultSummary = {
  healthScore: 90,
  breed: "Companion Pet",
  vaccinationStatus: "Up to date",
  nextCheckup: "Apr 20, 2026",
  featured: false,
};

const getPetSummary = (pet) => {
  if (!pet) {
    return defaultSummary;
  }

  if (petSummaries[pet.id]) {
    return petSummaries[pet.id];
  }

  if (pet.id?.startsWith("pet-1")) {
    return petSummaries["pet-1"];
  }

  if (pet.id?.startsWith("pet-2")) {
    return petSummaries["pet-2"];
  }

  return {
    ...defaultSummary,
    breed: pet.type || defaultSummary.breed,
    featured: pet.name?.toLowerCase() === "bruno",
  };
};

const getPetPhoto = (pet) => {
  if (!pet) {
    return "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80";
  }

  if (petPhotos[pet.id]) {
    return petPhotos[pet.id];
  }

  if (pet.id?.startsWith("pet-1")) {
    return petPhotos["pet-1"];
  }

  if (pet.id?.startsWith("pet-2")) {
    return petPhotos["pet-2"];
  }

  return "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80";
};

const managementCards = [
  { title: "Medical Records", detail: "24 records", tone: "blue" },
  { title: "Vaccinations", detail: "All complete", tone: "green" },
  { title: "Medications", detail: "2 active", tone: "pink" },
  { title: "Activity Log", detail: "Last 30 days", tone: "orange" },
];

export default function Pets() {
  const { data, loading } = useAppData();

  if (loading || !data) {
    return <div className="panel">Loading pet profiles...</div>;
  }

  return (
    <div className="care-page pets-page">
      <header className="page-hero compact">
        <div>
          <h1>My Pets</h1>
          <p>Managing {data.pets.length} furry friends</p>
        </div>
        <button className="page-hero-action">+ Add New Pet</button>
      </header>

      <section className="pets-grid">
        {data.pets.filter(Boolean).map((pet, index) => {
          const summary = getPetSummary(pet) || defaultSummary;
          const petName = pet?.name || `Pet ${index + 1}`;
          const petAge = pet?.age || "Unknown";
          const petWeight = pet?.weight || "Unknown";
          return (
            <article key={pet?.id || `pet-${index}`} className="pet-profile-card">
              <div className="pet-profile-top">
                <div className="pet-profile-identity">
                  <div className="pet-photo-wrap">
                    <img src={getPetPhoto(pet)} alt={petName} className="pet-photo" />
                    <div className="pet-score-badge">
                      <strong>{summary?.healthScore ?? defaultSummary.healthScore}</strong>
                      <span>Health</span>
                    </div>
                  </div>
                  <div>
                    <h2>{petName}</h2>
                    <p>
                      <strong>Breed:</strong> {summary?.breed || defaultSummary.breed}
                    </p>
                    <p>
                      <strong>Age:</strong> {petAge} <span className="dot-sep">•</span>{" "}
                      <strong>Weight:</strong> {petWeight}
                    </p>
                  </div>
                </div>
                <div className={`pet-crown ${summary?.featured ? "active" : ""}`}>VIP</div>
              </div>

              <div className="pet-status-grid">
                <div className={`pet-status-card ${summary?.vaccinationStatus === "Pending" ? "warning" : "success"}`}>
                  <span>Vaccination</span>
                  <strong>{summary?.vaccinationStatus || defaultSummary.vaccinationStatus}</strong>
                </div>
                <div className="pet-status-card info">
                  <span>Next Checkup</span>
                  <strong>{summary?.nextCheckup || defaultSummary.nextCheckup}</strong>
                </div>
              </div>

              <div className="pet-action-row">
                <button className="gradient-button violet">Book Checkup</button>
                <button className="gradient-button rose">Health Tracker</button>
                <button className="gradient-button cyan">View Insights</button>
              </div>

              <button className="full-gradient-button">View Full Profile</button>
            </article>
          );
        })}
      </section>

      <section className="section-block">
        <div className="section-title-row">
          <h2>Health Management</h2>
        </div>
        <div className="feature-grid four">
          {managementCards.map((card) => (
            <article key={card.title} className="feature-tile">
              <div className={`feature-icon ${card.tone}`}>{card.title.slice(0, 1)}</div>
              <h3>{card.title}</h3>
              <p>{card.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

