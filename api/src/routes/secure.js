const express = require("express");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const activityController = require("../controllers/activity");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Name: GET /authTest
// Verifies an authorization token and returns the mock account user id
router.get("/authTest", async (req, res) => {
  const token = req.header("authorization").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}_testing`);
    req.user = decoded;
  } catch (error) {
    common.sendResponse(res, common.httpCodes.UNAUTHORIZED, "Unauthorized");
  }
  res.send(req.user);
});

// Name: GET /activities
// Lists all activities available to the user
router.get("/activities", auth, async (req, res) => {
  try {
    await activityController.getActivities(req, res);
  } catch (error) {
    common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
  }
});

// Name POST /activityComplete
// Marks an activity as completed for the user
router.post(
  "/activityComplete",
  auth,
  [body("activityId").isNumeric().withMessage("activityId must be a valid number")],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      // If there are validation errors, respond with a 400 Bad Request status
      if (!errors.isEmpty()) {
        common.sendResponse(
          res,
          common.httpCodes.BAD_REQUEST,
          "Could not set activity as completed",
          null,
          errors.array(),
        );
        return false;
      }

      // Set the activity as completed
      await activityController.setActivityCompleted(req, res, req.user.userAccountId, req.body.activityId);
    } catch (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  },
);

// Name: GET /completedActivities
// Lists all activities that the user has completed
router.get("/completedActivities", auth, async (req, res) => {
  try {
    // Set the activity as completed
    await activityController.getCompletedActivities(req, res, req.user.userAccountId);
  } catch (error) {
    common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
  }
});

module.exports = router;
