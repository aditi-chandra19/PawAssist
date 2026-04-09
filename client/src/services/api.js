import axios from "axios";
import useUserStore from "../store/useUserStore";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5001/api";
export const allowLocalFallback = !import.meta.env.PROD;
let apiStatus = "unknown";
let lastCheckedAt = 0;
let inFlightHealthCheck = null;
let failedChecks = 0;

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2500,
});

API.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useUserStore.getState().logout();

      if (typeof window !== "undefined" && window.location.pathname.startsWith("/app")) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export const canUseApi = async () => {
  const now = Date.now();
  const upCooldown = 30000;
  const downCooldown = Math.min(180000, 15000 * Math.max(1, failedChecks));

  if (apiStatus === "up" && now - lastCheckedAt < upCooldown) {
    return true;
  }

  if (apiStatus === "down" && now - lastCheckedAt < downCooldown) {
    return false;
  }

  if (inFlightHealthCheck) {
    return inFlightHealthCheck;
  }

  inFlightHealthCheck = (async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 900);

    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Health check failed with status ${response.status}`);
      }
      apiStatus = "up";
      lastCheckedAt = Date.now();
      failedChecks = 0;
      return true;
    } catch {
      apiStatus = "down";
      lastCheckedAt = Date.now();
      failedChecks += 1;
      return false;
    } finally {
      window.clearTimeout(timeoutId);
      inFlightHealthCheck = null;
    }
  })();

  return inFlightHealthCheck;
};

export default API;
