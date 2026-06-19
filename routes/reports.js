const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   USER REPORTS
========================= */

// Create Report
router.post(
  "/reports",
  isLoggedIn,
  reportController.createReport
);

/* =========================
   ADMIN REPORTS
========================= */

// All Reports
router.get(
  "/admin/reports",
  isLoggedIn,
  reportController.getAllReports
);

// Single Report
router.get(
  "/admin/reports/:id",
  isLoggedIn,
  reportController.getReport
);

// Resolve Report
router.put(
  "/admin/reports/:id/resolve",
  isLoggedIn,
  reportController.resolveReport
);

// Reject Report
router.put(
  "/admin/reports/:id/reject",
  isLoggedIn,
  reportController.rejectReport
);

// Delete Report
router.delete(
  "/admin/reports/:id",
  isLoggedIn,
  reportController.deleteReport
);

module.exports = router;