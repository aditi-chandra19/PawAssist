import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5001/api";
let apiStatus = "unknown";
let lastCheckedAt = 0;
let inFlightHealthCheck = null;
let failedChecks = 0;

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2500,
});

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
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
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
      inFlightHealthCheck = null;
    }
  })();

  return inFlightHealthCheck;
};

export default API;
