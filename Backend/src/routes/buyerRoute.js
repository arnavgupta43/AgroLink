const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const validationMiddleware = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/checkRoleMiddleware");

const {
  getAllCrops,
  buyCrop,
  createEquipment,
  getAllListing,
} = require("../controllers/buyerController");
router.route("/getallcrop").get(validationMiddleware,checkRole("Buyer"), getAllCrops);
router
  .route("/buycrop")
  .post(validationMiddleware, checkRole("Buyer"), buyCrop);
router
  .route("/create")
  .post(
    validationMiddleware,
    upload.single("file"),
    checkRole("Buyer"),
    createEquipment
  );

router
  .route("/listings")
  .get(validationMiddleware, checkRole("Buyer"), getAllListing);
module.exports = router;
