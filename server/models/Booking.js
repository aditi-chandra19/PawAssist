const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    petId: { type: String, required: true },
    serviceId: { type: String, required: true },
    providerId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    note: { type: String, default: "" },
    status: { type: String, default: "confirmed" },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

module.exports = mongoose.model("Booking", bookingSchema);
