import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import useUserStore from "../store/useUserStore";

const registerHeroImage =
  "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80";

const registerHighlights = [
  {
    icon: "VC",
    title: "Vet Consults Ready",
    text: "Start booking checkups, grooming, and urgent care with fewer steps.",
  },
  {
    icon: "RM",
    title: "Reminders That Help",
    text: "Keep wellness tasks, follow-ups, and visit plans in one flow.",
  },
  {
    icon: "AI",
    title: "Care Guidance",
    text: "Get support, records, and smart help from the moment you sign up.",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useUserStore((state) => state.setSession);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    petName: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = "/app/dashboard";
  const normalizedPhone = `+91${form.phone}`;

  const updateField = (field) => (event) => {
    const nextValue =
      field === "phone"
        ? event.target.value.replace(/\D/g, "").slice(0, 10)
        : event.target.value;

    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
    setError("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Enter your name to continue.");
      return;
    }

    if (form.phone.length !== 10) {
      setError("Enter your 10-digit phone number to continue.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await registerUser({
        name: form.name.trim(),
        phone: normalizedPhone,
        petName: form.petName.trim(),
        city: form.city.trim(),
      });

      setSession({
        user: response.user,
        token: response.token,
        expiresAt: response.expiresAt,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Registration failed. Please try again.");
      console.error("Register Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell paw-login-shell">
      <div className="paw-login-layout">
        <section className="paw-login-info">
          <div className="paw-login-hero-card">
            <img src={registerHeroImage} alt="Dog sitting happily outdoors" className="paw-login-hero-image" />
            <div className="paw-login-trust">Join PawAssist and start in under a minute</div>
          </div>

          <div className="paw-login-benefits paw-auth-story">
            <div className="paw-benefit-title-row paw-auth-story-head">
              <div className="paw-benefit-icon">PA</div>
              <div>
                <span className="paw-auth-eyebrow">Create your PawAssist account</span>
                <h2>Care starts here</h2>
              </div>
            </div>

            <p className="paw-auth-story-copy">
              Create your profile once and unlock bookings, reminders, records, and everyday support in one place.
            </p>

            <div className="paw-auth-story-list">
              {registerHighlights.map((item) => (
                <div key={item.title} className="paw-auth-story-item">
                  <span>{item.icon}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="paw-login-card">
          <h1>Create Account</h1>
          <p>Set up your profile and step into your pet care dashboard right away.</p>

          <form onSubmit={handleRegister}>
            <label className="paw-field">
              <span>Full Name</span>
              <div className="paw-input-shell">
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={form.name}
                  onChange={updateField("name")}
                />
              </div>
            </label>

            <label className="paw-field">
              <span>Phone Number</span>
              <div className="paw-input-shell">
                <span style={{ color: "#334155", fontWeight: 700, paddingRight: "10px" }}>+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={updateField("phone")}
                />
              </div>
            </label>

            <label className="paw-field">
              <span>Pet Name</span>
              <div className="paw-input-shell">
                <input
                  type="text"
                  placeholder="Milo"
                  value={form.petName}
                  onChange={updateField("petName")}
                />
              </div>
            </label>

            <label className="paw-field">
              <span>City</span>
              <div className="paw-input-shell">
                <input
                  type="text"
                  placeholder="Kolkata"
                  value={form.city}
                  onChange={updateField("city")}
                />
              </div>
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="paw-gradient-button" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="paw-divider">
            <span />
            <p>Already have an account?</p>
            <span />
          </div>

          <Link
            to="/login"
            state={location.state}
            className="paw-social-button paw-secondary-button"
            style={{ justifyContent: "center" }}
          >
            <strong>Back to Login</strong>
          </Link>
        </section>
      </div>
    </div>
  );
}
