const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");

router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

module.exports = router;
