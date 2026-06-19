const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");

module.exports.dashboardAnalytics = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalListings = await Listing.countDocuments();

    const totalBookings = await Booking.countDocuments();

    const revenueResult = await Transaction.aggregate([
      {
        $match: {
          status: "paid"
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$amount" }
        }
      }
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].revenue
        : 0;

    const monthlyRevenue = await Transaction.aggregate([
      {
        $match: {
          status: "paid"
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          revenue: {
            $sum: "$amount"
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    const topCategories = await Listing.aggregate([
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 5
      }
    ]);

    const topListings = await Booking.aggregate([
      {
        $group: {
          _id: "$listing",
          bookings: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          bookings: -1
        }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "listings",
          localField: "_id",
          foreignField: "_id",
          as: "listing"
        }
      }
    ]);

    res.render("admin/analytics", {
      totalUsers,
      totalListings,
      totalBookings,
      totalRevenue,
      monthlyRevenue,
      topCategories,
      topListings
    });

  } catch (err) {

    console.log(err);

    req.flash(
      "error",
      "Unable to load analytics"
    );

    res.redirect("/");
  }
};