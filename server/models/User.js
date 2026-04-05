const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, default: "Kolkata" },
    email: { type: String, default: "care@pawassist.app" },
    petName: { type: String, default: "" },
    notes: {
      type: String,
      default: "Appointments, health reminders, and support updates",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
