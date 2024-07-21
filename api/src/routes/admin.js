const express = require("express");
const auth = require("../middleware/auth");
const activityController = require("../controllers/activity");
const common = require("../common");
const { param, body, validationResult } = require("express-validator");

const router = express.Router();

/**
 * @swagger
 * /admin/activity:
 *  post:
 *    summary: Admin method (user must be an admin) - Creates a new activity
 *    description: Admin method (user must be an admin) - This endpoint is used to create a new activity.  Returns the new activity Id.  activityCategoryId = (1 = Relaxation, 2 = Self-Esteem, 3 = Productivity, 4 = Physical Health, 5 = Social Connection).  activityDifficultyId = (1 = Easy, 2 = Medium, 3 = Hard).
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: Title of activity
 *                example: Breath for 60 seconds
 *              activityCategoryId:
 *                type: integer
 *                description: A number representing an activity category (1 = Relaxation, 2 = Self-Esteem, 3 = Productivity, 4 = Physical Health, 5 = Social Connection)
 *                example: 1
 *              durationMinutes:
 *                type: integer
 *                description: The amount of minutes the activity will take
 *                example: 15
 *              activityDifficultyId:
 *                type: integer
 *                description: A number representing an activity difficulty (1 = Easy, 2 = Medium, 3 = Hard)
 *                example: 1
 *              content:
 *                type: string
 *                description: The content of the activity
 *                example: "Take a deep breath in, hold for 5 seconds, and exhale slowly"
 *    responses:
 *      201:
 *        description: Activity created
 *      400:
 *       description: Bad Request
 *      401:
 *        description: Unauthorized
 */
router.post(
  "/admin/activity",
  auth,
  [
    body("title").isLength({ min: 1 }).withMessage("title must be atleast 1 character long"),
    body("activityCategoryId").isNumeric().withMessage("activityCategoryId must be a valid number"),
    body("durationMinutes").isNumeric().withMessage("durationMinutes must be a valid number"),
    body("activityDifficultyId").isNumeric().withMessage("activityDifficultyId must be a valid number"),
    body("content").isLength({ mi: 1 }).withMessage("content must be atleast 1 character long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      // If there are validation errors, respond with a 400 Bad Request status
      if (!errors.isEmpty()) {
        common.sendResponse(res, common.httpCodes.BAD_REQUEST, "Could not create activity", null, errors.array());
        return false;
      }

      await activityController.setActivity(
        req,
        res,
        0,
        req.user.userAccountId,
        req.body.title,
        req.body.activityCategoryId,
        req.body.durationMinutes,
        req.body.activityDifficultyId,
        req.body.content,
      );
    } catch (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  },
);

/**
 * @swagger
 * /admin/activity/{activityId}:
 *  put:
 *    summary: Admin method (user must be an admin) - Updates an activity
 *    description: Admin method (user must be an admin) - This endpoint is used to update an activity.  Returns the activity Id.  activityCategoryId = (1 = Relaxation, 2 = Self-Esteem, 3 = Productivity, 4 = Physical Health, 5 = Social Connection).  activityDifficultyId = (1 = Easy, 2 = Medium, 3 = Hard).
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: activityId
 *        description: The activity Id to update
 *        required: true
 *        schema:
 *         type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: Title of activity
 *                example: Breath for 60 seconds
 *              activityCategoryId:
 *                type: integer
 *                description: A number representing an activity category (1 = Relaxation, 2 = Self-Esteem, 3 = Productivity, 4 = Physical Health, 5 = Social Connection)
 *                example: 1
 *              durationMinutes:
 *                type: integer
 *                description: The amount of minutes the activity will take
 *                example: 15
 *              activityDifficultyId:
 *                type: integer
 *                description: A number representing an activity difficulty (1 = Easy, 2 = Medium, 3 = Hard)
 *                example: 1
 *              content:
 *                type: string
 *                description: The content of the activity
 *                example: "Take a deep breath in, hold for 5 seconds, and exhale slowly"
 *    responses:
 *      201:
 *        description: Activity created
 *      400:
 *       description: Bad Request
 *      401:
 *        description: Unauthorized
 */
router.put(
  "/admin/activity/:activityId",
  auth,
  [
    param("activityId").isNumeric().withMessage("activityId must be a valid number"),
    body("title").isLength({ min: 1 }).withMessage("title must be atleast 1 character long"),
    body("activityCategoryId").isNumeric().withMessage("activityCategoryId must be a valid number"),
    body("durationMinutes").isNumeric().withMessage("durationMinutes must be a valid number"),
    body("activityDifficultyId").isNumeric().withMessage("activityDifficultyId must be a valid number"),
    body("content").isLength({ mi: 1 }).withMessage("content must be atleast 1 character long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      // If there are validation errors, respond with a 400 Bad Request status
      if (!errors.isEmpty()) {
        common.sendResponse(res, common.httpCodes.BAD_REQUEST, "Could not update activity", null, errors.array());
        return false;
      }

      await activityController.setActivity(
        req,
        res,
        req.params.activityId,
        req.user.userAccountId,
        req.body.title,
        req.body.activityCategoryId,
        req.body.durationMinutes,
        req.body.activityDifficultyId,
        req.body.content,
      );
    } catch (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  },
);

/**
 * @swagger
 * /admin/activity/{activityId}:
 *  get:
 *    summary: Admin method (user must be an admin) - Gets an activity by id
 *    description: Admin method (user must be an admin) - This endpoint is used to get an activity.  Only works for admin users.
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: activityId
 *        description: The activity Id to retrieve
 *        required: true
 *        schema:
 *         type: integer
 *    responses:
 *      200:
 *        description: Activity returned
 *      400:
 *       description: Bad Request
 *      401:
 *        description: Unauthorized
 */
router.get(
  "/admin/activity/:activityId",
  auth,
  [param("activityId").isNumeric().withMessage("activityId must be a valid number")],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      // If there are validation errors, respond with a 400 Bad Request status
      if (!errors.isEmpty()) {
        common.sendResponse(res, common.httpCodes.BAD_REQUEST, "Could update activity", null, errors.array());
        return false;
      }

      await activityController.getActivity(req, res, req.params.activityId, req.user.userAccountId);
    } catch (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  },
);

/**
 * @swagger
 * /admin/activity/{activityId}:
 *  delete:
 *    summary: Admin method (user must be an admin) - Deletes an activity by id
 *    description: Admin method (user must be an admin) - This endpoint is used to delete an activity.  Only works for admin users.
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: activityId
 *        description: The activity Id to delete
 *        required: true
 *        schema:
 *         type: integer
 *    responses:
 *      204:
 *        description: Activity deleted
 *      400:
 *       description: Bad Request
 *      401:
 *        description: Unauthorized
 */
router.delete(
  "/admin/activity/:activityId",
  auth,
  [param("activityId").isNumeric().withMessage("activityId must be a valid number")],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      // If there are validation errors, respond with a 400 Bad Request status
      if (!errors.isEmpty()) {
        common.sendResponse(res, common.httpCodes.BAD_REQUEST, "Could delete activity", null, errors.array());
        return false;
      }

      await activityController.deleteActivity(req, res, req.params.activityId, req.user.userAccountId);
    } catch (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  },
);

module.exports = router;
