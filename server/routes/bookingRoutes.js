const router = require("express").Router();
const { createBooking, getBookings } = require("../data/repository");
const { requireAuth } = require("../middleware/auth");

router.post("/", requireAuth, async (req, res) => {
  const { petId, serviceId, providerId, date, time, note } = req.body || {};

  if (!petId || !serviceId || !providerId || !date || !time) {
    return res.status(400).json({ message: "Missing required booking fields." });
  }

  try {
    const booking = await createBooking({
      userId: req.auth.sub,
      petId,
      serviceId,
      providerId,
      date,
      time,
      note: note || "",
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Unable to create booking.", error: error.message });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    return res.json(await getBookings(req.auth.sub));
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch bookings.", error: error.message });
  }
});

module.exports = router;
