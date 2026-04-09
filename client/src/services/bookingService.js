import API, { allowLocalFallback, canUseApi } from "./api";
import {
  createFallbackBooking,
  getLocalBookings,
  persistLocalBooking,
} from "./fallbackData";

export const createBooking = async (data) => {
  try {
    if (!(await canUseApi())) {
      throw new Error("API unavailable");
    }

    const response = await API.post("/bookings", data);
    return response.data;
  } catch {
    if (!allowLocalFallback) {
      throw new Error("Unable to create booking right now.");
    }

    const booking = createFallbackBooking(data);
    return persistLocalBooking(booking);
  }
};

export const getBookings = async () => {
  try {
    if (!(await canUseApi())) {
      throw new Error("API unavailable");
    }

    const response = await API.get("/bookings");
    return response.data;
  } catch {
    if (!allowLocalFallback) {
      throw new Error("Unable to load bookings right now.");
    }

    return getLocalBookings();
  }
};
