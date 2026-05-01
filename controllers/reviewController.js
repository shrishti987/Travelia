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
