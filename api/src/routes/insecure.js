const express = require("express");
const jwt = require("jsonwebtoken");
const common = require("../common");
const userController = require("../controllers/user");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");

// Load config values from .env file
dotenv.config();

const router = express.Router();

// Name: GET /setAuthTest
// Creates a test session token using a test JWT secret
// tokens created by this endpoint are not valid for the other secure endpoints
router.get("/setAuthTest", async (req, res) => {
  const token = jwt.sign({ userId: "abcdefghijklmnopqrstuvwxyz" }, `${process.env.JWT_SECRET}_testing`, {
    expiresIn: process.env.SESSION_TIME_EXPIRATION,
  });
  common.sendResponse(res, common.httpCodes.OK, "Token created", token);
});

// Name: POST /register
// Registers a new user and returns a JWT token encapsulating the account user Id (uuid) if successful
router.post(
  "/register",
  [
    body("username").isLength({ min: 5 }).withMessage("Username is required and must be at least 5 characters long"),
    body("password").isLength({ min: 8 }).withMessage("Password is required and must be at least 8 characters long"),
    body("email").isEmail().normalizeEmail().withMessage("Email is required and must be a valid email address"),
  ],
  async (req, res) => {
    try {
      // const hashedPassword = await bcrypt.hash(req.body.password, 8);
      const errors = validationResult(req);

      // If there are validation errors, respond with a 400 Bad Request status
      if (!errors.isEmpty()) {
        common.sendResponse(res, common.httpCodes.BAD_REQUEST, "Could not register", null, errors.array());
        return false;
      }

      // If submission data is successful, run registration logic
      await userController.registerUser(req, res);
    } catch (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  },
);
module.exports = router;
