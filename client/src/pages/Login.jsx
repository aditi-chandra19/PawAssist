import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import useUserStore from "../store/useUserStore";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

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

    const otpValue = "000000";

    if (otpValue.length !== 6) {
      setError("Enter the 6-digit OTP to continue.");
      return;
    }

    try {
      const response = await loginUser({ phone });
      setUser(response.user);
      navigate("/app/dashboard");
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

      {error ? <p className="error-text">{error}</p> : null}

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white py-3 rounded-lg font-semibold"
      >
        Login
      </button>
    </div>
  );
}
