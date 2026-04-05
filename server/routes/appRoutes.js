const router = require("express").Router();
const { getOverview } = require("../data/repository");

router.get("/overview", async (req, res) => {
  const userId = req.query.userId || "demo-user";

  try {
    res.json(await getOverview(userId));
  } catch (error) {
    res.status(500).json({ message: "Unable to build app overview.", error: error.message });
  }
});

module.exports = router;
