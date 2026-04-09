import API, { canUseApi } from "./api";

const requireApi = async () => {
  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }
};

export const fetchSettings = async () => {
  await requireApi();
  const response = await API.get("/auth/settings");
  return response.data;
};

export const saveSettings = async (payload) => {
  await requireApi();
  const response = await API.put("/auth/settings", payload);
  return response.data;
};

export const savePassword = async (currentPassword, nextPassword) => {
  await requireApi();
  const response = await API.put("/auth/password", {
    currentPassword,
    nextPassword,
  });
  return response.data;
};

export const removeAccount = async () => {
  await requireApi();
  const response = await API.delete("/auth/account");
  return response.data;
};
