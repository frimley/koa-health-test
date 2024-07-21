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

  // Reponse that completion was successful
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
