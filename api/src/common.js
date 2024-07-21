const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load config values from .env file
dotenv.config();

exports.httpCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
};

/// helper method to standardize the response for errors and other simple responses
exports.sendResponse = (res, httpResponseCode, message, token = null, errors = null) => {
  const responseJSON = {
    message: message,
  };
  if (errors) responseJSON.errors = errors;
  if (token) responseJSON.token = token;
  res.status(httpResponseCode).send(responseJSON);
};

// helper method to sign a JWT token and formatting the payload
exports.signToken = (userAccountId) => {
  return jwt.sign({ userAccountId: userAccountId }, process.env.JWT_SECRET, {
    expiresIn: process.env.SESSION_TIME_EXPIRATION,
  });
};
