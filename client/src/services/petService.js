import API, { canUseApi, getApiErrorMessage } from "./api";

const requireApi = async () => {
  if (!(await canUseApi())) {
    throw new Error(getApiErrorMessage(null, "Pet service is unavailable."));
  }
};

export const fetchPets = async () => {
  try {
    await requireApi();
    const response = await API.get("/pets", {
      timeout: import.meta.env.PROD ? 4000 : 2500,
    });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load pets right now."));
  }
};

export const createPet = async (payload) => {
  try {
    await requireApi();
    const response = await API.post("/pets", payload);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to create pet right now."));
  }
};

export const updatePet = async (petId, payload) => {
  if (!petId) {
    throw new Error("Pet id is required to update a pet.");
  }

  try {
    await requireApi();
    const response = await API.put(`/pets/${petId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to update pet right now."));
  }
};

export const deletePet = async (petId) => {
  if (!petId) {
    throw new Error("Pet id is required to delete a pet.");
  }

  try {
    await requireApi();
    const response = await API.delete(`/pets/${petId}`);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to delete pet right now."));
  }
};
