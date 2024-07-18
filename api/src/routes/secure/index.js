const express = require("express");
const auth = require("../../middleware/auth");

const router = express.Router();

router.get("/authTest", auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
