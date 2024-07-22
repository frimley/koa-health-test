const db = require("../db");
const common = require("../common");

// Name: getActivities
// Description: Returns all activities available
exports.getActivities = async (req, res) => {
  const result = await db.query("SELECT * FROM fn_get_activities();", [], (error, results) => {
    if (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  });

  // Response activity data
  res.status(common.httpCodes.OK).send({ activities: result.rows });
};

// Name: setActivityCompleted
// Description: Sets an activity as completed for a user
exports.setActivityCompleted = async (req, res, userAccountId, activityId) => {
  const result = await db.query(
    "SELECT * FROM fn_set_activity_completed($1, $2);",
    [userAccountId, activityId],
    (error, results) => {
      if (error) {
        common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    },
  );

  // Response that completion was successful
  common.sendResponse(res, common.httpCodes.CREATED, "Activity set as completed");
};

// Name: getCompletedActivities
// Description: Returns all activities that a user has completed
exports.getCompletedActivities = async (req, res, userAccountId) => {
  const result = await db.query("SELECT * FROM fn_get_completed_activities($1);", [userAccountId], (error, results) => {
    if (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  });

  // Response activity data
  res.status(common.httpCodes.OK).send({ activities: result.rows });
};

// Name: setActivity
// Description: Creates/updates an activity if the user is authorized as an admin
exports.setActivity = async (
  req,
  res,
  activityId,
  userAccountId,
  title,
  activityCategoryId,
  durationMinutes,
  activityDifficultyId,
  content,
) => {
  const result = await db.query(
    "SELECT * FROM fn_set_activity($1, $2, $3, $4, $5, $6, $7);",
    [userAccountId, activityId, title, activityCategoryId, durationMinutes, activityDifficultyId, content],
    (error, results) => {
      if (error) {
        common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    },
  );

  if (result.rows[0].fn_set_activity === "0") {
    common.sendResponse(res, common.httpCodes.UNAUTHORIZED, "Not authorized to create/update activity");
    return false;
  }
  // Response that completion was successful
  res
    .status(common.httpCodes.CREATED)
    .send({ message: "Activity created/updated", activityId: result.rows[0].fn_set_activity });
};

// Name: getActivity
// Description: Returns an activity if the user is authorized as an admin
exports.getActivity = async (req, res, activityId, userAccountId) => {
  const result = await db.query(
    "SELECT * FROM fn_get_activity($1, $2);",
    [userAccountId, activityId],
    (error, results) => {
      if (error) {
        common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    },
  );
  if (result.rows.length === 0) {
    common.sendResponse(res, common.httpCodes.UNAUTHORIZED, "Activity could not be retrieved");
    return false;
  }

  // Response activity data
  res.status(common.httpCodes.OK).send({ activity: result.rows[0] });
};

// Name: deleteActivity
// Description: Deletes an activity if the user is authorized as an admin
exports.deleteActivity = async (req, res, activityId, userAccountId) => {
  const result = await db.query(
    "SELECT * FROM fn_delete_activity($1, $2);",
    [userAccountId, activityId],
    (error, results) => {
      if (error) {
        common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
      }
    },
  );

  if (result.rows[0].fn_set_activity === false) {
    common.sendResponse(res, common.httpCodes.UNAUTHORIZED, "Not authorized to delete activity");
    return false;
  }
  // Response that completion was successful
  res.status(common.httpCodes.NO_CONTENT).send({ message: "Activity deleted" });
};
