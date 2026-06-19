const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   USER DASHBOARD
========================= */

router.get("/", isLoggedIn, dashboardController.index);
router.get("/dashboard", isLoggedIn, dashboardController.index);

module.exports = router;
