const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    petId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    age: { type: String, required: true },
    weight: { type: String, required: true },
    mood: { type: String, default: "Happy" },
    nextCare: { type: String, default: "" },
    diet: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Pet", petSchema);
