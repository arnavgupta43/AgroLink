const express = require("express");
const router = express.Router();
const { validate } = require("../middlewares/validationMiddleware");
const validationMiddleware = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/checkRoleMiddleware");
const profile = require("../controllers/userController");

router.route("/profile").get(validationMiddleware, profile);

module.exports = router;
