const Crop = require("../models/cropSchema");
const Equipment = require("../models/EquipmentSchema");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const getAllCrops = async (req, res, next) => {
  try {
    const { name, location } = req.query;

    const query = { status: "available" };

    if (name) {
      query.name = { $regex: name, $options: "i" }; // case-insensitive match
    }

    if (location) {
      query.location = location.toLowerCase();
    }
    const sortCondition = { postedOn: -1 };

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

const buyCrop = async (req, res, next) => {
  try {
    const { cropId } = req.body;

    if (!isValidObjectId(cropId)) {
      const err = new Error("Invalid crop ID");
      err.statusCode = StatusCodes.BAD_REQUEST;
      return next(err);
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
      const err = new Error("Crop not found");
      err.statusCode = StatusCodes.NOT_FOUND;
      return next(err);
    }

    if (crop.status === "sold") {
      return res.status(StatusCodes.CONFLICT).json({
        status: "failed",
        msg: "Crop already sold",
      });
    }

    crop.status = "sold";
    await crop.save();

    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Order placed successfully",
      cropId: crop._id,
    });
  } catch (error) {
    return next(error);
  }
};

const createEquipment = async (req, res, next) => {
  try {
    const { ownerId, name, type, price, location, description, category } =
      req.body;
    if (
      !ownerId ||
      !name ||
      !type ||
      !price ||
      !location ||
      !description ||
      !category
    ) {
      const err = new Error("Please provide all required Equipment fields");
      err.statusCode = StatusCodes.BAD_REQUEST;
      return next(err);
    }
    let photoUrl = "";

    if (req.file && req.file.path) {
      const { url, publicId } = await uploadOnCloudinary(req.file.path);
      photoUrl = { url, publicId };
    }
    const equipment = await Equipment.create({
      ownerId,
      name,
      type,
      price,
      location,
      description,
      category,
      photoUrl,
    });
    if (!equipment) {
      const err = new Error("Unable to create equipment");
      err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return next(err);
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ status: "success", data: equipment });
  } catch (error) {
    return next(error);
  }
};

const getAllListing = async (req, res, next) => {
  try {
    const { _id } = req.user;

    // query: ?status=available or ?status=sold
    const { status, sortBy } = req.query;

    const query = { ownerId: _id };
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

    const allListing = await Equipment.find(query).sort(sortCondition);

    return res.status(StatusCodes.OK).json({
      status: "Success",
      total: allListing.length,
      equipment: allListing,
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = { getAllCrops, buyCrop, createEquipment, getAllListing };
