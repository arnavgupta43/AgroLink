const { validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msgs = errors
      .array()
      .map((e) => e.msg)
      .join(", ");
    return res.status(400).json({ status: "Failed", errors: msgs });
  }
  next();
};
