const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware/auth");
const dashboardController = require("../controllers/dashboardController");

router.get("/", isLoggedIn, wrapAsync(dashboardController.index));

module.exports = router;
