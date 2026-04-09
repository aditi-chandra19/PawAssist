import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppData from "../services/useAppData";
import useUserStore from "../store/useUserStore";
import { createPet, deletePet, updatePet } from "../services/petService";

const petPhotos = {
  "pet-1":
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
  "pet-2":
    "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80",
};

const petSummaries = {
  "pet-1": {
    healthScore: 95,
    breed: "Labrador Retriever",
    vaccinationStatus: "Up to date",
    nextCheckup: "Apr 15, 2026",
    gender: "Male",
    featured: true,
    medicalHistory: "Healthy overall. Routine joint support and annual boosters.",
    allergies: "None",
    dietaryNeeds: "Chicken, pumpkin, probiotic topper",
    color: "Golden",
  },
  "pet-2": {
    healthScore: 88,
    breed: "Persian Cat",
    vaccinationStatus: "Pending Booster",
    nextCheckup: "Apr 8, 2026",
    gender: "Female",
    featured: false,
    medicalHistory: "Sensitive digestion. Booster follow-up is due soon.",
    allergies: "Dust sensitivity",
    dietaryNeeds: "Salmon kibble and wet food at night",
    color: "Cream",
  },
};

const defaultSummary = {
  healthScore: 90,
  breed: "Companion Pet",
  vaccinationStatus: "Up to date",
  nextCheckup: "Apr 20, 2026",
  gender: "Male",
  featured: false,
  medicalHistory: "No major conditions shared yet.",
  allergies: "None",
  dietaryNeeds: "Balanced diet",
  color: "Brown",
};

const managementCards = [
  { title: "Medical Records", tone: "blue", icon: "MR" },
  { title: "Vaccinations", tone: "green", icon: "VC" },
  { title: "Medications", tone: "pink", icon: "MD" },
  { title: "Activity Log", tone: "orange", icon: "AL" },
];

const quickActions = [
  { title: "Book Checkup", tone: "violet", to: "/app/booking?service=premium-vet-visit&mode=consult", icon: "CL" },
  { title: "Health Tracker", tone: "rose", to: "/app/health", icon: "HT" },
  { title: "View Insights", tone: "cyan", to: "/app/ai-assistant", icon: "VI" },
];

const initialForm = {
  name: "",
  petType: "Dog",
  breed: "",
  gender: "Male",
  age: "",
  weight: "",
  color: "",
  medicalHistory: "",
  allergies: "None",
  dietaryNeeds: "",
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
    breed: pet.breed || pet.type || defaultSummary.breed,
    gender: pet.gender || defaultSummary.gender,
    medicalHistory: pet.medicalHistory || defaultSummary.medicalHistory,
    allergies: pet.allergies || defaultSummary.allergies,
    dietaryNeeds: pet.diet || pet.dietaryNeeds || defaultSummary.dietaryNeeds,
    color: pet.color || defaultSummary.color,
    featured: pet.name?.toLowerCase() === "bruno",
  };
};

