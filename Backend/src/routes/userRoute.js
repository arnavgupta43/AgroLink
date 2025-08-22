const express = require("express");
const router = express.Router();
const { validate } = require("../middleware/validationMiddleware");
const validationMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");
const profile = require("../controllers/userController");

router.route("/profile").get(validationMiddleware, profile);

module.exports = router;
