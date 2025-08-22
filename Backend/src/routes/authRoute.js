const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const validationMiddleware = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/checkRoleMiddleware");
const { userLogin, createUser } = require("../controllers/authController");
router.route("/create/user").post(createUser);
router
  .route("/login/farmer")
  .post(validationMiddleware, checkRole("Farmer"), userLogin);

router
  .route("/login/buyer")
  .post(validationMiddleware, checkRole("Buyer"), userLogin);

module.exports = router;
