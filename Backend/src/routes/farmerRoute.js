const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const validationMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

const {
  createCrop,
  getAllListing,
  getEquipmentListing,
  buyEquipment,
} = require("../controllers/farmerController");

router
  .route("/create")
  .post(
    validationMiddleware,
    upload.single("file"),
    checkRole("Farmer"),
    createCrop
  );
router
  .route("/getListing")
  .get(validationMiddleware, checkRole("Farmer"), getAllListing);
router
  .route("/getEquipmentListing")
  .get(validationMiddleware, checkRole("Farmer"), getEquipmentListing);
router
  .route("/buy")
  .post(validationMiddleware, checkRole("Farmer"), buyEquipment);

module.exports = router;
