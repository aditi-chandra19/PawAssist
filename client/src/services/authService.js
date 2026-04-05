import API, { canUseApi } from "./api";
import { buildFallbackOverview } from "./fallbackData";

export const loginUser = async ({ phone, name }) => {
  try {
    if (!(await canUseApi())) {
      throw new Error("API unavailable");
    }

    const response = await API.post("/auth/login", { phone, name });
    return response.data;
  } catch {
    const user = {
      id: `local-user-${phone}`,
      name: name?.trim() || "Pet Parent",
      phone,
      city: "Kolkata",
    };

    return {
      user,
      overview: buildFallbackOverview(user),
    };
  }
};
