const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, default: "Kolkata" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
