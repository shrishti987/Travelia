const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");

const getTotalUsers = async () => {
  return await User.countDocuments();
};

const getTotalListings = async () => {
  return await Listing.countDocuments();
};

const getTotalBookings = async () => {
  return await Booking.countDocuments();
};

const getTotalRevenue = async () => {
  const result = await Transaction.aggregate([
    {
      $match: {
        status: "paid"
      }
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: "$amount"
        }
      }
    }
  ]);

  return result.length > 0
    ? result[0].revenue
    : 0;
};

const getMonthlyRevenue = async () => {
  return await Transaction.aggregate([
    {
      $match: {
        status: "paid"
      }
    },
    {
      $group: {
        _id: {
          month: {
            $month: "$createdAt"
          },
          year: {
            $year: "$createdAt"
          }
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
};

const getTopCategories = async (limit = 5) => {
  return await Listing.aggregate([
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
      $limit: limit
    }
  ]);
};

const getTopListings = async (limit = 5) => {
  return await Booking.aggregate([
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
      $limit: limit
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
};

module.exports = {
  getTotalUsers,
  getTotalListings,
  getTotalBookings,
  getTotalRevenue,
  getMonthlyRevenue,
  getTopCategories,
  getTopListings
};