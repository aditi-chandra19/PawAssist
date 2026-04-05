import { useState } from "react";
import useAppData from "../services/useAppData";
import useUserStore from "../store/useUserStore";
import { createBooking } from "../services/bookingService";

const serviceCards = [
  { id: "vet-visit", title: "Vet Consultation", price: 599, tone: "blue" },
  { id: "grooming", title: "Premium Grooming", price: 899, tone: "pink" },
  { id: "training", title: "Expert Training", price: 799, tone: "purple" },
  { id: "ambulance", title: "Home Vaccination", price: 349, tone: "green" },
];

const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:30 PM"];

export default function Booking() {
  const { data, loading, refresh } = useAppData();
  const user = useUserStore((state) => state.user);
  const [selectedService, setSelectedService] = useState("vet-visit");
  const [selectedProvider, setSelectedProvider] = useState("provider-1");
  const [selectedTime, setSelectedTime] = useState("03:00 PM");
  const [selectedPet, setSelectedPet] = useState("pet-1");
  const [selectedDate, setSelectedDate] = useState("2026-04-12");
  const [status, setStatus] = useState("");
  const selectedServiceDetails = serviceCards.find((item) => item.id === selectedService);
  const selectedProviderDetails = data?.providers.find((item) => item.id === selectedProvider);
  const selectedPetDetails = data?.pets.find((item) => item.id === selectedPet);

  if (loading || !data) {
    return <div className="panel">Loading booking tools...</div>;
  }

  const handleConfirm = async () => {
    await createBooking({
      userId: user?.id || "demo-user",
      serviceId: selectedService,
      providerId: selectedProvider,
      petId: selectedPet,
      date: new Date(selectedDate).toISOString(),
      time: selectedTime,
      note: "Booked from premium booking flow",
    });
    setStatus("Booking confirmed.");
    refresh();
  };

  return (
    <div className="care-page booking-page">
      <header className="page-hero hot">
        <div>
          <h1>Book Premium Service</h1>
          <p>Expert care for your furry friend</p>
        </div>
      </header>

      <section className="section-block">
        <div className="step-title">
          <span>1</span>
          <h2>Select Service</h2>
        </div>
        <div className="service-choice-grid">
          {serviceCards.map((service) => (
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
          <h2>Date and Time</h2>
        </div>
        <div className="booking-date-card">
          <label htmlFor="booking-date">Select Date</label>
          <input
            id="booking-date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>
        <div className="time-slot-grid">
          {slots.map((slot) => (
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
          <h2>Choose Provider</h2>
        </div>
        <div className="provider-list">
          {data.providers.map((provider) => (
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
                    {provider.distance} <span className="dot-sep">•</span> {provider.eta}
                  </p>
                </div>
              </div>
              <strong className="provider-price">
                Rs {serviceCards.find((item) => item.id === selectedService)?.price || 599}
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
          <span className="booking-sla-pill">Priority SLA Active</span>
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
        Confirm Booking
      </button>
      {status ? <p className="success-text booking-status">{status}</p> : null}
    </div>
  );
}

