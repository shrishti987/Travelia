const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analyticsController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   ANALYTICS DASHBOARD
========================= */

router.get(
  "/",
  isLoggedIn,
  analyticsController.dashboardAnalytics
);

module.exports = router;