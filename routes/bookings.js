const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   BOOKINGS
========================= */

// Create Booking
router.post(
  "/listings/:id/book",
  isLoggedIn,
  bookingController.createBooking
);

// My Trips
router.get(
  "/trips",
  isLoggedIn,
  bookingController.myTrips
);

// Booking Details
router.get(
  "/booking/:id",
  isLoggedIn,
  bookingController.bookingDetails
);

// Cancel Booking
router.put(
  "/booking/:id/cancel",
  isLoggedIn,
  bookingController.cancelBooking
);

// Host Bookings
router.get(
  "/host/bookings",
  isLoggedIn,
  bookingController.hostBookings
);

// Update Booking Status
router.put(
  "/booking/:id/status",
  isLoggedIn,
  bookingController.updateStatus
);

module.exports = router;