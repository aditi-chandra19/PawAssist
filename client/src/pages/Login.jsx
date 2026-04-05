import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import useUserStore from "../store/useUserStore";
import heroImage from "../assets/hero.png";

export default function Login() {
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
      
      <h1 className="text-3xl font-bold mb-2">PawAssist 🐾</h1>
      <p className="text-gray-500 mb-6">
        On-demand pet care & emergency services
      </p>

      <input
        type="text"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-3 rounded-lg mb-4"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white py-3 rounded-lg font-semibold"
      >
        Login
      </button>
    </div>
  );
}
