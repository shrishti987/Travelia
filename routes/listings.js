const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listingController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   LISTINGS
========================= */

// All Listings
router.get(
  "/listings",
  listingController.index
);

// New Listing Form
router.get(
  "/listings/new",
  isLoggedIn,
  listingController.renderNewForm
);

// Create Listing
router.post(
  "/listings",
  isLoggedIn,
  listingController.createListing
);

// Search Listings
router.get(
  "/listings/search",
  listingController.searchListings
);

// Recommendations
router.get(
  "/recommendations",
  isLoggedIn,
  listingController.recommendations
);

// Price Filter
router.get(
  "/listings/filter/price",
  listingController.priceFilter
);

// Category Filter
router.get(
  "/listings/category/:category",
  listingController.filterByCategory
);

// My Listings
router.get(
  "/my-listings",
  isLoggedIn,
  listingController.myListings
);

// Show Listing
router.get(
  "/listings/:id",
  listingController.showListing
);

// Edit Form
router.get(
  "/listings/:id/edit",
  isLoggedIn,
  listingController.renderEditForm
);

// Update Listing
router.put(
  "/listings/:id",
  isLoggedIn,
  listingController.updateListing
);

// Delete Listing
router.delete(
  "/listings/:id",
  isLoggedIn,
  listingController.deleteListing
);

module.exports = router;