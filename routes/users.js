const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   PROFILE
========================= */

// View Profile
router.get(
  "/profile",
  isLoggedIn,
  userController.getProfile
);

// Update Profile
router.put(
  "/profile",
  isLoggedIn,
  userController.updateProfile
);

/* =========================
   DASHBOARD
========================= */

router.get(
  "/dashboard",
  isLoggedIn,
  userController.getDashboard
);

/* =========================
   MY LISTINGS
========================= */

router.get(
  "/my-listings",
  isLoggedIn,
  userController.getMyListings
);

/* =========================
   WISHLIST
========================= */

router.get(
  "/wishlist",
  isLoggedIn,
  userController.getWishlist
);

/* =========================
   FAVORITE DESTINATIONS
========================= */

router.get(
  "/favorite-destinations",
  isLoggedIn,
  userController.getFavoriteDestinations
);

/* =========================
   BOOKING HISTORY
========================= */

router.get(
  "/booking-history",
  isLoggedIn,
  userController.getBookingHistory
);

/* =========================
   DELETE ACCOUNT
========================= */

router.delete(
  "/profile/delete",
  isLoggedIn,
  userController.deleteAccount
);

module.exports = router;