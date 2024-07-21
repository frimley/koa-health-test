const jwt = require("jsonwebtoken");
const common = require("../common");

module.exports = (req, res, next) => {
  // check the header for the presence of an authorization field
  if (!req.header("authorization")) {
    common.sendResponse(res, common.httpCodes.UNAUTHORIZED, "Unauthorized");
    return false;
  }

  const token = req.header("authorization").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    common.sendResponse(res, common.httpCodes.UNAUTHORIZED, "Unauthorized");
  }
};
