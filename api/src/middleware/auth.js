const jwt = require("jsonwebtoken");

const sendUnauthorizedMessage = (res) => {
  return res.status(401).send({ message: "Unauthorized" });
};

module.exports = (req, res, next) => {
  // check the header for the presence of an authorization field
  if (!req.header("authorization")) {
    sendUnauthorizedMessage(res);
    return false;
  }

  const token = req.header("authorization").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    sendUnauthorizedMessage(res);
  }
};
