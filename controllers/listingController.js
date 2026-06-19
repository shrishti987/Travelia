const Listing = require("../models/listing");
const User = require("../models/user");

module.exports.index = async (req, res) => {

  const listings = await Listing.find({
    isFraud: false
  })
    .populate("owner")
    .sort({ createdAt: -1 });

  res.render("listings/index", {
    listings
  });
};

module.exports.showListing = async (req, res) => {

  const listing =
    await Listing.findById(req.params.id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      });

  if (!listing) {

    req.flash(
      "error",
      "Listing not found"
    );

    return res.redirect("/listings");
  }

  if (req.user) {

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          viewedListings: listing._id
        }
      }
    );
  }

  res.render(
    "listings/show",
    { listing }
  );
};

module.exports.renderNewForm =
(req, res) => {

  res.render("listings/new");
};

module.exports.createListing =
async (req, res) => {

  try {

    const listing =
      new Listing(req.body.listing);

    listing.owner =
      req.user._id;

    await listing.save();

    req.flash(
      "success",
      "Listing created successfully"
    );

    res.redirect(
      `/listings/${listing._id}`
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to create listing"
    );

    res.redirect("/listings");
  }
};

module.exports.renderEditForm =
async (req, res) => {

  const listing =
    await Listing.findById(
      req.params.id
    );

  if (!listing) {

    req.flash(
      "error",
      "Listing not found"
    );

    return res.redirect("/listings");
  }

  res.render(
    "listings/edit",
    { listing }
  );
};

module.exports.updateListing =
async (req, res) => {

  try {

    await Listing.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body.listing
      },
      {
        runValidators: true
      }
    );

    req.flash(
      "success",
      "Listing updated successfully"
    );

    res.redirect(
      `/listings/${req.params.id}`
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to update listing"
    );

    res.redirect("/listings");
  }
};

module.exports.deleteListing =
async (req, res) => {

  try {

    await Listing.findByIdAndDelete(
      req.params.id
    );

    req.flash(
      "success",
      "Listing deleted"
    );

    res.redirect("/listings");

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to delete listing"
    );

    res.redirect("/listings");
  }
};

module.exports.searchListings =
async (req, res) => {

  const { location } = req.query;

  const listings =
    await Listing.find({
      $text: {
        $search: location
      }
    });

  res.render(
    "listings/search",
    {
      listings,
      location
    }
  );
};

module.exports.filterByCategory =
async (req, res) => {

  const listings =
    await Listing.find({
      category:
        req.params.category
    });

  res.render(
    "listings/category",
    {
      listings,
      category:
        req.params.category
    }
  );
};

module.exports.myListings =
async (req, res) => {

  const listings =
    await Listing.find({
      owner:
        req.user._id
    });

  res.render(
    "listings/myListings",
    { listings }
  );
};

module.exports.recommendations =
async (req, res) => {

  const user =
    await User.findById(
      req.user._id
    );

  const preferred =
    user.preferredCategories;

  let listings = [];

  if (
    preferred &&
    preferred.length > 0
  ) {

    listings =
      await Listing.find({
        category: {
          $in: preferred
        }
      })
      .limit(12);

  } else {

    listings =
      await Listing.find()
      .sort({
        avgRating: -1
      })
      .limit(12);
  }

  res.render(
    "listings/recommendations",
    { listings }
  );
};

module.exports.priceFilter =
async (req, res) => {

  const min =
    Number(req.query.min) || 0;

  const max =
    Number(req.query.max) || 100000;

  const listings =
    await Listing.find({
      price: {
        $gte: min,
        $lte: max
      }
    });

  res.render(
    "listings/filter",
    {
      listings,
      min,
      max
    }
  );
};