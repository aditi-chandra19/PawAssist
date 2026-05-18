const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    petId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String, default: "" },
    gender: { type: String, default: "Male" },
    age: { type: String, required: true },
    weight: { type: String, required: true },
    color: { type: String, default: "" },
    mood: { type: String, default: "Happy" },
    nextCare: { type: String, default: "" },
    diet: { type: String, default: "" },
    medicalHistory: { type: String, default: "" },
    allergies: { type: String, default: "None" },
    photo: { type: String, default: "" },
    profileIncomplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Pet", petSchema);
