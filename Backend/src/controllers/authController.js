const User = require("../models/userSchema");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const createUser = async (req, res, next) => {
  try {
    const { name, phone, username, email, password, type, location } = req.body;
    if (
      !name ||
      !phone ||
      !username ||
      !email ||
      password ||
      !type ||
      !location
    ) {
      const err = new Error("Invalid details");
      err.statusCode = StatusCodes.BAD_REQUEST;
      return next();
    }
    let avatarUrl = { url: "", publicId: "" };
    if (req.file && req.file.path) {
      const { url, publicId } = await uploadOnCloudinary(req.file.path);
      avatarUrl = { url, publicId };
    }
    const user = User.create({
      name,
      phone,
      username,
      email,
      passwordHash: password,
      type,
      location,
      avatarUrl,
    });
    if (!user) {
      const err = new Error("Failed to create User");
      err.statusCode = StatusCodes.BAD_REQUEST;
      return next();
    }
    return res
      .status(StatusCodes.CREATED)
      .json({ status: "success", msg: "User Created" });
  } catch (error) {}
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Invalid Credentials");
      err.statusCode = StatusCodes.NOT_FOUND;
      return next(err);
    }

    const validPassword = await user.matchPassword(password);
    if (!validPassword) {
      const err = new Error("Invalid Credentials");
      err.statusCode = StatusCodes.UNAUTHORIZED;
      return next(err);
    }

    const token = user.createJWT();
    return res.status(StatusCodes.OK).json({
      status: "success",
      user: {
        email: email,
        name: user.name,
        role: user.role,
        id: user._id,
      },
      token,
    });
  } catch (error) {}
};

module.exports = { userLogin, createUser };
