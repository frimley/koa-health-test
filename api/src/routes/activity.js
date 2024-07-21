const express = require("express");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const activityController = require("../controllers/activity");
const { param, validationResult } = require("express-validator");

const router = express.Router();

/**
 * @swagger
 * /activities:
 *  get:
 *    summary: Lists all activities available to the user
 *    description: This endpoint is used to list all activities available to the user
 *    security:
 *     - bearerAuth: []
 *    responses:
 *      200:
 *        description: Returns all activities available
 *      401:
 *        description: Unauthorized
 */
router.get("/activities", auth, async (req, res) => {
  try {
    await activityController.getActivities(req, res);
  } catch (error) {
    common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
  }
});

/**
 * @swagger
 * /activity/{activityId}/complete:
 *  put:
 *    summary: Marks an activity as completed for the user
 *    description: This endpoint is used to mark an activity as completed for the user
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: activityId
 *        description: The activity Id to mark as completed
 *        required: true
 *        schema:
 *         type: integer
 *    responses:
 *      201:
 *        description: Activity marked as completed for the user
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized
 *  */
router.put(
  "/activity/:activityId/complete",
  auth,
  [param("activityId").isNumeric().withMessage("activityId must be a valid number")],
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
      await activityController.setActivityCompleted(req, res, req.user.userAccountId, req.params.activityId);
    } catch (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  },
);

/**
 * @swagger
 * /completedActivities:
 *  get:
 *    summary: Lists all activities that a user has completed
 *    description: This endpoint is used to list all activities that a user has completed
 *    security:
 *     - bearerAuth: []
 *    responses:
 *      200:
 *        description: A list of all completed activities is returned ordered by most recent first (completed timestamp descending)
 *      401:
 *        description: Unauthorized
 *  */
router.get("/completedActivities", auth, async (req, res) => {
  try {
    // Set the activity as completed
    await activityController.getCompletedActivities(req, res, req.user.userAccountId);
  } catch (error) {
    common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
  }
});

module.exports = router;
