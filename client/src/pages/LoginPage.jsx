import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useUserStore((state) => state.setSession);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const normalizedPhone = `+91${phone}`;

  const otpValue = useMemo(() => otp.join(""), [otp]);

  const updateOtp = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
  };

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      setError("Enter your 10-digit phone number to continue.");
      return;
    }

    setError("");
    setOtpSent(true);
  };

  const handleLogin = async () => {
    if (phone.length !== 10) {
      setError("Enter your 10-digit phone number to continue.");
      return;
    }

    if (!otpSent) {
      handleSendOtp();
      return;
    }

    if (otpValue.length !== 4) {
      setError("Enter the 4-digit OTP to continue.");
      return;
    }

    try {
      const response = await loginUser({ phone: normalizedPhone });
      setSession({
        user: response.user,
        token: response.token,
        expiresAt: response.expiresAt,
      });
      navigate("/app/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed. Please try again.");
      console.error("Login Error:", err);
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
          <p>Log in and continue caring for your pet from one warm dashboard</p>

          <label className="paw-field">
            <span>Phone Number</span>
            <div className="paw-input-shell">
              <input
                type="tel"
                inputMode="numeric"
                placeholder="98765 43210"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
              />
              <button type="button" className="paw-input-action" onClick={handleSendOtp}>
                OTP
              </button>
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
                      className={`paw-otp-box${index === 0 ? " active" : ""}`}
                    />
                  ))}
                </div>
              </label>

              <p className="paw-resend">
                Didn&apos;t receive code?{" "}
                <button type="button" onClick={handleSendOtp}>
                  Resend
                </button>
              </p>
            </>
          ) : null}

          {error ? <p className="error-text">{error}</p> : null}

          <button type="button" className="paw-gradient-button" onClick={handleLogin}>
            {otpSent ? "Verify & Continue" : "Login"}
          </button>

          <div className="paw-divider">
            <span />
            <p>Or continue with</p>
            <span />
          </div>

          <div className="paw-social-row">
            <button type="button" className="paw-social-button">
              <span>AP</span>
              <strong>Apple</strong>
            </button>
            <button type="button" className="paw-social-button">
              <span>GO</span>
              <strong>Google</strong>
            </button>
          </div>

          <p className="paw-terms">
            By continuing, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
