const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const common = require("../common");
const dotenv = require("dotenv");

// Load config values from .env file
dotenv.config();

exports.registerUser = async (req, res) => {
  // If validation is successful, add new user
  const { username, email, password } = req.body;
  const result = await db.query(
    "SELECT * FROM fn_user_register($1, $2, $3);",
    [username, email, password],
    (error, results) => {
      if (error) {
        common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    },
  );

  // If a user account Id wasn't returned, it means the user is already registered
  const userAccountId = result.rows[0].fn_user_register;
  if (!userAccountId) {
    common.sendResponse(res, common.httpCodes.BAD_REQUEST, "User already exists");
    return false;
  }

  // Now sign user account Id with JWT so this registered user is automatically authenticated from here on
  const token = jwt.sign({ userId: userAccountId }, process.env.JWT_SECRET, {
    expiresIn: process.env.SESSION_TIME_EXPIRATION,
  });

  // Reponse success with token
  common.sendResponse(res, common.httpCodes.CREATED, "User registered", token);
};
