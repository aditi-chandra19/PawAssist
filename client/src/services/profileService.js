import API, { canUseApi } from "./api";

export const updateProfile = async (userId, profile) => {
  if (!userId) {
    throw new Error("User id is required to update profile.");
  }

  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }

  const response = await API.put(`/auth/profile/${userId}`, profile);
  return response.data;
};
