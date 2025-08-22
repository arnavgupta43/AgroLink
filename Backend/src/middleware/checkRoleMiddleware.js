const { StatusCodes } = require("http-status-codes");
const requireRole =
  (...allowed) =>
  (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
    }
    next();
  };
module.exports = requireRole;
