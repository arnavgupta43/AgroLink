const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "failed",
      msg: "Authentication Error",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      username: payload.username,
      _id: payload._id,
      role: payload.role,
    };
    return next();
  } catch (error) {
    console.error("JWT error:", error);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ status: "failed", msg: "Invalid or expired token" });
  }
};

module.exports = auth;
