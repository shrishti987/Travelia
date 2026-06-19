const User = require("../models/user");
const Listing = require("../models/listing");
const Wishlist = require("../models/wishlist");
const FavoriteDestination = require("../models/favoriteDestination");
const Booking = require("../models/booking");

/*
|--------------------------------------------------------------------------
| User Profile
|--------------------------------------------------------------------------
*/

module.exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    const totalBookings = await Booking.countDocuments({
      user: user._id
    });

    const totalListings = await Listing.countDocuments({
      owner: user._id
    });

    res.render("users/profile", {
      user,
      totalBookings,
      totalListings
    });

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to load profile.");
    res.redirect("/");
  }
};

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

module.exports.updateProfile = async (req, res) => {
  try {

    const { fullName, phone, bio } = req.body;

    const user = await User.findById(req.user._id);

    user.fullName = fullName;
    user.phone = phone;
    user.bio = bio;

    await user.save();

    req.flash("success", "Profile updated successfully.");
    res.redirect("/profile");

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to update profile.");
    res.redirect("/profile");
  }
};

/*
|--------------------------------------------------------------------------
| User Listings
|--------------------------------------------------------------------------
*/

module.exports.getMyListings = async (req, res) => {
  try {

    const listings = await Listing.find({
      owner: req.user._id
    });

    res.render("users/myListings", {
      listings
    });

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to load listings.");
    res.redirect("/");
  }
};

/*
|--------------------------------------------------------------------------
| Wishlist
|--------------------------------------------------------------------------
*/

module.exports.getWishlist = async (req, res) => {
  try {

    const wishlist = await Wishlist.findOne({
      user: req.user._id
    }).populate("listings");

    res.render("users/wishlist", {
      wishlist
    });

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to load wishlist.");
    res.redirect("/");
  }
};

/*
|--------------------------------------------------------------------------
| Favorite Destinations
|--------------------------------------------------------------------------
*/

module.exports.getFavoriteDestinations = async (req, res) => {
  try {

    const destinations = await FavoriteDestination.find({
      user: req.user._id
    });

    res.render("users/favoriteDestinations", {
      destinations
    });

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to load destinations.");
    res.redirect("/");
  }
};

/*
|--------------------------------------------------------------------------
| Booking History
|--------------------------------------------------------------------------
*/

module.exports.getBookingHistory = async (req, res) => {
  try {

    const bookings = await Booking.find({
      user: req.user._id
    })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.render("users/bookings", {
      bookings
    });

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to load bookings.");
    res.redirect("/");
  }
};

/*
|--------------------------------------------------------------------------
| Dashboard Stats
|--------------------------------------------------------------------------
*/

module.exports.getDashboard = async (req, res) => {
  try {

    const userId = req.user._id;

    const totalBookings = await Booking.countDocuments({
      user: userId
    });

    const totalListings = await Listing.countDocuments({
      owner: userId
    });

    const wishlistCount = await Wishlist.countDocuments({
      user: userId
    });

    res.render("users/dashboard", {
      totalBookings,
      totalListings,
      wishlistCount
    });

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to load dashboard.");
    res.redirect("/");
  }
};

/*
|--------------------------------------------------------------------------
| Delete Account
|--------------------------------------------------------------------------
*/

module.exports.deleteAccount = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.user._id);

    req.logout((err) => {
      if (err) {
        console.error(err);
      }
    });

    req.flash("success", "Account deleted successfully.");
    res.redirect("/");

  } catch (err) {
    console.error(err);

    req.flash("error", "Unable to delete account.");
    res.redirect("/profile");
  }
};