import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginWithOtp, requestOtp } from "../services/authService";
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
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [issuedOtp, setIssuedOtp] = useState("");
  const otpRefs = useRef([]);
  const redirectTo = "/app/dashboard";
  const normalizedPhone = `+91${phone}`;

  const otpValue = useMemo(() => otp.join(""), [otp]);

  const focusOtpIndex = (index) => {
    otpRefs.current[index]?.focus();
    otpRefs.current[index]?.select();
  };

  const updateOtp = (index, rawValue) => {
    const digits = rawValue.replace(/\D/g, "");
    if (!digits) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const nextOtp = [...otp];
    digits.slice(0, otp.length - index).split("").forEach((digit, offset) => {
      nextOtp[index + offset] = digit;
    });
    setOtp(nextOtp);

    const nextIndex = Math.min(index + digits.length, otp.length - 1);
    focusOtpIndex(nextIndex);
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
    if (phone.length !== 10) {
      setError("Enter a phone number first.");
      return;
    }

    setIsSendingOtp(true);
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
      setIsSendingOtp(false);
    }
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

    if (otpValue.length !== 6) {
      setError("Enter the 6-digit OTP to continue.");
      return;
    }

    setIsVerifyingOtp(true);
    setError("");
    setStatusMessage("");

    try {
      const response = await loginWithOtp({ phone: normalizedPhone, otp: otpValue });
      setSession({
        user: response.user,
        token: response.token,
        expiresAt: response.expiresAt,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
      console.error("Login Error:", err);
    } finally {
      setIsVerifyingOtp(false);
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
              <span style={{ color: "#334155", fontWeight: 700, paddingRight: "10px" }}>+91</span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="98765 43210"
                value={phone}
                onChange={(event) => {
                  const nextPhone = event.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(nextPhone);
                  setOtpSent(false);
                  setOtp(["", "", "", "", "", ""]);
                  setError("");
                  setStatusMessage("");
                  setIssuedOtp("");
                }}
              />
              <button type="button" className="paw-input-action" onClick={handleSendOtp} disabled={isSendingOtp}>
                {isSendingOtp ? "..." : "OTP"}
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
                <button type="button" onClick={handleSendOtp} disabled={isSendingOtp}>
                  {isSendingOtp ? "Sending..." : "Resend"}
                </button>
              </p>
            </>
          ) : null}

          {issuedOtp ? <p className="success-text">Demo OTP for {normalizedPhone}: <strong>{issuedOtp}</strong></p> : null}
          {statusMessage ? <p className="success-text">{statusMessage}</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          <button type="button" className="paw-gradient-button" onClick={handleLogin} disabled={isVerifyingOtp}>
            {otpSent ? (isVerifyingOtp ? "Verifying..." : "Verify & Continue") : "Login"}
          </button>

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
