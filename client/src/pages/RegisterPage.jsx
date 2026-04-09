import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginOrRegisterWithOtp, requestOtp } from "../services/authService";
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
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [issuedOtp, setIssuedOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpRefs = useRef([]);
  const redirectTo = "/app/dashboard";
  const normalizedPhone = `+91${form.phone}`;
  const otpValue = useMemo(() => otp.join(""), [otp]);

  const updateField = (field) => (event) => {
    const nextValue =
      field === "phone"
        ? event.target.value.replace(/\D/g, "").slice(0, 10)
        : event.target.value;

    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
    if (field === "phone") {
      setOtpSent(false);
      setOtp(["", "", "", "", "", ""]);
      setStatusMessage("");
      setIssuedOtp("");
    }
  };

  const focusOtpIndex = (index) => {
    otpRefs.current[index]?.focus();
    otpRefs.current[index]?.select();
  };

  const updateOtp = (index, rawValue) => {
    const digits = rawValue.replace(/\D/g, "");

    if (!digits) {
      setOtp((current) => {
        const next = [...current];
        next[index] = "";
        return next;
      });
      return;
    }

    const nextOtp = [...otp];
    digits.slice(0, otp.length - index).split("").forEach((digit, offset) => {
      nextOtp[index + offset] = digit;
    });
    setOtp(nextOtp);
    focusOtpIndex(Math.min(index + digits.length, otp.length - 1));
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      focusOtpIndex(index - 1);
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusOtpIndex(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < otp.length - 1) {
      event.preventDefault();
      focusOtpIndex(index + 1);
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, otp.length);

    if (!pastedDigits) {
      return;
    }

    const nextOtp = [...otp];
    pastedDigits.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setOtp(nextOtp);
    focusOtpIndex(Math.min(pastedDigits.length - 1, otp.length - 1));
  };

  const handleSendOtp = async () => {
    if (!form.name.trim() || form.phone.length !== 10) {
      setError("Enter your name and 10-digit phone number to continue.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setStatusMessage("");
    setIssuedOtp("");
    setOtp(["", "", "", "", "", ""]);

    try {
      const response = await requestOtp({ phone: normalizedPhone });
      setOtpSent(true);
      setStatusMessage("OTP sent for this phone number.");
      setIssuedOtp(response.otp || "");
      window.setTimeout(() => focusOtpIndex(0), 0);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to send OTP right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    if (otpValue.length !== 6) {
      setError("Enter the 6-digit OTP to continue.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await loginOrRegisterWithOtp({
        name: form.name.trim(),
        phone: normalizedPhone,
        petName: form.petName.trim(),
        city: form.city.trim(),
        otp: otpValue,
      });

      setSession({
        user: response.user,
        token: response.token,
        expiresAt: response.expiresAt,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
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
          <p>Set up your profile and step into your pet care dashboard</p>

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

            {otpSent ? (
              <>
                <label className="paw-field">
                  <span>Enter OTP</span>
                  <div className="paw-otp-row">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(event) => updateOtp(index, event.target.value)}
                        onKeyDown={(event) => handleOtpKeyDown(index, event)}
                        onFocus={() => focusOtpIndex(index)}
                        onPaste={handleOtpPaste}
                        ref={(node) => {
                          otpRefs.current[index] = node;
                        }}
                        className={`paw-otp-box${digit ? " active" : ""}`}
                      />
                    ))}
                  </div>
                </label>

                <p className="paw-resend">
                  Didn&apos;t receive code?{" "}
                  <button type="button" onClick={handleSendOtp} disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Resend"}
                  </button>
                </p>
              </>
            ) : null}

            {issuedOtp ? <p className="success-text">Demo OTP for {normalizedPhone}: <strong>{issuedOtp}</strong></p> : null}
            {statusMessage ? <p className="success-text">{statusMessage}</p> : null}
            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="paw-gradient-button" disabled={isSubmitting}>
              {otpSent ? (isSubmitting ? "Verifying..." : "Verify & Create Account") : (isSubmitting ? "Sending OTP..." : "Create Account")}
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
