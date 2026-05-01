const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware/auth");
const wishlistController = require("../controllers/wishlistController");

router.get("/", isLoggedIn, wrapAsync(wishlistController.index));
router.post("/:id/toggle", isLoggedIn, wrapAsync(wishlistController.toggle));

module.exports = router;
