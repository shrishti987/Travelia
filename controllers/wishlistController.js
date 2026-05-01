const User = require("../models/user");

module.exports.index = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.render("users/wishlist", { listings: user.wishlist || [] });
};

module.exports.toggle = async (req, res) => {
  const user = await User.findById(req.user._id);
  const listingId = req.params.id;
  const exists = user.wishlist.some((item) => item.equals(listingId));

  if (exists) {
    user.wishlist.pull(listingId);
    req.flash("success", "Removed from wishlist.");
  } else {
    user.wishlist.addToSet(listingId);
    req.flash("success", "Saved to wishlist.");
  }

  await user.save();
  res.redirect(req.get("Referrer") || "/listings");
};
