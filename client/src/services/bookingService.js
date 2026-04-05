import API, { canUseApi } from "./api";
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
    const booking = createFallbackBooking(data);
    return persistLocalBooking(booking);
  }
};

export const getBookings = async (userId) => {
  try {
    if (!(await canUseApi())) {
      throw new Error("API unavailable");
    }

    const response = await API.get("/bookings", {
      params: { userId },
    });
    return response.data;
  } catch {
    return getLocalBookings();
  }
};
