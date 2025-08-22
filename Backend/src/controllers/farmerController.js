const Crop = require("../models/cropSchema");
const Equipment = require("../models/EquipmentSchema");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createCrop = async (req, res, next) => {
  try {
    const {
      farmerId,
      name,
      quantity,
      expectedPrice,
      description,
      category,
      status,
      location,
    } = req.body;

    if (!isValidObjectId(farmerId)) {
      const err = new Error("Invalid farmer ID");
      err.statusCode = StatusCodes.BAD_REQUEST;
      return next(err);
    }

    if (
      !name ||
      !quantity ||
      !expectedPrice ||
      !description ||
      !category ||
      !status ||
      !location
    ) {
      const err = new Error("Please provide all required crop fields");
      err.statusCode = StatusCodes.BAD_REQUEST;
      return next(err);
    }

    let imageUrl = "";

    if (req.file && req.file.path) {
      const { url, publicId } = await uploadOnCloudinary(req.file.path);
      imageUrl = { url, publicId };
    }

    const crop = await Crop.create({
      farmerId,
      name,
      quantity,
      expectedPrice,
      description,
      category,
      status,
      location,
      imageUrl,
    });

    if (!crop) {
      const err = new Error("Unable to create crop");
      err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return next(err);
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ status: "success", data: crop });
  } catch (error) {
    return next(error);
  }
};

const getAllListing = async (req, res, next) => {
  try {
    const { _id } = req.user;

    // query: ?status=available or ?status=sold
    const { status, sortBy } = req.query;

    const query = { farmerId: _id };
    if (status) {
      query.status = status;
    }
    let sortCondition = { status: 1, postedOn: -1 };

    if (sortBy === "latest") {
      sortCondition = { postedOn: -1 };
    } else if (sortBy === "oldest") {
      sortCondition = { postedOn: 1 };
    } else if (sortBy === "soldFirst") {
      sortCondition = { status: 1, postedOn: -1 };
    }

    const allListing = await Crop.find(query).sort(sortCondition);

    return res.status(StatusCodes.OK).json({
      status: "Success",
      total: allListing.length,
      crops: allListing,
    });
  } catch (error) {
    return next(error);
  }
};

const getEquipmentListing = async (req, res, next) => {
  try {
    // Recommended: use req.user.location (after auth)
    const { location } = req.query;

    if (!location) {
      const err = new Error("Location is required");
      err.statusCode = StatusCodes.BAD_REQUEST;
      return next(err);
    }

    // Filter equipment that is available in the given location
    const allEquipment = await Equipment.find({
      location: location.toLowerCase(),
      available: true,
    }).sort({ postedOn: -1 });

    return res.status(StatusCodes.OK).json({
      status: "success",
      total: allEquipment.length,
      equipment: allEquipment,
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = { createCrop, getAllListing, getEquipmentListing };
