const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: /^[6-9]\d{9}$/,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username must be unique"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    type: {
      type: String,
      enum: ["Admin", "Farmer", "Buyer"],
      required: [true, "User type is required"],
    },
    location: {
      type: String,
      lowercase: true,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcryptjs.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcryptjs.compare(enteredPassword, this.passwordHash);
};

userSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.type,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};

userSchema.methods.getName = function () {
  return this.username;
};

module.exports = mongoose.model("User", userSchema);
