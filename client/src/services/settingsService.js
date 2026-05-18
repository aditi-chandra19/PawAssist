import API, { canUseApi, getApiErrorMessage } from "./api";

const SETTINGS_TIMEOUT_MS = import.meta.env.PROD ? 3000 : 2500;

const requireApi = async () => {
  if (!(await canUseApi())) {
    throw new Error(getApiErrorMessage(null, "Settings service is unavailable."));
  }
};

export const fetchSettings = async () => {
  await requireApi();
  const response = await API.get("/auth/settings", {
    timeout: SETTINGS_TIMEOUT_MS,
  });
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
