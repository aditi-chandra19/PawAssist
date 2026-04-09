import API, { canUseApi } from "./api";

export const updateProfile = async (profile) => {
  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }

  const response = await API.put("/auth/profile", profile);
  return response.data;
};
