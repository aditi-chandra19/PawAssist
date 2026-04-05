import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";
import { loginUser } from "../services/authService";
import useUserStore from "../store/useUserStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const otpValue = useMemo(() => otp.join(""), [otp]);

  const updateOtp = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
  };

  const handleSendOtp = () => {
    if (!phone.trim()) {
      setError("Enter a phone number first.");
      return;
    }

    setError("");
    setOtpSent(true);
  };

  const handleLogin = async () => {
    if (!phone.trim()) {
      setError("Enter a phone number first.");
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
      const response = await loginUser({ phone });
      setUser(response.user);
      navigate("/app/home");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="auth-shell paw-login-shell">
      <div className="paw-login-layout">
        <section className="paw-login-info">
          <div className="paw-login-hero-card">
            <img src={heroImage} alt="French bulldog in a clinic" className="paw-login-hero-image" />
            <div className="paw-login-trust">Trusted by 50K+ pet parents</div>
          </div>

          <div className="paw-login-benefits">
            <div className="paw-benefit-title-row">
              <div className="paw-benefit-icon">✦</div>
              <h2>Why Choose CareConnect?</h2>
            </div>

            {[
              "24/7 Emergency Veterinary Support",
              "AI-Powered Health Monitoring",
              "Instant Video Consultations",
              "Top-Rated Professional Vets",
              "Complete Pet Care Solutions",
            ].map((item) => (
              <div key={item} className="paw-benefit-item">
                <span>✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="paw-login-card">
          <h1>Welcome Back 👋</h1>
          <p>Your pet&apos;s wellbeing is our priority</p>

          <label className="paw-field">
            <span>Phone Number</span>
            <div className="paw-input-shell">
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <button type="button" className="paw-input-action" onClick={handleSendOtp}>
                ⚡
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
              <span>🍎</span>
              <strong>Apple</strong>
            </button>
            <button type="button" className="paw-social-button">
              <span>🔎</span>
              <strong>Google</strong>
            </button>
          </div>

          <p className="paw-terms">
            By continuing, you agree to our <strong>Terms of Service</strong> and{" "}
            <strong>Privacy Policy</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
