const express = require("express");
const router = express.Router();

const payoutController = require("../controllers/payoutController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   HOST PAYOUTS
========================= */

// Host Dashboard
router.get(
  "/host/payouts",
  isLoggedIn,
  payoutController.hostPayoutDashboard
);

// Request Payout
router.post(
  "/host/payouts/request",
  isLoggedIn,
  payoutController.requestPayout
);

// Payout History
router.get(
  "/host/payouts/history",
  isLoggedIn,
  payoutController.payoutHistory
);

/* =========================
   ADMIN PAYOUTS
========================= */

// All Payout Requests
router.get(
  "/admin/payouts",
  isLoggedIn,
  payoutController.adminPayouts
);

// Approve Payout
router.put(
  "/admin/payouts/:id/approve",
  isLoggedIn,
  payoutController.approvePayout
);

// Reject Payout
router.put(
  "/admin/payouts/:id/reject",
  isLoggedIn,
  payoutController.rejectPayout
);

module.exports = router;