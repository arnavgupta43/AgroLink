const User = require("../models/userSchema");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const profile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!isValidObjectId(_id)) {
      const err = new Error("Invalid object Id");
      err.statusCode = StatusCodes.BAD_REQUEST;
      return next(err);
    }
    const user = User.findById(_id).select("-passwordHash");
    if (!user) {
      const err = new Error("User Not Found");
      err.statusCode = StatusCodes.NOT_FOUND;
      return next(err);
    }
    return res.status(StatusCodes.OK).json({ status: "sucess", user });
  } catch (error) {
    return next(error);
  }
};
