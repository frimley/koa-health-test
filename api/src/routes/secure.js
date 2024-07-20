const express = require("express");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const router = express.Router();

// AuthTest
// Verifies an authorization token and returns the mock account user id
router.get("/authTest", async (req, res) => {
  const token = req.header("authorization").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}_testing`);
    req.user = decoded;
  } catch (error) {
    res.send({ message: "Unauthorized" });
  }
  res.send(req.user);
});

module.exports = router;
