const db = require("../db");
const common = require("../common");

require("dotenv").config(); // Load config values from .env file

// Name: registerUser
// Description: Registers a new user and responses a JWT token encapsulating the account user Id (uuid) if successful
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
  const token = common.signToken(userAccountId);

  // Reponse success with token
  common.sendResponse(res, common.httpCodes.CREATED, "User registered", token);
};

// Name: loginUser
// Description: Logs in a user and responses a JWT token encapsulating the account user Id (uuid) if successful
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const result = await db.query("SELECT * FROM fn_user_login($1, $2);", [username, password], (error, results) => {
    if (error) {
      common.sendResponse(res, common.httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  });

  // If a user account Id wasn't returned, it means the username or password is incorrect
  const userAccountId = result.rows[0].fn_user_login;
  if (!userAccountId) {
    common.sendResponse(res, common.httpCodes.BAD_REQUEST, "Username or password is incorrect");
    return false;
  }

  // Now sign user account Id with JWT
  const token = common.signToken(userAccountId);

  // Reponse success with token
  common.sendResponse(res, common.httpCodes.OK, "User logged in", token);
};
