const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load config values from .env file
dotenv.config();

const router = express.Router();

router.get("/helloworld", async (req, res) => {
  res.send('{message: "hello world"}');
});
router.get("/setAuthTest", async (req, res) => {
  const token = jwt.sign({ userId: "abcdefghijklmnopqrstuvwxyz" }, process.env.JWT_SECRET, {
    expiresIn: process.env.SESSION_TIME_EXPIRATION,
  });
  res.send({ token: token });
});

module.exports = router;
