import { useEffect, useState } from "react";
import { API_BASE_URL } from "./api";

const initialState = {
  state: "checking",
  label: "Checking system",
  detail: "Validating API connectivity",
};

export default function useSystemStatus() {
  const [status, setStatus] = useState(initialState);

  useEffect(() => {
    let isMounted = true;

    const check = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
        const payload = await response.json();

        if (!isMounted) {
          return;
        }

        const dbMode = payload.database === "mongodb" ? "MongoDB" : "fallback memory";
        setStatus({
          state: payload.database === "mongodb" ? "healthy" : "degraded",
          label: payload.database === "mongodb" ? "System healthy" : "Fallback mode",
          detail: `API live on ${dbMode}`,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setStatus({
          state: "offline",
          label: "Backend offline",
          detail: "Using local fallback experience",
        });
      }
    };

    check();
    const intervalId = window.setInterval(check, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return status;
}
