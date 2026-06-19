const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   PAYMENTS
========================= */

// Checkout Page
router.get(
  "/payments/checkout/:id",
  isLoggedIn,
  paymentController.checkout
);

// Verify Payment
router.post(
  "/payments/verify",
  isLoggedIn,
  paymentController.verify
);

// Payment Success
router.get(
  "/payments/success/:id",
  isLoggedIn,
  paymentController.success
);

// Payment Failure
router.get(
  "/payments/failure/:id",
  isLoggedIn,
  paymentController.failure
);

module.exports = router;