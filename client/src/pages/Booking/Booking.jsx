import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../services/bookingService";
import { services, providers } from "./data";
import ServiceCard from "./components/ServiceCard";
import ProviderCard from "./components/ProviderCard";

export default function Booking() {
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

const handleConfirmBooking = async () => {
  if (!selectedService || !selectedDate || !selectedTime || !selectedProvider) {
    return;
  }

  try {
    const bookingData = {
      userId: "user123",
      service: selectedService,
      providerId: selectedProvider,
      date: selectedDate,
      time: selectedTime,
    };

    const res = await createBooking(bookingData);

    console.log("Booking Saved:", res);

    navigate("/app/tracking");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      
      <h2>Book Service 🐾</h2>

      {/* Services */}
      <h3>Select Service</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            selected={selectedService === s.id}
            onSelect={setSelectedService}
          />
        ))}
      </div>

      {/* Providers */}
      <h3 style={{ marginTop: "20px" }}>Choose Provider</h3>
      {providers.map((p) => (
        <ProviderCard
          key={p.id}
          provider={p}
          selected={selectedProvider === p.id}
          onSelect={setSelectedProvider}
        />
      ))}

      {/* Button */}
      <button
        onClick={handleConfirm}
        disabled={!selectedService || !selectedProvider}
        style={{
          marginTop: "20px",
          padding: "15px",
          width: "100%",
          background: "purple",
          color: "white",
          borderRadius: "10px",
        }}
      >
        Confirm Booking
      </button>
    </div>
  );
}