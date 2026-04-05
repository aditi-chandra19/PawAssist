const router = require("express").Router();
const { createBooking, getBookings } = require("../data/repository");

router.post("/", async (req, res) => {
  const { userId, petId, serviceId, providerId, date, time, note } = req.body || {};

  if (!userId || !petId || !serviceId || !providerId || !date || !time) {
    return res.status(400).json({ message: "Missing required booking fields." });
  }

  try {
    const booking = await createBooking({
      userId,
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

router.get("/", async (req, res) => {
  const { userId } = req.query || {};

  try {
    return res.json(await getBookings(userId));
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch bookings.", error: error.message });
  }
});

module.exports = router;
