import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAppData from "../services/useAppData";
import useUserStore from "../store/useUserStore";
import { createBooking } from "../services/bookingService";

const allServices = [
  { id: "vet-visit", title: "Vet Consultation", price: 599, tone: "blue" },
  { id: "grooming", title: "Premium Grooming", price: 899, tone: "pink" },
  { id: "training", title: "Expert Training", price: 799, tone: "purple" },
  { id: "ambulance", title: "Emergency Response", price: 1499, tone: "orange" },
];

const defaultSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:30 PM"];
const emergencySlots = ["Within 10 mins", "Within 20 mins", "Within 30 mins"];

export default function ServiceBookingPage() {
  const [searchParams] = useSearchParams();
  const { data, loading, refresh } = useAppData();
  const user = useUserStore((state) => state.user);
  const requestedService = searchParams.get("service") || "vet-visit";
  const mode = searchParams.get("mode") || "default";
  const [selectedService, setSelectedService] = useState(requestedService);
  const [selectedProvider, setSelectedProvider] = useState("provider-1");
  const [selectedTime, setSelectedTime] = useState(mode === "emergency" ? emergencySlots[0] : "03:00 PM");
  const [selectedPet, setSelectedPet] = useState("pet-1");
  const [selectedDate, setSelectedDate] = useState("2026-04-12");
  const [status, setStatus] = useState("");

  const bookingMode = useMemo(() => {
    if (mode === "emergency" || requestedService === "ambulance") {
      return {
        title: "Emergency Booking",
        subtitle: "Rapid triage, dispatch-ready provider matching, and immediate response planning.",
        heroClass: "page-hero hot emergency-hero",
        badge: "Emergency response lane",
        note: "Emergency dispatch requested from urgent care flow",
        serviceIds: ["ambulance"],
        providerRoles: ["Emergency Vet"],
        slots: emergencySlots,
      };
    }

    if (mode === "consult" || requestedService === "vet-visit") {
      return {
        title: "Vet Consultation Booking",
        subtitle: "Structured consult flow for symptoms, follow-up advice, and home-care planning.",
        heroClass: "page-hero ocean consult-hero",
        badge: "Consultation workflow",
        note: "Vet consultation scheduled from professional consult flow",
        serviceIds: ["vet-visit"],
        providerRoles: ["Emergency Vet"],
        slots: defaultSlots,
      };
    }

    if (mode === "training" || requestedService === "training") {
      return {
        title: "Training Session Booking",
        subtitle: "Behavior guidance, routine building, and focused coaching for your pet.",
        heroClass: "page-hero violet training-hero",
        badge: "Training workflow",
        note: "Training session booked from behavior coaching flow",
        serviceIds: ["training"],
        providerRoles: ["Canine Trainer"],
        slots: defaultSlots,
      };
    }

    return {
      title: "Book Premium Service",
      subtitle: "Choose a service, provider, and care window that matches your need.",
      heroClass: "page-hero hot",
      badge: "Priority SLA Active",
      note: "Booked from premium booking flow",
      serviceIds: allServices.map((service) => service.id),
      providerRoles: [],
      slots: defaultSlots,
    };
  }, [mode, requestedService]);

  const visibleServices = allServices.filter((service) => bookingMode.serviceIds.includes(service.id));
  const visibleProviders = data?.providers.filter((provider) =>
    bookingMode.providerRoles.length ? bookingMode.providerRoles.includes(provider.role) : true,
  ) || [];

  const selectedServiceDetails = allServices.find((item) => item.id === selectedService);
  const selectedProviderDetails = visibleProviders.find((item) => item.id === selectedProvider) || visibleProviders[0];
  const selectedPetDetails = data?.pets.find((item) => item.id === selectedPet);

  if (loading || !data) {
    return <div className="panel">Loading booking tools...</div>;
  }

  const handleConfirm = async () => {
    const providerId = selectedProviderDetails?.id || selectedProvider;

    await createBooking({
      userId: user?.id || "demo-user",
      serviceId: selectedService,
      providerId,
      petId: selectedPet,
      date: new Date(selectedDate).toISOString(),
      time: selectedTime,
      note: bookingMode.note,
    });
    setStatus("Booking confirmed.");
    refresh();
  };

  return (
    <div className="care-page booking-page">
      <header className={bookingMode.heroClass}>
        <div>
          <h1>{bookingMode.title}</h1>
          <p>{bookingMode.subtitle}</p>
        </div>
      </header>

      <section className="section-block booking-mode-strip">
        <span className="eyebrow">{bookingMode.badge}</span>
        <p>
          {mode === "emergency"
            ? "Emergency bookings focus on the fastest available urgent-care provider and rapid dispatch windows."
            : mode === "consult"
              ? "Consultation bookings are optimized for symptoms, assessment, and follow-up treatment guidance."
              : "Choose the service flow that matches the care you want to arrange right now."}
        </p>
      </section>

      <section className="section-block">
        <div className="step-title">
          <span>1</span>
          <h2>{visibleServices.length === 1 ? "Selected Service" : "Select Service"}</h2>
        </div>
        <div className="service-choice-grid">
          {visibleServices.map((service) => (
            <button
              key={service.id}
              className={`service-choice-card ${service.tone}${selectedService === service.id ? " selected" : ""}`}
              onClick={() => setSelectedService(service.id)}
            >
              <div className={`feature-icon ${service.tone}`}>{service.title.slice(0, 1)}</div>
              <div>
                <strong>{service.title}</strong>
                <p>Rs {service.price}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="step-title">
          <span>2</span>
          <h2>{mode === "emergency" ? "Dispatch Window" : "Date and Time"}</h2>
        </div>
        <div className="booking-date-card">
          <label htmlFor="booking-date">{mode === "emergency" ? "Reference Date" : "Select Date"}</label>
          <input
            id="booking-date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>
        <div className="time-slot-grid">
          {bookingMode.slots.map((slot) => (
            <button
              key={slot}
              className={`time-slot${selectedTime === slot ? " active" : ""}`}
              onClick={() => setSelectedTime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="step-title">
          <span>3</span>
          <h2>{mode === "emergency" ? "Emergency Team" : "Choose Provider"}</h2>
        </div>
        <div className="provider-list">
          {visibleProviders.map((provider) => (
            <button
              key={provider.id}
              className={`provider-card${selectedProvider === provider.id ? " selected" : ""}`}
              onClick={() => setSelectedProvider(provider.id)}
            >
              <div className="provider-main">
                <img
                  src={
                    provider.id === "provider-1"
                      ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80"
                      : provider.id === "provider-2"
                        ? "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
                        : "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
                  }
                  alt={provider.name}
                  className="provider-avatar"
                />
                <div>
                  <div className="provider-name-row">
                    <strong>{provider.name}</strong>
                    {provider.rating >= 4.8 ? <span className="mini-badge">PRO</span> : null}
                  </div>
                  <p>{provider.role}</p>
                  <p>
                    {provider.distance} <span className="dot-sep">|</span> {provider.eta}
                  </p>
                </div>
              </div>
              <strong className="provider-price">
                Rs {selectedServiceDetails?.price || 599}
              </strong>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="step-title">
          <span>4</span>
          <h2>Select Pet</h2>
        </div>
        <div className="pet-chip-row">
          {data.pets.map((pet) => (
            <button
              key={pet.id}
              className={`pet-chip${selectedPet === pet.id ? " active" : ""}`}
              onClick={() => setSelectedPet(pet.id)}
            >
              {pet.name}
            </button>
          ))}
        </div>
      </section>

      <section className="section-block booking-summary-card">
        <div className="section-title-row">
          <h2>Booking Summary</h2>
          <span className="booking-sla-pill">{bookingMode.badge}</span>
        </div>
        <div className="booking-summary-grid">
          <div>
            <span>Service</span>
            <strong>{selectedServiceDetails?.title}</strong>
          </div>
          <div>
            <span>Provider</span>
            <strong>{selectedProviderDetails?.name}</strong>
          </div>
          <div>
            <span>Pet</span>
            <strong>{selectedPetDetails?.name}</strong>
          </div>
          <div>
            <span>Window</span>
            <strong>{selectedDate} at {selectedTime}</strong>
          </div>
        </div>
      </section>

      <button className="full-width-cta" onClick={handleConfirm}>
        {mode === "emergency" ? "Confirm Emergency Dispatch" : "Confirm Booking"}
      </button>
      {status ? <p className="success-text booking-status">{status}</p> : null}
    </div>
  );
}
