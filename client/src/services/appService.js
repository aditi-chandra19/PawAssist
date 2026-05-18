import API, { allowLocalFallback, canUseApi, getApiErrorMessage } from "./api";
import { buildFallbackOverview } from "./fallbackData";

const OVERVIEW_TIMEOUT_MS = import.meta.env.PROD ? 4000 : 2500;

export const getAppOverview = async (user) => {
  if (!user?.id) {
    return buildFallbackOverview(user);
  }

  try {
    if (!(await canUseApi())) {
      throw new Error(getApiErrorMessage(null, "Unable to load app overview."));
    }

    const response = await API.get("/app/overview", {
      timeout: OVERVIEW_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    if (!allowLocalFallback) {
      throw new Error(getApiErrorMessage(error, "Unable to load app overview."));
    }

    return buildFallbackOverview(user);
  }
};
