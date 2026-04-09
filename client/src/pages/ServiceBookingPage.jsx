import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAppData from "../services/useAppData";
import { createBooking } from "../services/bookingService";

const bookingSteps = [
  "Choose Service",
  "Select Pet",
  "Date & Time",
  "Choose Provider",
  "Confirm Booking",
];

const defaultSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
const emergencySlots = ["Within 10 mins", "Within 20 mins", "Within 30 mins", "Within 45 mins"];

const serviceDecor = {
  "vet-visit": { tone: "cyan", icon: "VC", tags: ["HD Video Consultation", "Prescription Service", "Health Report", "Follow-up Support"] },
  ambulance: { tone: "orange", icon: "EA", tags: ["ICU Ambulance", "Emergency Vet", "Oxygen Support", "Direct Hospital Transfer"] },
  "ai-health": { tone: "pink", icon: "AI", tags: ["24/7 AI Support", "Symptom Analysis", "Health Tracking", "Vaccination Reminders"] },
  "premium-vet-visit": { tone: "blue", icon: "PV", tags: ["Home Visit", "Complete Checkup", "Health Report", "Treatment Plan"] },
  "home-vaccination": { tone: "green", icon: "HV", tags: ["All Vaccines", "Vaccination Card", "Next Dose Reminder", "Health Assessment"] },
  "medicine-express": { tone: "violet", icon: "ME", tags: ["Fast Delivery", "Pharmacist Verification", "Medicine Information", "Dosage Instructions"] },
  "health-checkup": { tone: "orange", icon: "HC", tags: ["Blood Test", "Urine Test", "Digital Reports", "Vet Consultation"] },
  "cardiac-screening": { tone: "rose", icon: "CS", tags: ["ECG Test", "Heart Monitoring", "Specialist Report", "Treatment Plan"] },
  "luxury-grooming": { tone: "pink", icon: "LG", tags: ["Bath & Dry", "Hair Cut", "Nail Trim", "Ear Cleaning"] },
  "spa-wellness": { tone: "lavender", icon: "SW", tags: ["Full Spa", "Massage", "Aromatherapy", "Skin Treatment"] },
  "custom-diet": { tone: "green", icon: "CD", tags: ["Nutritionist Consult", "Custom Meal Plan", "Recipe Guide", "Monthly Follow-up"] },
  training: { tone: "purple", icon: "BT", tags: ["5 Training Sessions", "Behavior Assessment", "Training Plan", "Progress Tracking"] },
  "fitness-training": { tone: "gold", icon: "FT", tags: ["Fitness Plan", "Mobility Routine", "Diet Advice", "Progress Check"] },
  "pet-walking": { tone: "sky", icon: "PW", tags: ["Daily Walk", "Activity Report", "Photo Updates", "GPS Tracking"] },
  "pet-sitting": { tone: "lavender", icon: "PS", tags: ["Trusted Sitter", "Home Care", "Feeding Updates", "Photo Check-ins"] },
  "pet-hotel": { tone: "coral", icon: "PH", tags: ["5-Star Suite", "24/7 Care", "Live Video", "Daily Updates"] },
  "pet-taxi": { tone: "teal", icon: "TX", tags: ["Safe Transit", "Clinic Drop", "Trained Handler", "Live Tracking"] },
};

const providerPhotos = {
  "provider-1": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=240&q=80",
  "provider-4": "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=240&q=80",
  "provider-6": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=240&q=80",
  "provider-16": "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=240&q=80",
  "provider-17": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=240&q=80",
  "provider-18": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=240&q=80",
  "provider-19": "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=240&q=80",
};

const petIcons = {
  Dog: "DG",
  Cat: "CT",
  Bird: "BD",
  Rabbit: "RB",
  Other: "PT",
};

const doctorRoles = ["Emergency Vet", "Vaccination Specialist", "Cardiac Specialist"];

const createDefaultDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 8);
  return date.toISOString().slice(0, 10);
};

