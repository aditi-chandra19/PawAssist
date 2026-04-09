import API, { allowLocalFallback, canUseApi } from "./api";
import { buildFallbackOverview } from "./fallbackData";

export const getAppOverview = async (user) => {
  if (!user?.id) {
    return buildFallbackOverview(user);
  }

  try {
    if (!(await canUseApi())) {
      throw new Error("API unavailable");
    }

    const response = await API.get("/app/overview");
    return response.data;
  } catch {
    if (!allowLocalFallback) {
      throw new Error("Unable to load app overview.");
    }

    return buildFallbackOverview(user);
  }
};
