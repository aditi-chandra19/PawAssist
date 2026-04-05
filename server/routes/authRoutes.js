const router = require("express").Router();
const { loginUser, getBookings, getOverview } = require("../data/repository");

router.post("/login", async (req, res) => {
  const { phone, name } = req.body || {};

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    const user = await loginUser({ phone, name });

    return res.json({
      user,
      overview: await getOverview(user.id),
      bookings: await getBookings(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in user.", error: error.message });
  }
});

module.exports = router;
