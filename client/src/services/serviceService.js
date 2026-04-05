import API, { canUseApi } from "./api";
import { buildFallbackOverview } from "./fallbackData";

export const getServices = async () => {
  try {
    if (!(await canUseApi())) {
      throw new Error("API unavailable");
    }

    const response = await API.get("/services");
    return response.data;
  } catch {
    return buildFallbackOverview().services;
  }
};
