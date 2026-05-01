const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  checkIn: Date,
  checkOut: Date,

  nights: {
    type: Number,
    min: 1
  },

  totalPrice: Number,

  currency: {
    type: String,
    default: "INR"
  },

  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction"
  }
}, { timestamps: true });

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
