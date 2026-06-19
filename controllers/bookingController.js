const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
  try {

    const listing = await Listing.findById(
      req.params.id
    );

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    const {
      checkIn,
      checkOut
    } = req.body;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (endDate <= startDate) {
      req.flash(
        "error",
        "Check-out must be after check-in"
      );
      return res.redirect(`/listings/${listing._id}`);
    }

    const overlappingBooking =
      await Booking.findOne({
        listing: listing._id,
        status: {
          $ne: "cancelled"
        },
        checkIn: {
          $lt: endDate
        },
        checkOut: {
          $gt: startDate
        }
      });

    if (overlappingBooking) {
      req.flash(
        "error",
        "Selected dates are unavailable"
      );
      return res.redirect(`/listings/${listing._id}`);
    }

    const nights =
      Math.ceil(
        (endDate - startDate) /
        (1000 * 60 * 60 * 24)
      );

    const totalPrice =
      nights * listing.price;

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn: startDate,
      checkOut: endDate,
      nights,
      totalPrice,
      paymentStatus: "pending"
    });

    await booking.save();

    req.flash(
      "success",
      "Booking created successfully"
    );

    res.redirect(`/booking/${booking._id}`);

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Booking failed"
    );

    res.redirect("/listings");
  }
};

module.exports.myTrips = async (req, res) => {

  const bookings =
    await Booking.find({
      user: req.user._id
    })
      .populate("listing")
      .sort({ createdAt: -1 });

  res.render(
    "bookings/trips",
    { bookings }
  );
};

module.exports.bookingDetails =
async (req, res) => {

  const booking =
    await Booking.findById(
      req.params.id
    )
      .populate("listing")
      .populate("user");

  if (!booking) {
    req.flash(
      "error",
      "Booking not found"
    );
    return res.redirect("/trips");
  }

  res.render(
    "bookings/show",
    { booking }
  );
};

module.exports.cancelBooking =
async (req, res) => {

  const booking =
    await Booking.findById(
      req.params.id
    );

  if (!booking) {
    req.flash(
      "error",
      "Booking not found"
    );
    return res.redirect("/trips");
  }

  if (
    booking.user.toString() !==
    req.user._id.toString()
  ) {
    req.flash(
      "error",
      "Unauthorized"
    );
    return res.redirect("/trips");
  }

  booking.status = "cancelled";

  await booking.save();

  req.flash(
    "success",
    "Booking cancelled"
  );

  res.redirect("/trips");
};

module.exports.hostBookings =
async (req, res) => {

  const listings =
    await Listing.find({
      owner: req.user._id
    });

  const listingIds =
    listings.map(
      listing => listing._id
    );

  const bookings =
    await Booking.find({
      listing: {
        $in: listingIds
      }
    })
      .populate("listing")
      .populate("user")
      .sort({ createdAt: -1 });

  res.render(
    "bookings/hostBookings",
    { bookings }
  );
};

module.exports.updateStatus =
async (req, res) => {

  const booking =
    await Booking.findById(
      req.params.id
    );

  if (!booking) {
    req.flash(
      "error",
      "Booking not found"
    );
    return res.redirect("back");
  }

  booking.status =
    req.body.status;

  await booking.save();

  req.flash(
    "success",
    "Booking updated"
  );

  res.redirect("back");
};