const express = require("express");
const jwt = require("jsonwebtoken");
const common = require("../common");
const userController = require("../controllers/user");
const { body, validationResult } = require("express-validator");

require("dotenv").config(); // Load config values from .env file

const router = express.Router();

/**
 * /createTestToken:
 *  get:
 *    summary: Test method - creates a test session token
 *    description: Tokens created by this endpoint are not valid for the other secure endpoints
 *    responses:
 *      200:
 *        description: Token created
 */
router.get("/createTestToken", async (req, res) => {
  const token = jwt.sign({ userId: "abcdefghijklmnopqrstuvwxyz" }, `${process.env.JWT_SECRET}_testing`, {
    expiresIn: process.env.SESSION_TIME_EXPIRATION,
  });
  common.sendResponse(res, common.httpCodes.OK, "Token created", token);
});

/**
 * /testToken:
 *  get:
 *    summary: Test method - verifies an authorization token and returns the mock account user id
 *    description: This endpoint is used to verify the authorization token and return the mock account user id
 *    security:
 *     - bearerAuth: []
 *    responses:
 *      200:
 *        description: Returns the mock account user id
 *      401:
 *        description: Unauthorized
 */
router.get("/testToken", async (req, res) => {
  try {
    const token = req.header("authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}_testing`);
    req.user = decoded;
  } catch (error) {
    common.sendResponse(res, common.httpCodes.UNAUTHORIZED, "Unauthorized");
  }
  res.send(req.user);
});

/**
 * @swagger
 * /register:
 *  post:
 *    summary: Registers a new user and returns a session token if successful
 *    description: This endpoint is used to register a new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                description: The username of the user - minimum 5 characters
 *                example: username
 *              password:
 *                type: string
 *                description: The password of the user - minimum 8 characters
 *                example: password
 *              email:
 *                type: string
 *                description: The email of the user - must be a valid email address
 *                example: test@test.com
 *    responses:
 *      201:
 *        description: User registered
 *      400:
 *        description: Bad Request or if the user already exists
 *  */
router.post(
  "/register",
  [
    body("username").isLength({ min: 5 }).withMessage("Username is required and must be at least 5 characters long"),
    body("password").isLength({ min: 8 }).withMessage("Password is required and must be at least 8 characters long"),
    body("email").isEmail().normalizeEmail().withMessage("Email is required and must be a valid email address"),
  ],
  async (req, res) => {
    try {
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

/**
 * @swagger
 * /login:
 *  post:
 *    summary: Logs in a user and returns a session token if successful
 *    description: This endpoint is used to log in a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                description: The username of the user - minimum 5 characters
 *                example: username
 *              password:
 *                type: string
 *                description: The password of the user - minimum 8 characters
 *                example: password
 *    responses:
 *      200:
 *        description: User logged in and session token returned
 *      400:
 *        description: Bad Request or the username and password are incorrect
 * */
router.post(
  "/login",
  [
    body("username").isLength({ min: 5 }).withMessage("Username is required and must be at least 5 characters long"),
    body("password").isLength({ min: 8 }).withMessage("Password is required and must be at least 8 characters long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      // If there are validation errors, respond with a 400 Bad Request status
      if (!errors.isEmpty()) {
        common.sendResponse(res, common.httpCodes.BAD_REQUEST, "Could not login", null, errors.array());
        return false;
      }

      // If submission data is successful, run login logic
      await userController.loginUser(req, res);
    } catch (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  },
);
module.exports = router;
