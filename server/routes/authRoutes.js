const router = require("express").Router();
const { loginUser, updateUser, getUserById, getBookings, getOverview } = require("../data/repository");

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

router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch user profile.", error: error.message });
  }
});

router.put("/profile/:userId", async (req, res) => {
  try {
    const user = await updateUser(req.params.userId, req.body || {});

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      user,
      overview: await getOverview(user.id),
      bookings: await getBookings(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update user profile.", error: error.message });
  }
});

module.exports = router;
