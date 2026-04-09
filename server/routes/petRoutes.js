const router = require("express").Router();
const {
  getPets,
  addPet,
  updatePet,
  deletePet,
} = require("../data/repository");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, async (req, res) => {
  try {
    const pets = await getPets(req.auth.sub);
    return res.json(pets);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch pets.", error: error.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { name, type, age, weight } = req.body || {};

  if (!name || !type || !age || !weight) {
    return res.status(400).json({ message: "Missing required pet fields." });
  }

  try {
    const pet = await addPet(req.auth.sub, req.body || {});
    return res.status(201).json(pet);
  } catch (error) {
    return res.status(500).json({ message: "Unable to create pet.", error: error.message });
  }
});

router.put("/:petId", requireAuth, async (req, res) => {
  try {
    const pet = await updatePet(req.auth.sub, req.params.petId, req.body || {});

    if (!pet) {
      return res.status(404).json({ message: "Pet not found." });
    }

    return res.json(pet);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update pet.", error: error.message });
  }
});

router.delete("/:petId", requireAuth, async (req, res) => {
  try {
    const removed = await deletePet(req.auth.sub, req.params.petId);

    if (!removed) {
      return res.status(404).json({ message: "Pet not found." });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete pet.", error: error.message });
  }
});

module.exports = router;
