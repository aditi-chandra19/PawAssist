const router = require("express").Router();
const { getOverview } = require("../data/repository");
const { requireAuth } = require("../middleware/auth");

router.get("/overview", requireAuth, async (req, res) => {
  try {
    res.json(await getOverview(req.auth.sub));
  } catch (error) {
    res.status(500).json({ message: "Unable to build app overview.", error: error.message });
  }
});

module.exports = router;
