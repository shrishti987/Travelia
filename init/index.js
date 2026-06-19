const mongoose = require("mongoose");

const Listing = require("../models/listing");
const User = require("../models/user");
const Booking = require("../models/booking");
const Review = require("../models/review");
const Transaction = require("../models/transaction");
const Wishlist = require("../models/wishlist");

const initData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/travelia";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ MongoDB Connected");
}

main()
  .then(() => initDB())
  .catch(console.error);

async function initDB() {
  try {

    // ONLY FOR DEVELOPMENT
    await Listing.deleteMany({});

    const listings = initData.data.map((obj) => ({
      ...obj,
      avgRating: 4.5,
      isFraud: false
    }));

    await Listing.insertMany(listings);

    console.log("✅ Listings Initialized");

    console.log("📊 Database Summary");
    console.log("Listings:", await Listing.countDocuments());
    console.log("Users:", await User.countDocuments());
    console.log("Bookings:", await Booking.countDocuments());
    console.log("Reviews:", await Review.countDocuments());
    console.log("Transactions:", await Transaction.countDocuments());
    console.log("Wishlists:", await Wishlist.countDocuments());

    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}