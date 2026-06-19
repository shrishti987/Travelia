function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please login first.");
    return res.redirect("/login");
  }

  next();
}

/*
|--------------------------------------------------------------------------
| Admin Access
|--------------------------------------------------------------------------
*/

function isAdmin(req, res, next) {

  if (!req.user) {
    req.flash("error", "Please login first.");
    return res.redirect("/login");
  }

  if (req.user.role !== "admin") {
    req.flash("error", "Access denied.");
    return res.redirect("/");
  }

  next();
}

/*
|--------------------------------------------------------------------------
| Host Access
|--------------------------------------------------------------------------
*/

function isHost(req, res, next) {

  if (!req.user) {
    req.flash("error", "Please login first.");
    return res.redirect("/login");
  }

  if (
    req.user.role !== "host" &&
    req.user.role !== "admin"
  ) {
    req.flash("error", "Host access required.");
    return res.redirect("/");
  }

  next();
}

/*
|--------------------------------------------------------------------------
| Listing Owner
|--------------------------------------------------------------------------
*/

const Listing = require("../models/listing");

async function isListingOwner(req, res, next) {

  try {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    if (
      listing.owner &&
      listing.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      req.flash("error", "You do not own this listing.");
      return res.redirect("/listings");
    }

    next();

  } catch (err) {
    console.log(err);

    req.flash("error", "Something went wrong.");
    return res.redirect("/listings");
  }
}

/*
|--------------------------------------------------------------------------
| Prevent Auth Users
|--------------------------------------------------------------------------
*/

function isGuest(req, res, next) {

  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  next();
}

module.exports = {
  isLoggedIn,
  isAdmin,
  isHost,
  isListingOwner,
  isGuest
};