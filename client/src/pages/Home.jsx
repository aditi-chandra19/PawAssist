import { Link } from "react-router-dom";

const highlights = [
  "Emergency help and provider dispatch",
  "Pet records, reminders, and health summaries",
  "Bookings, chat, wallet, insurance, and premium care",
];

const services = highlights.map((name, index) => ({
  id: `${index + 1}`,
  name,
  price: "Included",
}));

export default function Home() {
  return (
    <div className="landing-shell">

      {/* Header */}
      <div className="header">
        <h2>Hello, Ayush 👋</h2>
        <p>Your pets deserve the best care ❤️</p>
      </div>

      {/* Emergency */}
      <button className="emergency-btn">
        🚨 Emergency Help
      </button>

      {/* Services */}
      <h3 className="services-title">Services</h3>

      <div className="grid">
        {services.map((s) => (
          <div key={s.id} className="card">
            <h4>{s.name}</h4>
            <p>₹{s.price}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
