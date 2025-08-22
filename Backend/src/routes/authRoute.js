const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const validationMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");
const { userLogin, createUser } = require("../controllers/authController");
router.route("/create/user").post(createUser);
router
  .route("/login/farmer")
  .post(validationMiddleware, checkRole("Farmer"), userLogin);

router
  .route("/login/buyer")
  .post(validationMiddleware, checkRole("Buyer"), userLogin);

module.exports = router;
