const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1 kg"],
    },
    expectedPrice: {
      type: Number,
      required: [true, "Expected price is required"],
      min: [1, "Price must be a positive number"],
    },
    photoUrl: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      enum: ["Vegetable", "Fruit", "Grain", "Pulse", "Spice", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
    location: {
      type: String,
      required: true,
      lowercase: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    postedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);
