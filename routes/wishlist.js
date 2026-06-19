const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlistController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   WISHLIST
========================= */

// View Wishlist
router.get("/", isLoggedIn, wishlistController.index);
router.get("/wishlist", isLoggedIn, wishlistController.index);

// Add / Remove Wishlist
router.post("/:id/toggle", isLoggedIn, wishlistController.toggle);
router.post("/:id", isLoggedIn, wishlistController.toggle);
router.post("/wishlist/:id", isLoggedIn, wishlistController.toggle);

module.exports = router;
