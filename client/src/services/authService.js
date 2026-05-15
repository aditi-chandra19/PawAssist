import API, { allowLocalFallback, canUseApi, getApiErrorMessage } from "./api";
import { buildFallbackOverview } from "./fallbackData";

const buildLocalSession = ({ phone, name, city, petName }) => {
  const user = {
    id: `local-user-${phone}`,
    name: name?.trim() || "Pet Parent",
    phone,
    city: city?.trim() || "Kolkata",
    petName: petName?.trim() || "",
  };

  return {
    user,
    token: `local-session-${phone}`,
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    overview: buildFallbackOverview(user),
    bookings: [],
  };
};

export const loginUser = async ({ phone }) => {
  try {
    if (!(await canUseApi())) {
      throw new Error(getApiErrorMessage(null, "Authentication service unavailable."));
    }

    const response = await API.post("/auth/login", { phone });
    return response.data;
  } catch (error) {
    if (!allowLocalFallback) {
      throw new Error(getApiErrorMessage(error, "Authentication service unavailable."));
    }

    return buildLocalSession({ phone });
  }
};

export const registerUser = async ({ phone, name, city, petName }) => {
  try {
    if (!(await canUseApi())) {
      throw new Error(getApiErrorMessage(null, "Authentication service unavailable."));
    }

    const response = await API.post("/auth/register", { phone, name, city, petName });
    return response.data;
  } catch (error) {
    if (!allowLocalFallback) {
      throw new Error(getApiErrorMessage(error, "Authentication service unavailable."));
    }

    return buildLocalSession({ phone, name, city, petName });
  }
};

export const requestOtp = async ({ phone }) => {
  if (!(await canUseApi())) {
    return {
      success: true,
      phone,
      expiresInMs: 0,
      message: "OTP is no longer required. Continue to log in directly.",
      otp: "000000",
    };
  }

  const response = await API.post("/auth/request-otp", { phone });
  return response.data;
};

export const loginWithOtp = async ({ phone }) => loginUser({ phone });

export const loginOrRegisterWithOtp = async ({ phone, name, city, petName }) =>
  registerUser({ phone, name, city, petName });
