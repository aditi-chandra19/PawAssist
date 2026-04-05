const router = require("express").Router();
const { services, providers } = require("../data/repository");

router.get("/", (_req, res) => {
  res.json(services);
});

router.get("/providers", (_req, res) => {
  res.json(providers);
});

module.exports = router;
