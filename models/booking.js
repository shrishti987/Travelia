const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  bookingNumber: {
    type: String,
    unique: true
  },

  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },

  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  checkIn: {
    type: Date,
    required: true
  },

  checkOut: {
    type: Date,
    required: true
  },

  nights: {
    type: Number,
    min: 1
  },

  guestsCount: {
    type: Number,
    default: 1
  },

  specialRequest: {
    type: String,
    default: ""
  },

  totalPrice: {
    type: Number,
    required: true
  },

  cleaningFee: {
    type: Number,
    default: 0
  },

  serviceFee: {
    type: Number,
    default: 0
  },

  taxes: {
    type: Number,
    default: 0
  },

  currency: {
    type: String,
    default: "INR"
  },

  bookingStatus: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "upcoming",
      "completed",
      "cancelled"
    ],
    default: "pending"
  },

  paymentStatus: {
    type: String,
    enum: [
      "pending",
      "paid",
      "failed",
      "refunded"
    ],
    default: "pending"
  },

  cancellationReason: String,

  refundAmount: {
    type: Number,
    default: 0
  },

  razorpayOrderId: String,

  razorpayPaymentId: String,

  transactionId: String,

  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction"
  }

}, {
  timestamps: true
});

bookingSchema.index({
  guest: 1,
  createdAt: -1
});

bookingSchema.index({
  host: 1
});

bookingSchema.index({
  listing: 1,
  checkIn: 1,
  checkOut: 1
});

module.exports = mongoose.model("Booking", bookingSchema);