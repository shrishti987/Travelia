const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

async function refreshAverageRating(listingId) {
  const stats = await Review.aggregate([
    { $match: { listing: listingId } },
    { $group: { _id: "$listing", avgRating: { $avg: "$rating" } } }
  ]);

  await Listing.findByIdAndUpdate(listingId, {
    avgRating: stats.length ? Number(stats[0].avgRating.toFixed(1)) : 0
  });
}

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;
  review.listing = listing._id;

  await review.save();

  await Listing.findByIdAndUpdate(listing._id, {
    $push: { reviews: review._id }
  });
  await refreshAverageRating(listing._id);

  req.flash("success", "Review added successfully.");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const review = await Review.findById(req.params.reviewId).populate("listing");

  if (!review) {
    throw new ExpressError(404, "Review not found");
  }

  if (
    review.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ExpressError(403, "You can only edit your own review");
  }

  res.render("reviews/edit", { review });
};

module.exports.updateReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    throw new ExpressError(404, "Review not found");
  }

  if (
    review.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ExpressError(403, "You can only update your own review");
  }

  review.rating = req.body.review.rating;
  review.comment = req.body.review.comment;
  review.updatedAt = new Date();
  await review.save();
  await refreshAverageRating(review.listing);

  req.flash("success", "Review updated successfully.");
  res.redirect(`/listings/${review.listing}`);
};

module.exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    throw new ExpressError(404, "Review not found");
  }

  if (
    review.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ExpressError(403, "You can only delete your own review");
  }

  await Listing.findByIdAndUpdate(review.listing, {
    $pull: { reviews: review._id }
  });
  await Review.findByIdAndDelete(review._id);
  await refreshAverageRating(review.listing);

  req.flash("success", "Review deleted successfully.");
  res.redirect(`/listings/${review.listing}`);
};

module.exports.myReviews = async (req, res) => {
  const reviews = await Review.find({ author: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("users/reviews", { reviews });
};
