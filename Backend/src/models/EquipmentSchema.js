const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Equipment name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["rent", "sale"],
      required: [true, "Type must be 'rent' or 'sale'"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be at least 1"],
    },
    location: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
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
      enum: ["Tractor", "Plough", "Harvester", "Sprayer", "Other"],
      default: "Other",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
    postedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
