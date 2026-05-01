const Booking = require("../models/booking");
const Transaction = require("../models/transaction");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const [bookings, transactions, user] = await Promise.all([
    Booking.find({ user: req.user._id }).populate("listing").sort({ createdAt: -1 }),
    Transaction.find({ user: req.user._id }).populate("listing").sort({ createdAt: -1 }).limit(10),
    User.findById(req.user._id).populate("wishlist")
  ]);

  res.render("users/dashboard", {
    bookings,
    transactions,
    wishlist: user.wishlist || []
  });
};
