import API, { allowLocalFallback, canUseApi } from "./api";
import { buildFallbackOverview } from "./fallbackData";

export const loginUser = async ({ phone, otp, name, city, petName }) => {
  try {
    if (!(await canUseApi())) {
      throw new Error("API unavailable");
    }

    const response = await API.post("/auth/login-with-otp", { phone, otp, name, city, petName });
    return response.data;
  } catch {
    if (!allowLocalFallback) {
      throw new Error("Authentication service unavailable.");
    }

    const user = {
      id: `local-user-${phone}`,
      name: name?.trim() || "Pet Parent",
      phone,
      city: city?.trim() || "Kolkata",
      petName: petName?.trim() || "",
    };

    return {
      user,
      overview: buildFallbackOverview(user),
    };
  }
};

export const requestOtp = async ({ phone }) => {
  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }

  const response = await API.post("/auth/request-otp", { phone });
  return response.data;
};

export const loginWithOtp = async ({ phone, otp }) => {
  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }

  const response = await API.post("/auth/login-with-otp", { phone, otp });
  return response.data;
};

export const loginOrRegisterWithOtp = async ({ phone, otp, name, city, petName }) => {
  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }

  const response = await API.post("/auth/login-with-otp", { phone, otp, name, city, petName });
  return response.data;
};
