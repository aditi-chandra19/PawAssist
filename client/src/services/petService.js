import API, { canUseApi, getApiErrorMessage } from "./api";

const PET_READ_TIMEOUT_MS = import.meta.env.PROD ? 4000 : 2500;
const PET_WRITE_TIMEOUT_MS = import.meta.env.PROD ? 7000 : 2500;

const requireApi = async () => {
  if (!(await canUseApi())) {
    throw new Error(getApiErrorMessage(null, "Pet service is unavailable."));
  }
};

export const fetchPets = async () => {
  try {
    await requireApi();
    const response = await API.get("/pets", {
      timeout: PET_READ_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load pets right now.", PET_READ_TIMEOUT_MS));
  }
};

export const createPet = async (payload) => {
  try {
    await requireApi();
    const response = await API.post("/pets", payload, {
      timeout: PET_WRITE_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to create pet right now.", PET_WRITE_TIMEOUT_MS));
  }
};

export const updatePet = async (petId, payload) => {
  if (!petId) {
    throw new Error("Pet id is required to update a pet.");
  }

  try {
    await requireApi();
    const response = await API.put(`/pets/${petId}`, payload, {
      timeout: PET_WRITE_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to update pet right now.", PET_WRITE_TIMEOUT_MS));
  }
};

export const deletePet = async (petId) => {
  if (!petId) {
    throw new Error("Pet id is required to delete a pet.");
  }

  try {
    await requireApi();
    const response = await API.delete(`/pets/${petId}`, {
      timeout: PET_WRITE_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to delete pet right now.", PET_WRITE_TIMEOUT_MS));
  }
};
