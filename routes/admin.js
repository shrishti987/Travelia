const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   ADMIN DASHBOARD
========================= */

router.get("/", isLoggedIn, adminController.dashboard);

/* =========================
   USER MANAGEMENT
========================= */

router.get("/users", isLoggedIn, adminController.getUsers);

router.get(
  "/users/:id",
  isLoggedIn,
  adminController.userDetails
);

router.delete(
  "/users/:id",
  isLoggedIn,
  adminController.deleteUser
);

/* =========================
   LISTING MANAGEMENT
========================= */

router.get(
  "/listings",
  isLoggedIn,
  adminController.getListings
);

router.put(
  "/listings/:id/fraud",
  isLoggedIn,
  adminController.markFraud
);

router.put(
  "/listings/:id/unfraud",
  isLoggedIn,
  adminController.unmarkFraud
);

router.delete(
  "/listings/:id",
  isLoggedIn,
  adminController.deleteListing
);

/* =========================
   REPORT MANAGEMENT
========================= */

router.get(
  "/reports",
  isLoggedIn,
  adminController.getReports
);

router.put(
  "/reports/:id/resolve",
  isLoggedIn,
  adminController.resolveReport
);

router.put(
  "/reports/:id/reject",
  isLoggedIn,
  adminController.rejectReport
);

/* =========================
   PAYOUT MANAGEMENT
========================= */

router.get(
  "/payouts",
  isLoggedIn,
  adminController.getPayouts
);

router.put(
  "/payouts/:id/pay",
  isLoggedIn,
  adminController.markPayoutPaid
);

/* =========================
   NOTIFICATIONS
========================= */

router.post(
  "/notifications",
  isLoggedIn,
  adminController.sendNotification
);

/* =========================
   AUDIT LOGS
========================= */

router.get(
  "/audit-logs",
  isLoggedIn,
  adminController.getAuditLogs
);

module.exports = router;