import API, { canUseApi } from "./api";
import { buildFallbackOverview } from "./fallbackData";

export const getAppOverview = async (user) => {
  try {
    if (!(await canUseApi())) {
      throw new Error("API unavailable");
    }

    const response = await API.get("/app/overview", {
      params: { userId: user?.id },
    });
    return response.data;
  } catch {
    return buildFallbackOverview(user);
  }
};