const getPetPhoto = (pet) => {
  if (!pet) {
    return "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80";
  }

  if (pet.photo) {
    return pet.photo;
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

  return "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80";
};

const normalizePet = (pet, index) => {
  const summary = getPetSummary(pet);
  return {
    id: pet?.id || `pet-${index + 1}`,
    name: pet?.name || `Pet ${index + 1}`,
    petType: pet?.type || "Dog",
    breed: pet?.breed || summary.breed,
    age: pet?.age || "3 years",
    weight: pet?.weight || "25 kg",
    gender: pet?.gender || summary.gender,
    color: pet?.color || summary.color,
    healthScore: summary.healthScore,
    vaccinationStatus: summary.vaccinationStatus,
    nextCheckup: summary.nextCheckup,
    medicalHistory: pet?.medicalHistory || summary.medicalHistory,
    allergies: pet?.allergies || summary.allergies,
    dietaryNeeds: pet?.diet || summary.dietaryNeeds,
    featured: summary.featured,
    photo: getPetPhoto(pet),
  };
};

export default function PetsDashboardPage() {
  const navigate = useNavigate();
  const { data, loading, refresh } = useAppData();
  const user = useUserStore((state) => state.user);
  const [pets, setPets] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!data?.pets) {
      return;
    }

    setPets(data.pets.filter(Boolean).map(normalizePet));
  }, [data]);

  const totals = useMemo(() => {
    const dueVaccines = pets.filter((pet) => pet.vaccinationStatus === "Pending Booster").length;
    return {
      records: pets.length * 12,
      dueVaccines,
      medications: Math.max(2, pets.length),
    };
  }, [pets]);

  const resetForm = () => setForm(initialForm);

  const handleOpenAdd = () => {
    setSelectedPet(null);
    setErrorMessage("");
    resetForm();
    setIsAddOpen(true);
  };

  const handleViewDetails = (pet) => {
    setErrorMessage("");
    setSelectedPet(pet);
    setForm({
      name: pet.name,
      petType: pet.petType,
      breed: pet.breed,
      gender: pet.gender,
      age: pet.age,
      weight: pet.weight,
      color: pet.color,
      medicalHistory: pet.medicalHistory,
      allergies: pet.allergies,
      dietaryNeeds: pet.dietaryNeeds,
    });
  };

  const handleCloseModal = () => {
    setIsAddOpen(false);
    setSelectedPet(null);
    setErrorMessage("");
    resetForm();
  };

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const buildPetPayload = () => ({
    name: form.name.trim() || "New Pet",
    type: form.petType,
    breed: form.breed.trim() || form.petType,
    gender: form.gender,
    age: form.age.trim() || "2 years",
    weight: form.weight.trim() || "8 kg",
    color: form.color.trim() || "Brown",
    medicalHistory: form.medicalHistory.trim() || "No major medical history shared yet.",
    allergies: form.allergies.trim() || "None",
    dietaryNeeds: form.dietaryNeeds.trim() || "Balanced diet",
    diet: form.dietaryNeeds.trim() || "Balanced diet",
    photo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
  });

  const handleSavePet = async () => {
    if (!user?.id) {
      setErrorMessage("Please log in again to manage pets.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const payload = buildPetPayload();

      if (selectedPet?.id) {
        await updatePet(selectedPet.id, payload);
      } else {
        await createPet(payload);
      }

      await refresh();
      handleCloseModal();
    } catch (error) {
      setErrorMessage(error.message || "Unable to save pet right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePet = async (pet) => {
    if (!user?.id || !pet?.id) {
      return;
    }

    setErrorMessage("");

    try {
      await deletePet(pet.id);
      await refresh();

      if (selectedPet?.id === pet.id) {
        handleCloseModal();
      }
    } catch (error) {
      setErrorMessage(error.message || "Unable to delete pet right now.");
    }
  };

  if (loading || !data) {
    return <div className="panel">Loading pet profiles...</div>;
  }

  return (
    <div className="care-page pets-dashboard-page">
      <header className="pets-overview-header">
        <div>
          <h1>My Pets</h1>
          <p>Manage your pet profiles and health records</p>
        </div>
        <button type="button" className="page-hero-action" onClick={handleOpenAdd}>
          + Add New Pet
        </button>
      </header>

      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

      <section className="pets-reference-grid">
        {pets.map((pet) => (
          <article key={pet.id} className="pet-reference-card">
            <div
              className="pet-reference-cover"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.76)), url(${pet.photo})`,
              }}
            >
              <div className="pet-reference-tools">
                <button type="button" className="pet-tool-button" onClick={() => handleViewDetails(pet)} aria-label={`Edit ${pet.name}`}>
                  ED
                </button>
                <button type="button" className="pet-tool-button danger" onClick={() => handleDeletePet(pet)} aria-label={`Delete ${pet.name}`}>
                  DL
                </button>
              </div>

              {pet.featured ? <div className="pet-premium-badge">Premium</div> : null}

              <div className="pet-reference-copy">
                <h2>{pet.name}</h2>
                <p>{pet.breed}</p>
              </div>
            </div>

            <div className="pet-reference-body">
              <div className="pet-reference-stats">
                <div>
                  <span>Age</span>
                  <strong>{pet.age}</strong>
                </div>
                <div>
                  <span>Weight</span>
                  <strong>{pet.weight}</strong>
                </div>
                <div>
                  <span>Gender</span>
                  <strong>{pet.gender}</strong>
                </div>
              </div>

              <div className="pet-health-score-row">
                <span>Health Score</span>
                <strong>{pet.healthScore}%</strong>
              </div>
              <div className="pet-health-progress">
                <div style={{ width: `${pet.healthScore}%` }} />
              </div>

              <div className={`pet-detail-strip ${pet.vaccinationStatus === "Pending Booster" ? "warning" : "success"}`}>
                <div>
                  <span>Vaccination</span>
                  <strong>{pet.vaccinationStatus}</strong>
                </div>
                <span className="pet-detail-icon">ED</span>
              </div>

              <div className="pet-detail-strip lavender">
                <div>
                  <span>Next Checkup</span>
                  <strong>{pet.nextCheckup}</strong>
                </div>
                <span className="pet-detail-icon">DT</span>
              </div>

              <div className="pet-reference-actions">
                <button type="button" className="gradient-button cyan" onClick={() => handleViewDetails(pet)}>
                  View Details
                </button>
                <button type="button" className="gradient-button violet" onClick={() => navigate("/app/booking?service=premium-vet-visit&mode=consult")}>
                  Book Service
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="pets-management-grid">
        {managementCards.map((card) => (
          <article key={card.title} className="pets-management-card">
            <div className={`feature-icon ${card.tone}`}>{card.icon}</div>
            <h3>{card.title}</h3>
            <p>
              {card.title === "Medical Records"
                ? `${totals.records} records`
                : card.title === "Vaccinations"
                  ? (totals.dueVaccines ? `${totals.dueVaccines} due` : "All complete")
                  : card.title === "Medications"
                    ? `${totals.medications} active`
                    : "Last 30 days"}
            </p>
          </article>
        ))}
      </section>

      <section className="pets-quick-actions">
        <div className="section-title-row">
          <h2>Quick Actions</h2>
        </div>
        <div className="pets-quick-actions-grid">
          {quickActions.map((action) => (
            <button
              key={action.title}
              type="button"
              className={`pets-quick-action ${action.tone}`}
              onClick={() => navigate(action.to)}
            >
              <span>{action.icon}</span>
              {action.title}
            </button>
          ))}
        </div>
      </section>

      {(isAddOpen || selectedPet) ? (
        <div className="pet-modal-overlay" role="presentation" onClick={handleCloseModal}>
          <div className="pet-modal-card" role="dialog" aria-modal="true" aria-labelledby="pet-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="pet-modal-head">
              <h2 id="pet-modal-title">{selectedPet ? `Edit ${selectedPet.name}` : "Add New Pet"}</h2>
              <button type="button" className="pet-modal-close" onClick={handleCloseModal}>
                X
              </button>
            </div>

            {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

            <div className="pet-modal-form-grid">
              <label className="pet-modal-field">
                <span>Pet Name *</span>
                <input value={form.name} onChange={handleChange("name")} placeholder="Enter pet name" />
              </label>
              <label className="pet-modal-field">
                <span>Pet Type *</span>
                <select value={form.petType} onChange={handleChange("petType")}>
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Bird</option>
                  <option>Rabbit</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="pet-modal-field">
                <span>Breed *</span>
                <input value={form.breed} onChange={handleChange("breed")} placeholder="Enter breed" />
              </label>
              <label className="pet-modal-field">
                <span>Gender</span>
                <select value={form.gender} onChange={handleChange("gender")}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>
              <label className="pet-modal-field">
                <span>Age</span>
                <input value={form.age} onChange={handleChange("age")} placeholder="e.g., 3 years" />
              </label>
              <label className="pet-modal-field">
                <span>Weight</span>
                <input value={form.weight} onChange={handleChange("weight")} placeholder="e.g., 25 kg" />
              </label>
              <label className="pet-modal-field">
                <span>Color</span>
                <input value={form.color} onChange={handleChange("color")} placeholder="e.g., Golden" />
              </label>
            </div>

            <label className="pet-modal-field full">
              <span>Medical History</span>
              <textarea value={form.medicalHistory} onChange={handleChange("medicalHistory")} placeholder="Any medical conditions or history..." />
            </label>

            <div className="pet-modal-form-grid lower">
              <label className="pet-modal-field">
                <span>Allergies</span>
                <input value={form.allergies} onChange={handleChange("allergies")} placeholder="None" />
              </label>
              <label className="pet-modal-field">
                <span>Dietary Needs</span>
                <input value={form.dietaryNeeds} onChange={handleChange("dietaryNeeds")} placeholder="e.g., High-protein" />
              </label>
            </div>

            <div className="pet-modal-actions">
              <button type="button" className="pet-modal-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="button" className="pet-modal-primary" onClick={handleSavePet} disabled={isSaving}>
                {isSaving ? "Saving..." : (selectedPet ? "Save Changes" : "Add Pet")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
