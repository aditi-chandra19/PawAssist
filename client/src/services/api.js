import axios from "axios";
import useUserStore from "../store/useUserStore";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "";
const pointsToLocalhost = /(^|\/\/)(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(configuredApiBaseUrl);

export const apiConfigurationError =
  import.meta.env.PROD && (!configuredApiBaseUrl || pointsToLocalhost)
    ? "Frontend deployment is missing a valid VITE_API_BASE_URL. Point it to the deployed backend /api URL and redeploy."
    : "";

export const API_BASE_URL = configuredApiBaseUrl || "http://localhost:5001/api";
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

export const getApiErrorMessage = (error, fallbackMessage = "Request failed.") =>
  error?.response?.data?.message || apiConfigurationError || error?.message || fallbackMessage;

export const canUseApi = async () => {
  if (apiConfigurationError) {
    apiStatus = "down";
    lastCheckedAt = Date.now();
    failedChecks += 1;
    return false;
  }

  // In production we should not block real requests behind a short preflight.
  // Render cold starts or normal network jitter can exceed the health timeout
  // even when the API is actually healthy.
  if (import.meta.env.PROD) {
    return true;
  }

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
