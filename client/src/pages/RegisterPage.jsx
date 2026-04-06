import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";
import { loginUser } from "../services/authService";
import useUserStore from "../store/useUserStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useUserStore((state) => state.setUser);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    petName: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = location.state?.from || "/app/home";

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Enter your name and phone number to continue.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await loginUser({
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      setUser({
        ...response.user,
        petName: form.petName.trim() || "Buddy",
        city: form.city.trim() || response.user.city || "Kolkata",
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError("Registration failed. Please try again.");
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
            <img src={heroImage} alt="Happy pet parent with dog" className="paw-login-hero-image" />
            <div className="paw-login-trust">Create your care hub in under a minute</div>
          </div>

          <div className="paw-login-benefits">
            <div className="paw-benefit-title-row">
              <div className="paw-benefit-icon">+</div>
              <h2>Start your PawAssist account</h2>
            </div>

            {[
              "Create a profile for you and your pet",
              "Manage bookings, reminders, and health records",
              "Reach your dashboard right after signup",
              "Keep every pet-care update in one place",
            ].map((item) => (
              <div key={item} className="paw-benefit-item">
                <span>+</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="paw-login-card">
          <h1>Create Account</h1>
          <p>Set up your profile and continue straight to the dashboard</p>

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
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
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
            className="paw-social-button"
            style={{ justifyContent: "center" }}
          >
            <strong>Back to Login</strong>
          </Link>
        </section>
      </div>
    </div>
  );
}
