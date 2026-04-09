import API, { canUseApi } from "./api";

const requireApi = async () => {
  if (!(await canUseApi())) {
    throw new Error("API unavailable");
  }
};

export const createPet = async (payload) => {
  await requireApi();
  const response = await API.post("/pets", payload);
  return response.data;
};

export const updatePet = async (petId, payload) => {
  if (!petId) {
    throw new Error("Pet id is required to update a pet.");
  }

  await requireApi();
  const response = await API.put(`/pets/${petId}`, payload);
  return response.data;
};

export const deletePet = async (petId) => {
  if (!petId) {
    throw new Error("Pet id is required to delete a pet.");
  }

  await requireApi();
  const response = await API.delete(`/pets/${petId}`);
  return response.data;
};
