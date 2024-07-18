const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load config values from .env file
dotenv.config();

const router = express.Router();

// Creates a test session token using a test JWT secret
// tokens created by this endpoint are not valid for the secure endpoints
router.get("/setAuthTest", async (req, res) => {
  const token = jwt.sign({ userId: "abcdefghijklmnopqrstuvwxyz" }, `${process.env.JWT_SECRET}_testing`, {
    expiresIn: process.env.SESSION_TIME_EXPIRATION,
  });
  res.send({ token: token });
});

module.exports = router;