const formatDateLabel = (value) => {
  if (!value) {
    return "Select date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
};

const getServiceTone = (service) => serviceDecor[service.id]?.tone || "cyan";
const getServiceIcon = (service) => serviceDecor[service.id]?.icon || service.name.slice(0, 2).toUpperCase();
const getServiceTags = (service) => serviceDecor[service.id]?.tags || [service.eta, service.category, service.mode, "Care Support"];

const normalizePet = (pet, index) => ({
  ...pet,
  id: pet.id || pet.petId || `pet-${index + 1}`,
  petType: pet.petType || (pet.type?.toLowerCase().includes("cat") ? "Cat" : "Dog"),
});

const getMatchingProviders = (providers, service) => {
  if (!service) {
    return providers;
  }

  if (doctorRoles.includes(service.providerRole)) {
    return providers.filter((provider) => doctorRoles.includes(provider.role));
  }

  return providers.filter((provider) => provider.role === service.providerRole);
};

export default function ServiceBookingPage() {
  const [searchParams] = useSearchParams();
  const { data, loading, refresh } = useAppData();
  const requestedService = searchParams.get("service") || "vet-visit";
  const mode = searchParams.get("mode") || "default";
  const requestedProvider = searchParams.get("provider") || "";
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(requestedService);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedDate, setSelectedDate] = useState(createDefaultDate());
  const [selectedTime, setSelectedTime] = useState(mode === "emergency" ? emergencySlots[0] : defaultSlots[0]);
  const [selectedProvider, setSelectedProvider] = useState(requestedProvider);
  const [providerAvailability, setProviderAvailability] = useState("all");
  const [providerSort, setProviderSort] = useState("rating");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allPets = useMemo(() => (data?.pets || []).map(normalizePet), [data?.pets]);

  const availableServices = useMemo(() => {
    const blockedIds = ["support-247", "lost-found", "pet-insurance"];
    const filtered = (data?.services || []).filter((service) => !blockedIds.includes(service.id));

    if (mode === "emergency" || requestedService === "ambulance") {
      return filtered.filter((service) => service.id === "ambulance");
    }

    return filtered.filter((service) => [
      "vet-visit",
      "ambulance",
      "ai-health",
      "premium-vet-visit",
      "home-vaccination",
      "medicine-express",
      "health-checkup",
      "cardiac-screening",
      "luxury-grooming",
      "spa-wellness",
      "custom-diet",
      "fitness-training",
      "training",
      "pet-walking",
      "pet-sitting",
      "pet-hotel",
      "pet-taxi",
    ].includes(service.id));
  }, [data?.services, mode, requestedService]);

  const selectedServiceDetails = availableServices.find((service) => service.id === selectedService) || availableServices[0];
  const timeSlots = mode === "emergency" || selectedServiceDetails?.id === "ambulance" ? emergencySlots : defaultSlots;

  const providerPool = useMemo(
    () => getMatchingProviders(data?.providers || [], selectedServiceDetails),
    [data?.providers, selectedServiceDetails],
  );

  const filteredProviders = useMemo(() => {
    const parseDistance = (value) => {
      const match = String(value || "").match(/[\d.]+/);
      return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
    };

    const parseEta = (value) => {
      const match = String(value || "").match(/[\d.]+/);
      return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
    };

    let list = [...providerPool];

    if (providerAvailability === "available") {
      list = list.filter((provider) => provider.nextSlot?.toLowerCase().includes("available") || provider.nextSlot?.toLowerCase().includes("today"));
    }

    if (providerSort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (providerSort === "eta") {
      list.sort((a, b) => parseEta(a.eta) - parseEta(b.eta));
    } else {
      list.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
    }

    return list;
  }, [providerAvailability, providerPool, providerSort]);

  const selectedPetDetails = allPets.find((pet) => pet.id === selectedPet) || allPets[0];
  const selectedProviderDetails = filteredProviders.find((provider) => provider.id === selectedProvider) || filteredProviders[0] || providerPool[0];
  const serviceFee = Number(selectedServiceDetails?.price || 0);
  const gst = Number((serviceFee * 0.18).toFixed(2));
  const total = Number((serviceFee + gst).toFixed(2));

  useEffect(() => {
    setSelectedService(requestedService);
  }, [requestedService]);

  useEffect(() => {
    if (availableServices[0] && !availableServices.some((service) => service.id === selectedService)) {
      setSelectedService(availableServices[0].id);
    }
  }, [availableServices, selectedService]);

  useEffect(() => {
    if (allPets[0] && !selectedPet) {
      setSelectedPet(allPets[0].id);
    }
  }, [allPets, selectedPet]);

  useEffect(() => {
    if (timeSlots[0] && !timeSlots.includes(selectedTime)) {
      setSelectedTime(timeSlots[0]);
    }
  }, [selectedTime, timeSlots]);

  useEffect(() => {
    if (requestedProvider && providerPool.some((provider) => provider.id === requestedProvider)) {
      setSelectedProvider(requestedProvider);
    }
  }, [providerPool, requestedProvider]);

  useEffect(() => {
    if (providerPool[0] && !providerPool.some((provider) => provider.id === selectedProvider)) {
      setSelectedProvider(providerPool[0].id);
    }
  }, [providerPool, selectedProvider]);

  useEffect(() => {
    if (filteredProviders[0] && !filteredProviders.some((provider) => provider.id === selectedProvider)) {
      setSelectedProvider(filteredProviders[0].id);
    }
  }, [filteredProviders, selectedProvider]);

  if (loading || !data) {
    return <div className="panel">Loading booking tools...</div>;
  }

  const canContinue =
    (currentStep === 1 && selectedServiceDetails) ||
    (currentStep === 2 && selectedPetDetails) ||
    (currentStep === 3 && selectedDate && selectedTime) ||
    (currentStep === 4 && selectedProviderDetails) ||
    currentStep === 5;

  const handleContinue = () => {
    if (currentStep < 5 && canContinue) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleConfirm = async () => {
    if (!selectedServiceDetails || !selectedPetDetails || !selectedProviderDetails) {
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      await createBooking({
        serviceId: selectedServiceDetails.id,
        providerId: selectedProviderDetails.id,
        petId: selectedPetDetails.id,
        date: new Date(selectedDate).toISOString(),
        time: selectedTime,
        note: `Booked from ${mode} care flow`,
      });

      setStatus("Booking confirmed successfully.");
      await refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="care-page booking-wizard-page">
      <header className="booking-wizard-header">
        <button type="button" className="booking-back-pill" onClick={handleBack} disabled={currentStep === 1}>
          Back
        </button>
        <div>
          <h1>Book Your Service</h1>
          <p>Step {currentStep} of 5</p>
        </div>
      </header>

      <section className="booking-wizard-shell">
        <div className="booking-stepper" aria-label="Booking progress">
          {bookingSteps.map((label, index) => {
            const stepNumber = index + 1;
            const state = stepNumber < currentStep ? "done" : stepNumber === currentStep ? "active" : "upcoming";

            return (
              <div key={label} className={`booking-step ${state}`}>
                <div className="booking-step-indicator">{state === "done" ? "Done" : stepNumber}</div>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        {currentStep === 1 ? (
          <section className="booking-panel">
            <div className="booking-panel-head">
              <div>
                <h2>Choose Your Service</h2>
              </div>
            </div>

            <div className="booking-service-grid">
              {availableServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={`booking-service-card ${selectedService === service.id ? "selected" : ""}`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="booking-service-card-head">
                    <div className={`booking-service-icon tone-${getServiceTone(service)}`}>{getServiceIcon(service)}</div>
                    <div>
                      <h3>{service.name}</h3>
                      <p>{service.category} • {service.eta}</p>
                    </div>
                  </div>
                  <p className="booking-service-description">{service.description}</p>
                  <div className="booking-service-divider" />
                  <span className="booking-service-includes">Includes:</span>
                  <div className="booking-service-tags">
                    {getServiceTags(service).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <strong className="booking-service-price">Rs {service.price}</strong>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {currentStep === 2 ? (
          <section className="booking-panel booking-panel-narrow">
            <div className="booking-panel-head">
              <div>
                <h2>Select Your Pet</h2>
              </div>
            </div>

            <div className="booking-pet-grid">
              {allPets.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  className={`booking-pet-card ${selectedPet === pet.id ? "selected" : ""}`}
                  onClick={() => setSelectedPet(pet.id)}
                >
                  <div className="booking-pet-icon">{petIcons[pet.petType] || "PT"}</div>
                  <h3>{pet.name}</h3>
                  <p>{pet.petType} • {pet.type || pet.petType}</p>
                  <span>Age: {pet.age} • Weight: {pet.weight}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {currentStep === 3 ? (
          <section className="booking-panel booking-panel-narrow">
            <div className="booking-panel-head">
              <div>
                <h2>Choose Date & Time</h2>
              </div>
            </div>

            <div className="booking-date-time-layout">
              <label className="booking-date-field">
                <span>Select Date</span>
                <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
              </label>

              <div className="booking-time-section">
                <span>Select Time</span>
                <div className="booking-time-grid">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`booking-time-slot ${selectedTime === slot ? "selected" : ""}`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {currentStep === 4 ? (
          <section className="booking-panel booking-panel-wide">
            <div className="booking-panel-head booking-panel-head-split">
              <div>
                <h2>Choose Your Provider</h2>
              </div>
              <div className="booking-provider-toolbar">
                <label>
                  <select value={providerAvailability} onChange={(event) => setProviderAvailability(event.target.value)}>
                    <option value="all">All Providers</option>
                    <option value="available">Available Only</option>
                  </select>
                </label>
                <label>
                  <select value={providerSort} onChange={(event) => setProviderSort(event.target.value)}>
                    <option value="rating">Sort by Rating</option>
                    <option value="eta">Sort by ETA</option>
                    <option value="distance">Sort by Distance</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="booking-provider-list">
              {filteredProviders.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  className={`booking-provider-card ${selectedProvider === provider.id ? "selected" : ""}`}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <div className="booking-provider-main">
                    <img
                      src={providerPhotos[provider.id] || "https://images.unsplash.com/photo-1614436163996-25cee5f54290?auto=format&fit=crop&w=240&q=80"}
                      alt={provider.name}
                      className="booking-provider-avatar"
                    />
                    <div className="booking-provider-copy">
                      <div className="booking-provider-title">
                        <h3>{provider.name}</h3>
                        <span className="booking-provider-verified">?</span>
                      </div>
                      <p>{provider.role}</p>
                      <div className="booking-provider-meta">
                        <span>Rating {provider.rating.toFixed(1)}</span>
                        <span>{provider.distance}</span>
                        <span>{provider.eta}</span>
                      </div>
                      <div className="booking-provider-tags">
                        {(provider.specialties || []).slice(0, 3).map((specialty) => (
                          <span key={specialty}>{specialty}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="booking-provider-side">
                    <strong>Rs {Math.max(99, Math.round(serviceFee * (provider.rating >= 4.9 ? 1.2 : 1)))}</strong>
                    <span>{provider.nextSlot || "Available Now"}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {currentStep === 5 ? (
          <section className="booking-panel booking-confirm-panel">
            <div className="booking-panel-head booking-confirm-head">
              <div>
                <h2>Confirm Your Booking</h2>
              </div>
            </div>

            <div className="booking-confirm-service">
              <div className={`booking-service-icon tone-${getServiceTone(selectedServiceDetails)}`}>{getServiceIcon(selectedServiceDetails)}</div>
              <div>
                <span>Service</span>
                <h3>{selectedServiceDetails?.name}</h3>
                <p>{selectedServiceDetails?.category} • {selectedServiceDetails?.eta}</p>
              </div>
            </div>

            <div className="booking-confirm-grid">
              <div className="booking-confirm-item">
                <span>Pet</span>
                <strong>{selectedPetDetails?.name}</strong>
                <p>{selectedPetDetails?.type || selectedPetDetails?.petType}</p>
              </div>
              <div className="booking-confirm-item">
                <span>Date & Time</span>
                <strong>{formatDateLabel(selectedDate)}</strong>
                <p>{selectedTime}</p>
              </div>
              <div className="booking-confirm-item">
                <span>Provider</span>
                <strong>{selectedProviderDetails?.name}</strong>
                <p>{selectedProviderDetails?.role}</p>
              </div>
            </div>

            <div className="booking-price-box">
              <h3>Price Breakdown</h3>
              <div className="booking-price-row">
                <span>Service Fee</span>
                <strong>Rs {serviceFee}</strong>
              </div>
              <div className="booking-price-row">
                <span>GST (18%)</span>
                <strong>Rs {gst.toFixed(2)}</strong>
              </div>
              <div className="booking-price-row total">
                <span>Total</span>
                <strong>Rs {total.toFixed(2)}</strong>
              </div>
            </div>

            <button type="button" className="booking-confirm-button" onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? "Confirming..." : `Confirm & Pay Rs ${total.toFixed(2)}`}
            </button>
            {status ? <p className="booking-success-text">{status}</p> : null}
          </section>
        ) : null}

        <div className="booking-actions">
          <button type="button" className="booking-action-secondary" onClick={handleBack} disabled={currentStep === 1}>
            Back
          </button>

          {currentStep < 5 ? (
            <button type="button" className="booking-action-primary" onClick={handleContinue} disabled={!canContinue}>
              Continue
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}







