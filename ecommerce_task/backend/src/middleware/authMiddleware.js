const jwt = require("jsonwebtoken");
const RequestHandler = require("../utils/requestHandler");
const requestHandler = new RequestHandler();

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return requestHandler.sendError(req, res, "No token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.decoded = decoded;
    next();
  } catch (error) {
    return requestHandler.sendError(req, res, "Invalid token");
  }
}

module.exports = authMiddleware;
