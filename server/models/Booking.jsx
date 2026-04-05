import { createBooking } from "../../services/bookingService";
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: String,
  service: String,
  providerId: Number,
  date: String,
  time: String,
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const handleConfirmBooking = async () => {
  if (!selectedService || !selectedDate || !selectedTime || !selectedProvider) {
    return;
  }

  try {
    const bookingData = {
      userId: "user123", // later dynamic
      service: selectedService,
      providerId: selectedProvider,
      date: selectedDate,
      time: selectedTime,
    };

    const res = await createBooking(bookingData);

    console.log("Booking Created:", res);

    navigate("/app/tracking");
  } catch (err) {
    console.error(err);
  }
};
module.exports = mongoose.model("Booking", bookingSchema);