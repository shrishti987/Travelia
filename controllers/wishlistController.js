const User = require("../models/user");
const WISHLIST_CARD_FIELDS = "title image price location country category avgRating isFraud";

module.exports.index = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("wishlist", WISHLIST_CARD_FIELDS)
    .lean();

  res.render("users/wishlist", { listings: user.wishlist || [] });
};

module.exports.toggle = async (req, res) => {
  const listingId = req.params.id;
  const exists = await User.exists({
    _id: req.user._id,
    wishlist: listingId
  });

  if (exists) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: listingId }
    });
    req.flash("success", "Removed from wishlist.");
  } else {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishlist: listingId }
    });
    req.flash("success", "Saved to wishlist.");
  }

  res.redirect(req.get("Referrer") || "/listings");
};
