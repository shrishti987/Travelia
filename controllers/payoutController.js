const Payout = require("../models/payout");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.hostPayoutDashboard =
async (req, res) => {

  try {

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
        },
        paymentStatus: "paid"
      });

    const totalEarnings =
      bookings.reduce(
        (sum, booking) =>
          sum + booking.totalPrice,
        0
      );

    const paidPayouts =
      await Payout.find({
        host: req.user._id,
        status: "approved"
      });

    const totalPaid =
      paidPayouts.reduce(
        (sum, payout) =>
          sum + payout.amount,
        0
      );

    const availableBalance =
      totalEarnings - totalPaid;

    const payouts =
      await Payout.find({
        host: req.user._id
      }).sort({
        createdAt: -1
      });

    res.render(
      "payouts/dashboard",
      {
        payouts,
        totalEarnings,
        totalPaid,
        availableBalance
      }
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to load payouts"
    );

    res.redirect("/");
  }
};

module.exports.requestPayout =
async (req, res) => {

  try {

    const amount =
      Number(req.body.amount);

    if (
      !amount ||
      amount <= 0
    ) {

      req.flash(
        "error",
        "Invalid amount"
      );

      return res.redirect(
        "/host/payouts"
      );
    }

    const payout =
      new Payout({
        host: req.user._id,
        amount,
        method:
          req.body.method ||
          "bank_transfer",
        status: "pending"
      });

    await payout.save();

    req.flash(
      "success",
      "Payout request submitted"
    );

    res.redirect(
      "/host/payouts"
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to request payout"
    );

    res.redirect(
      "/host/payouts"
    );
  }
};

module.exports.adminPayouts =
async (req, res) => {

  try {

    const payouts =
      await Payout.find()
      .populate(
        "host",
        "username email"
      )
      .sort({
        createdAt: -1
      });

    res.render(
      "admin/payouts",
      { payouts }
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to load payouts"
    );

    res.redirect("/admin");
  }
};

module.exports.approvePayout =
async (req, res) => {

  try {

    const payout =
      await Payout.findById(
        req.params.id
      );

    if (!payout) {

      req.flash(
        "error",
        "Payout not found"
      );

      return res.redirect(
        "/admin/payouts"
      );
    }

    payout.status =
      "approved";

    payout.processedAt =
      new Date();

    await payout.save();

    req.flash(
      "success",
      "Payout approved"
    );

    res.redirect(
      "/admin/payouts"
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to approve payout"
    );

    res.redirect(
      "/admin/payouts"
    );
  }
};

module.exports.rejectPayout =
async (req, res) => {

  try {

    const payout =
      await Payout.findById(
        req.params.id
      );

    if (!payout) {

      req.flash(
        "error",
        "Payout not found"
      );

      return res.redirect(
        "/admin/payouts"
      );
    }

    payout.status =
      "rejected";

    payout.rejectionReason =
      req.body.reason ||
      "Rejected by admin";

    await payout.save();

    req.flash(
      "success",
      "Payout rejected"
    );

    res.redirect(
      "/admin/payouts"
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to reject payout"
    );

    res.redirect(
      "/admin/payouts"
    );
  }
};

module.exports.payoutHistory =
async (req, res) => {

  try {

    const payouts =
      await Payout.find({
        host: req.user._id
      })
      .sort({
        createdAt: -1
      });

    res.render(
      "payouts/history",
      { payouts }
    );

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to load history"
    );

    res.redirect("/");
  }
};