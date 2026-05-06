import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import useUserStore from "../store/useUserStore";

const loginHeroImage =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80";

const loginHighlights = [
  {
    icon: "PR",
    title: "Pet Profile Ready",
    text: "Set up your details and step into your care dashboard in minutes.",
  },
  {
    icon: "BK",
    title: "Bookings and Reminders",
    text: "Track appointments, wellness tasks, and follow-ups in one place.",
  },
  {
    icon: "HR",
    title: "Health Records",
    text: "Keep everyday pet updates organized from the very beginning.",
  },
];

export default function AuthLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useUserStore((state) => state.setSession);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const redirectTo = "/app/dashboard";
  const normalizedPhone = `+91${phone}`;

  const handleLogin = async (event) => {
    event.preventDefault();

    if (phone.length !== 10) {
      setError("Enter your 10-digit phone number to continue.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await loginUser({ phone: normalizedPhone });
      setSession({
        user: response.user,
        token: response.token,
        expiresAt: response.expiresAt,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed. Please try again.");
      console.error("Login Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell paw-login-shell">
      <div className="paw-login-layout">
        <section className="paw-login-info">
          <div className="paw-login-hero-card">
            <img src={loginHeroImage} alt="Two happy dogs running outdoors" className="paw-login-hero-image" />
            <div className="paw-login-trust">Create your care hub in under a minute</div>
          </div>

          <div className="paw-login-benefits paw-auth-story">
            <div className="paw-benefit-title-row paw-auth-story-head">
              <div className="paw-benefit-icon">PA</div>
              <div>
                <span className="paw-auth-eyebrow">Start with PawAssist</span>
                <h2>Everything in one place</h2>
              </div>
            </div>

            <p className="paw-auth-story-copy">
              Build your pet&apos;s care space once and manage visits, reminders, records, and support without the chaos.
            </p>

            <div className="paw-auth-story-list">
              {loginHighlights.map((item) => (
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
          <h1>Welcome Back</h1>
          <p>Log in directly with your phone number and continue caring for your pet.</p>

          <form onSubmit={handleLogin}>
            <label className="paw-field">
              <span>Phone Number</span>
              <div className="paw-input-shell">
                <span style={{ color: "#334155", fontWeight: 700, paddingRight: "10px" }}>+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(event) => {
                    const nextPhone = event.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(nextPhone);
                    setError("");
                  }}
                />
              </div>
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="paw-gradient-button" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="paw-divider">
            <span />
            <p>New here?</p>
            <span />
          </div>

          <Link
            to="/register"
            state={location.state}
            className="paw-social-button paw-secondary-button"
            style={{ justifyContent: "center" }}
          >
            <strong>Create Account</strong>
          </Link>
        </section>
      </div>
    </div>
  );
}
