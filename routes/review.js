const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { isLoggedIn } = require("../middleware/auth");

/* =========================
   CREATE REVIEW
========================= */

router.post(
  "/listings/:id/reviews",
  isLoggedIn,
  reviewController.createReview
);

/* =========================
   EDIT REVIEW
========================= */

router.get(
  "/reviews/:reviewId/edit",
  isLoggedIn,
  reviewController.renderEditForm
);

/* =========================
   UPDATE REVIEW
========================= */

router.put(
  "/reviews/:reviewId",
  isLoggedIn,
  reviewController.updateReview
);

/* =========================
   DELETE REVIEW
========================= */

router.delete(
  "/reviews/:reviewId",
  isLoggedIn,
  reviewController.deleteReview
);

/* =========================
   MY REVIEWS
========================= */

router.get(
  "/my-reviews",
  isLoggedIn,
  reviewController.myReviews
);

module.exports = router;